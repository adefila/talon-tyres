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

// ─── Wheel constants (all in scene units) ───────────────────
const OUTER_R  = 0.490;                    // tyre outer radius (tread)
const TUBE_R   = 0.092;                    // tyre cross-section tube radius
const RIM_R    = OUTER_R - 2 * TUBE_R;    // ≈ 0.306  rim outer radius
const HUB_R    = 0.078;                    // hub cap radius
const BARREL_D = 0.136;                    // wheel barrel depth (width)
const FACE_Z   =  BARREL_D / 2;           // front face at +z
const REAR_Z   = -BARREL_D / 2;           // rear  face at -z
const ARM_DEPTH = 0.024;                   // spoke arm extrusion depth

// ─── Single spoke arm shape (standard, points along +Y) ─────
function makeSpokeArm(): THREE.Shape {
  const hw = 0.0125;            // half-width at hub end
  const rw = 0.0175;            // half-width at rim end
  const y0 = HUB_R + 0.004;    // inner (hub) start
  const y1 = RIM_R - 0.022;    // outer (rim) end

  const s = new THREE.Shape();
  s.moveTo(-hw, y0);
  s.lineTo(-rw, y1);
  // rounded tip
  s.quadraticCurveTo(-rw,          y1 + 0.009, 0, y1 + 0.009);
  s.quadraticCurveTo( rw,          y1 + 0.009, rw, y1);
  s.lineTo(hw, y0);
  s.closePath();
  return s;
}

// ─── Build materials from current props ─────────────────────
function buildRimMat(color: string, roughness: number) {
  const clearcoat = roughness < 0.20 ? 1.0 : roughness < 0.45 ? 0.65 : 0.12;
  const metalness = roughness < 0.45 ? 0.93 : 0.68;
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    roughness: Math.max(roughness, 0.04),
    metalness,
    clearcoat,
    clearcoatRoughness: 0.04,
    envMapIntensity: 2.0,
  });
}

// ─── Pre-built geometries (static, shared) ──────────────────
const armShape = makeSpokeArm();
const armExtrudeSettings: THREE.ExtrudeGeometryOptions = {
  depth: ARM_DEPTH,
  bevelEnabled: true,
  bevelThickness: 0.003,
  bevelSize: 0.003,
  bevelSegments: 2,
};

// 10 arm angles: 5 groups × 2 arms each, ±0.22 rad from group center
const ARM_ANGLES = Array.from({ length: 5 }, (_, g) =>
  [(g / 5) * Math.PI * 2 - 0.22, (g / 5) * Math.PI * 2 + 0.22]
).flat();

// 5 lug bolt positions (on a PCD circle)
const BOLT_PCD = HUB_R + (RIM_R - HUB_R) * 0.40;
const BOLT_ANGLES = Array.from({ length: 5 }, (_, i) => (i / 5) * Math.PI * 2);

// ─── Realistic Wheel ────────────────────────────────────────
function RealWheel({ rimColor, rimRoughness }: Pick<TyreProps, "rimColor" | "rimRoughness" | "accentColor">) {
  // Tyre rubber
  const tyreMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#0B0B10"),
    roughness: 0.95,
    metalness: 0.00,
    clearcoat: 0.03,
    clearcoatRoughness: 0.90,
  }), []);

  // Rim (spokes, face) — updates on rim color/roughness change
  const rimMat = useMemo(() => buildRimMat(rimColor, rimRoughness),
    [rimColor, rimRoughness]);

  // Chrome — lip ring + lug bolts
  const chromeMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#E0E4EF"),
    roughness: 0.03,
    metalness: 0.98,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    envMapIntensity: 3.0,
  }), []);

  // Dark barrel interior
  const barrelMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#0F0F18"),
    roughness: 0.62,
    metalness: 0.40,
  }), []);

  // Hub barrel (dark centre)
  const hubMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#06060C"),
    roughness: 0.78,
    metalness: 0.20,
  }), []);

  // Centre cap (matches rim colour, very shiny)
  const capMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(rimColor),
    roughness: 0.06,
    metalness: 0.96,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
  }), [rimColor]);

  // ── Geometries ──────────────────────────────────────────
  // Tyre: TorusGeometry lies in XY plane (axis = Z) by default — perfect
  const tyreGeo = useMemo(() =>
    new THREE.TorusGeometry(RIM_R + TUBE_R, TUBE_R, 48, 180), []);

  // Barrel (open cylinder along Z)
  const barrelGeo = useMemo(() => {
    const g = new THREE.CylinderGeometry(RIM_R - 0.002, RIM_R - 0.002, BARREL_D, 96, 1, true);
    g.rotateX(Math.PI / 2);
    return g;
  }, []);

  // Ring face (front and rear)
  const faceRingGeo = useMemo(() =>
    new THREE.RingGeometry(HUB_R, RIM_R - 0.002, 96), []);

  // Lip ring (chrome edge)
  const lipGeo = useMemo(() =>
    new THREE.TorusGeometry(RIM_R, 0.014, 20, 100), []);

  // Spoke arm (shared, rotated per instance)
  const armGeo = useMemo(() =>
    new THREE.ExtrudeGeometry(armShape, armExtrudeSettings), []);

  // Hub barrel (solid cylinder in centre)
  const hubBarrelGeo = useMemo(() => {
    const g = new THREE.CylinderGeometry(HUB_R, HUB_R, BARREL_D + 0.012, 48, 1);
    g.rotateX(Math.PI / 2);
    return g;
  }, []);

  // Centre cap
  const capGeo = useMemo(() => {
    const g = new THREE.CylinderGeometry(HUB_R * 0.88, HUB_R * 0.88, 0.010, 36);
    g.rotateX(Math.PI / 2);
    return g;
  }, []);

  // Lug bolt
  const boltGeo = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.010, 0.013, 0.032, 14);
    g.rotateX(Math.PI / 2);
    return g;
  }, []);

  // Spoke arms sit at FACE_Z - ARM_DEPTH → extend to FACE_Z (flush with lip)
  const spokeZ = FACE_Z - ARM_DEPTH;

  return (
    <group>
      {/* TYRE — in XY plane, centred at z=0. Scale Z to flatten cross-section
          (real tyres are wider than they are tall in cross-section). */}
      <mesh geometry={tyreGeo} material={tyreMat} scale={[1, 1, 0.80]} />

      {/* Tread grooves: subtle circumferential rings recessed into the tread */}
      {[-0.055, -0.018, 0.018, 0.055].map((zOff, i) => (
        <mesh key={i} material={barrelMat} position={[0, 0, zOff]}>
          <torusGeometry args={[RIM_R + TUBE_R * 1.82, 0.006, 10, 120]} />
        </mesh>
      ))}

      {/* BARREL */}
      <mesh geometry={barrelGeo} material={barrelMat} />

      {/* REAR FACE ring */}
      <mesh geometry={faceRingGeo} material={rimMat}
        position={[0, 0, REAR_Z]} rotation={[Math.PI, 0, 0]} />

      {/* FRONT FACE ring (behind spokes) */}
      <mesh geometry={faceRingGeo} material={rimMat}
        position={[0, 0, spokeZ]} />

      {/* SPOKE ARMS — 10 total (5 pairs) */}
      {ARM_ANGLES.map((angle, i) => (
        <mesh
          key={i}
          geometry={armGeo}
          material={rimMat}
          position={[0, 0, spokeZ]}
          rotation={[0, 0, angle]}
        />
      ))}

      {/* CHROME LIP RINGS */}
      <mesh geometry={lipGeo} material={chromeMat} position={[0, 0, FACE_Z]} />
      <mesh geometry={lipGeo} material={chromeMat} position={[0, 0, REAR_Z]} />

      {/* HUB BARREL */}
      <mesh geometry={hubBarrelGeo} material={hubMat} />

      {/* CENTRE CAP */}
      <mesh geometry={capGeo} material={capMat}
        position={[0, 0, FACE_Z + 0.003]} />

      {/* LUG BOLTS */}
      {BOLT_ANGLES.map((angle, i) => (
        <mesh
          key={i}
          geometry={boltGeo}
          material={chromeMat}
          position={[
            Math.cos(angle) * BOLT_PCD,
            Math.sin(angle) * BOLT_PCD,
            FACE_Z - ARM_DEPTH * 0.5,
          ]}
        />
      ))}
    </group>
  );
}

// ─── Aspect-ratio scale ──────────────────────────────────────
function getSizeScale(s = "245/45 R19") {
  const m = s.match(/(\d+)\/(\d+)/);
  if (!m) return 1.0;
  const aspect = parseInt(m[2]);
  if (aspect <= 35) return 0.88;
  if (aspect <= 42) return 0.94;
  if (aspect <= 50) return 1.00;
  if (aspect <= 60) return 1.07;
  return 1.13;
}

// ─── Draggable + auto-rotating wheel wrapper ─────────────────
function DraggableWheel({ rimColor, rimRoughness, accentColor, selectedSize = "245/45 R19" }: TyreProps) {
  const groupRef   = useRef<THREE.Group>(null!);
  const isDragging = useRef(false);
  const prevMouse  = useRef({ x: 0, y: 0 });
  const velocity   = useRef({ x: 0, y: 0 });
  const rot        = useRef({ x: 0.28, y: 0.55 });
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
      // Slow auto-spin around the wheel axis (Z)
      rot.current.y    += delta * 0.22;
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

// ─── Exported scene ──────────────────────────────────────────
export default function ConfiguratorScene({ accentColor, rimColor, rimRoughness, selectedSize }: TyreProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 1.72], fov: 34 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      {/* Ambient */}
      <ambientLight intensity={0.28} color="#eef0ff" />

      {/* Key light — top-left front */}
      <directionalLight position={[3, 6, 4]}  intensity={3.2} color="#ffffff" />

      {/* Fill — bottom-right */}
      <directionalLight position={[-3, -2, 3]} intensity={0.55} color="#d4e0ff" />

      {/* Rim edge lights */}
      <pointLight position={[-5, 1, -1]}  intensity={2.2} color="#c8d8ff" distance={12} />
      <pointLight position={[ 5, 1, -1]}  intensity={1.8} color="#ffffff"  distance={12} />

      {/* Accent backlight (matches tyre accent colour) */}
      <pointLight position={[0, 0, -5]}   intensity={2.8} color={accentColor} distance={14} />

      {/* Top fill */}
      <pointLight position={[1, 4, 4]}    intensity={1.6} color="#ffffff"  distance={11} />

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
