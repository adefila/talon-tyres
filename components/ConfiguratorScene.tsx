"use client";

import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

interface TyreProps {
  accentColor: string;
  rimColor: string;
  rimRoughness: number;
  selectedSize?: string;
}

// ── Constants ────────────────────────────────────────────────────
const OUTER_R  = 0.450;   // outer tyre radius (lower profile vs old 0.490)
const RIM_R    = 0.302;   // bead seat / rim outer radius
const HUB_R    = 0.080;
const BARREL_D = 0.220;   // rim width (slightly wider for low-profile look)
const FACE_Z   =  BARREL_D / 2;  // +0.110
const REAR_Z   = -BARREL_D / 2;  // -0.110

const SPOKE_D  = BARREL_D * 0.82;
const SPOKE_Z  = FACE_Z - SPOKE_D;

// ── Realistic tyre profile — 45-series performance geometry ─────
// section width 310mm, sidewall height 148mm → ~47% aspect ratio
// Built-in circumferential grooves create genuine tread rib structure
function buildTyreProfile(): THREE.Vector2[] {
  const hw = 0.155;    // half section width
  const tw = 0.105;    // half tread width
  const SR = 0.006;    // shoulder arc radius (sharp, performance-style)
  const GW = 0.009;    // groove half-width
  const GD = 0.009;    // groove depth
  const GZ = [-0.073, -0.023, 0.023, 0.073] as const; // 4 circumferential grooves

  const ss  = (t: number) => t * t * (3 - 2 * t); // smoothstep
  const sz  = -hw + 0.016;    // sidewall z start (after bead shelf)
  const ez  = -tw - SR;       // sidewall z end = -0.111
  const sr  = RIM_R + 0.008;  // sidewall r start = 0.310
  const er  = OUTER_R - SR;   // sidewall r end   = 0.444

  const P = (r: number, z: number) => new THREE.Vector2(r, z);
  const pts: THREE.Vector2[] = [];

  // ── LEFT BEAD ──
  pts.push(P(RIM_R,         -hw));
  pts.push(P(RIM_R + 0.004, -hw + 0.007));
  pts.push(P(sr,             sz));

  // ── LEFT SIDEWALL — S-curve with outward bulge (14 pts) ──
  for (let i = 1; i <= 14; i++) {
    const t = i / 14;
    const z = sz + t * (ez - sz);
    const r = sr + ss(t) * (er - sr) + 0.008 * Math.sin(t * Math.PI);
    pts.push(P(r, z));
  }

  // ── LEFT SHOULDER — tight arc (8 pts) → ends at (OUTER_R, -tw) ──
  for (let i = 1; i <= 8; i++) {
    const t = i / 8;
    pts.push(P(
      OUTER_R - SR * Math.cos((Math.PI / 2) * t),
      ez      + SR * Math.sin((Math.PI / 2) * t),
    ));
  }

  // ── TREAD WITH 4 BUILT-IN CIRCUMFERENTIAL GROOVES ──
  // V-shaped dips at each groove position create genuine groove shadow
  let prevZ = -tw;
  for (const gz of GZ) {
    const approach = gz - GW;
    if (approach > prevZ + 0.002) pts.push(P(OUTER_R, approach));
    pts.push(P(OUTER_R - GD, gz));       // groove bottom
    prevZ = gz + GW;
    if (prevZ < tw - 0.002) pts.push(P(OUTER_R, prevZ));
  }
  pts.push(P(OUTER_R, tw));

  // ── RIGHT SHOULDER — mirror arc (7 pts) ──
  for (let i = 1; i <= 7; i++) {
    const t = i / 8;
    pts.push(P(
      OUTER_R - SR * Math.cos((Math.PI / 2) * (1 - t)),
      tw      + SR - SR * Math.sin((Math.PI / 2) * (1 - t)),
    ));
  }

  // ── RIGHT SIDEWALL — mirror (13 pts) ──
  for (let i = 13; i >= 1; i--) {
    const t = i / 14;
    const z = -(sz + t * (ez - sz));
    const r = sr + ss(t) * (er - sr) + 0.008 * Math.sin(t * Math.PI);
    pts.push(P(r, z));
  }

  // ── RIGHT BEAD ──
  pts.push(P(sr,             +hw - 0.016));
  pts.push(P(RIM_R + 0.004,  +hw - 0.007));
  pts.push(P(RIM_R,          +hw));

  return pts;
}

// ── Spoke arm shape ──────────────────────────────────────────────
function makeSpokeArm(): THREE.Shape {
  const hw = 0.015;
  const rw = 0.010;
  const y0 = HUB_R + 0.004;
  const y1 = RIM_R - 0.014;
  const s  = new THREE.Shape();
  s.moveTo(-hw, y0);
  s.lineTo(-rw, y1);
  s.quadraticCurveTo(-rw, y1 + 0.012, 0, y1 + 0.012);
  s.quadraticCurveTo( rw, y1 + 0.012, rw, y1);
  s.lineTo(hw, y0);
  s.closePath();
  return s;
}

function buildRimMat(color: string, roughness: number) {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    roughness: Math.max(roughness, 0.03),
    metalness: roughness < 0.45 ? 0.96 : 0.74,
    clearcoat: roughness < 0.20 ? 1.0 : roughness < 0.45 ? 0.68 : 0.10,
    clearcoatRoughness: 0.03,
    envMapIntensity: 2.8,
  });
}

// ── Static geometry ──────────────────────────────────────────────
const armShape   = makeSpokeArm();
const armExtOpts: THREE.ExtrudeGeometryOptions = {
  depth: SPOKE_D,
  bevelEnabled: true,
  bevelThickness: 0.004,
  bevelSize: 0.004,
  bevelSegments: 3,
};

const ARM_ANGLES = Array.from({ length: 5 }, (_, g) => {
  const base = (g / 5) * Math.PI * 2;
  return [base - 0.175, base + 0.175];
}).flat();

const BOLT_PCD    = HUB_R + (RIM_R - HUB_R) * 0.42;
const BOLT_ANGLES = Array.from({ length: 5 }, (_, i) => (i / 5) * Math.PI * 2);


// ── RealWheel ────────────────────────────────────────────────────
function RealWheel({ rimColor, rimRoughness, accentColor }: Pick<TyreProps, "rimColor" | "rimRoughness" | "accentColor">) {

  const tyreMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#080810"),
    roughness: 0.96,
    metalness: 0.0,
    clearcoat: 0.05,
    clearcoatRoughness: 0.90,
  }), []);

  const rimMat    = useMemo(() => buildRimMat(rimColor, rimRoughness), [rimColor, rimRoughness]);

  const chromeMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#DAE2F6"),
    roughness: 0.02, metalness: 0.99,
    clearcoat: 1.0, clearcoatRoughness: 0.01,
    envMapIntensity: 3.8,
  }), []);

  const barrelMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#0C0C16"),
    roughness: 0.55, metalness: 0.48,
  }), []);

  const hubMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#020206"),
    roughness: 0.85, metalness: 0.10,
  }), []);

  const capMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(rimColor),
    roughness: 0.04, metalness: 0.97,
    clearcoat: 1.0, clearcoatRoughness: 0.02,
  }), [rimColor]);

  const accentMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(accentColor),
    roughness: 0.28, metalness: 0.52,
    emissive: new THREE.Color(accentColor),
    emissiveIntensity: 0.12,
  }), [accentColor]);


  // ── Geometries ──────────────────────────────────────────────────

  // Tyre body — LatheGeometry with full profile including grooves
  const tyreGeo = useMemo(() => {
    const profile = buildTyreProfile();
    const g = new THREE.LatheGeometry(profile, 180);
    g.rotateX(Math.PI / 2);
    return g;
  }, []);

  const barrelGeo = useMemo(() => {
    const g = new THREE.CylinderGeometry(RIM_R - 0.001, RIM_R - 0.001, BARREL_D, 120, 1, true);
    g.rotateX(Math.PI / 2);
    return g;
  }, []);

  const armGeo = useMemo(() => new THREE.ExtrudeGeometry(armShape, armExtOpts), []);

  const lipGeo = useMemo(() => new THREE.TorusGeometry(RIM_R, 0.018, 24, 120), []);

  const hubBarrelGeo = useMemo(() => {
    const g = new THREE.CylinderGeometry(HUB_R, HUB_R, BARREL_D + 0.022, 56);
    g.rotateX(Math.PI / 2);
    return g;
  }, []);

  const capGeo = useMemo(() => {
    const g = new THREE.CylinderGeometry(HUB_R * 0.84, HUB_R * 0.84, 0.016, 40);
    g.rotateX(Math.PI / 2);
    return g;
  }, []);

  const boltGeo = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.011, 0.014, 0.036, 16);
    g.rotateX(Math.PI / 2);
    return g;
  }, []);


  return (
    <group>
      {/* ── TYRE BODY — LatheGeometry with built-in grooves ── */}
      <mesh geometry={tyreGeo} material={tyreMat} />

      {/* ── RIM BARREL ── */}
      <mesh geometry={barrelGeo} material={barrelMat} />

      {/* ── 10 SPOKE ARMS ── */}
      {ARM_ANGLES.map((angle, i) => (
        <mesh key={i} geometry={armGeo} material={rimMat}
          position={[0, 0, SPOKE_Z]} rotation={[0, 0, angle]} />
      ))}

      {/* ── CHROME LIP RINGS ── */}
      <mesh geometry={lipGeo} material={chromeMat} position={[0, 0,  FACE_Z]} />
      <mesh geometry={lipGeo} material={chromeMat} position={[0, 0,  REAR_Z]} />

      {/* ── HUB BARREL ── */}
      <mesh geometry={hubBarrelGeo} material={hubMat} />

      {/* ── CENTRE CAP ── */}
      <mesh geometry={capGeo} material={capMat} position={[0, 0, FACE_Z + 0.006]} />

      {/* ── SPOKE BASE ACCENT RING ── */}
      <mesh material={accentMat} position={[0, 0, SPOKE_Z + SPOKE_D * 0.06]}>
        <torusGeometry args={[HUB_R + 0.006, 0.006, 10, 80]} />
      </mesh>

      {/* ── LUG BOLTS ── */}
      {BOLT_ANGLES.map((angle, i) => (
        <mesh key={i} geometry={boltGeo} material={chromeMat}
          position={[
            Math.cos(angle) * BOLT_PCD,
            Math.sin(angle) * BOLT_PCD,
            FACE_Z - SPOKE_D * 0.20,
          ]}
        />
      ))}
    </group>
  );
}

// ── Size scale ───────────────────────────────────────────────────
function getSizeScale(s = "245/45 R19") {
  const m = s.match(/(\d+)\/(\d+)/);
  if (!m) return 1.0;
  const asp = parseInt(m[2]);
  if (asp <= 35) return 0.88;
  if (asp <= 42) return 0.94;
  if (asp <= 50) return 1.00;
  if (asp <= 60) return 1.07;
  return 1.13;
}

// ── Draggable + auto-rotating wrapper ───────────────────────────
function DraggableWheel({ rimColor, rimRoughness, accentColor, selectedSize = "245/45 R19" }: TyreProps) {
  const groupRef   = useRef<THREE.Group>(null!);
  const isDragging = useRef(false);
  const prevMouse  = useRef({ x: 0, y: 0 });
  const velocity   = useRef({ x: 0, y: 0 });
  const rot        = useRef({ x: 0.30, y: 0.52 });
  const { gl }     = useThree();
  const scale      = getSizeScale(selectedSize);

  useEffect(() => {
    const canvas = gl.domElement;
    const down = (e: PointerEvent) => {
      isDragging.current = true;
      prevMouse.current  = { x: e.clientX, y: e.clientY };
      velocity.current   = { x: 0, y: 0 };
      canvas.style.cursor = "grabbing";
    };
    const move = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - prevMouse.current.x;
      const dy = e.clientY - prevMouse.current.y;
      velocity.current  = { x: dy * 0.009, y: dx * 0.009 };
      rot.current.x    += dy * 0.009;
      rot.current.y    += dx * 0.009;
      prevMouse.current = { x: e.clientX, y: e.clientY };
    };
    const up = () => { isDragging.current = false; canvas.style.cursor = "grab"; };
    canvas.style.cursor = "grab";
    canvas.addEventListener("pointerdown", down);
    window.addEventListener("pointermove",  move);
    window.addEventListener("pointerup",    up);
    return () => {
      canvas.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove",  move);
      window.removeEventListener("pointerup",    up);
    };
  }, [gl]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (!isDragging.current) {
      rot.current.y    += delta * 0.20;
      velocity.current.x *= 0.92;
      velocity.current.y *= 0.92;
      rot.current.x    += velocity.current.x;
      rot.current.y    += velocity.current.y;
    }
    groupRef.current.rotation.x = rot.current.x;
    groupRef.current.rotation.y = rot.current.y;
    groupRef.current.rotation.z = 0;
  });

  return (
    <group ref={groupRef} scale={[scale, scale, scale]}>
      <RealWheel rimColor={rimColor} rimRoughness={rimRoughness} accentColor={accentColor} />
    </group>
  );
}

// ── Exported scene ───────────────────────────────────────────────
export default function ConfiguratorScene({ accentColor, rimColor, rimRoughness, selectedSize }: TyreProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 1.80], fov: 34 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <ambientLight intensity={0.22} color="#eef0ff" />
      <directionalLight position={[3, 6, 4]}   intensity={3.4} color="#ffffff" />
      <directionalLight position={[-3, -2, 3]}  intensity={0.55} color="#d4e0ff" />
      <pointLight position={[-5, 1, -1]}  intensity={2.4} color="#c8d8ff" distance={12} />
      <pointLight position={[ 5, 1, -1]}  intensity={2.0} color="#ffffff"  distance={12} />
      <pointLight position={[0, 0, -5]}   intensity={3.2} color={accentColor} distance={14} />
      <pointLight position={[1, 4, 4]}    intensity={1.8} color="#ffffff"  distance={11} />
      <Environment preset="studio" background={false} />
      <DraggableWheel
        accentColor={accentColor}
        rimColor={rimColor}
        rimRoughness={rimRoughness}
        selectedSize={selectedSize}
      />
    </Canvas>
  );
}
