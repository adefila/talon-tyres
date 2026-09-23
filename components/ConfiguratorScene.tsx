"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

interface TyreProps {
  accentColor: string;
  rimColor: string;
  rimRoughness: number;
  selectedSize?: string;
}

/* ─── Tyre profile (lathe revolution around Y, then rotated 90° to Z-axis) ─── */
function buildTyreProfile(): THREE.Vector2[] {
  return [
    new THREE.Vector2(0.952, -0.495),
    new THREE.Vector2(0.968, -0.442),
    new THREE.Vector2(1.018, -0.432),
    new THREE.Vector2(1.085, -0.458),
    new THREE.Vector2(1.195, -0.468),
    new THREE.Vector2(1.328, -0.464),
    new THREE.Vector2(1.418, -0.428),
    new THREE.Vector2(1.458, -0.356),
    new THREE.Vector2(1.473, -0.254),
    new THREE.Vector2(1.480, -0.136),
    new THREE.Vector2(1.482, -0.038),
    new THREE.Vector2(1.482,  0.000),
    new THREE.Vector2(1.482,  0.038),
    new THREE.Vector2(1.480,  0.136),
    new THREE.Vector2(1.473,  0.254),
    new THREE.Vector2(1.458,  0.356),
    new THREE.Vector2(1.418,  0.428),
    new THREE.Vector2(1.328,  0.464),
    new THREE.Vector2(1.195,  0.468),
    new THREE.Vector2(1.085,  0.458),
    new THREE.Vector2(1.018,  0.432),
    new THREE.Vector2(0.968,  0.442),
    new THREE.Vector2(0.952,  0.495),
  ];
}

/*
 * Y-split spoke shape — matches the reference alloy wheel:
 *   - Single blade at hub (y=0.195), fans out wide
 *   - Bifurcates into two branches from y≈0.540 to rim (y≈0.914)
 *   - Hole between branches = dark recess (matches reference photo)
 *   - Outer shape: CCW winding
 *   - Hole: CW winding (treated as cutout by Three.js)
 */
function buildSpokeShape(): THREE.Shape {
  const shape = new THREE.Shape();

  /* Outer boundary — CCW */
  shape.moveTo(-0.052, 0.195);
  shape.bezierCurveTo(-0.098, 0.368, -0.200, 0.590, -0.276, 0.804);
  shape.bezierCurveTo(-0.305, 0.858, -0.296, 0.908, -0.265, 0.914);
  shape.lineTo(0.265, 0.914);
  shape.bezierCurveTo(0.296, 0.908, 0.305, 0.858, 0.276, 0.804);
  shape.bezierCurveTo(0.200, 0.590, 0.098, 0.368, 0.052, 0.195);
  shape.closePath();

  /* Split hole — CW winding (start bottom, go RIGHT first = CW) */
  const split = new THREE.Path();
  split.moveTo(0.000, 0.540);
  split.bezierCurveTo(0.026, 0.616, 0.112, 0.736, 0.146, 0.800);
  split.bezierCurveTo(0.138, 0.844, 0.108, 0.866, 0.082, 0.876);
  split.lineTo(-0.082, 0.876);
  split.bezierCurveTo(-0.108, 0.866, -0.138, 0.844, -0.146, 0.800);
  split.bezierCurveTo(-0.112, 0.736, -0.026, 0.616, 0.000, 0.540);
  split.closePath();
  shape.holes.push(split);

  return shape;
}

function parseSize(sizeStr: string): { width: number; aspect: number; rim: number } {
  const m = sizeStr.match(/(\d+)\/(\d+)\s*R(\d+)/);
  return m
    ? { width: parseInt(m[1]), aspect: parseInt(m[2]), rim: parseInt(m[3]) }
    : { width: 245, aspect: 45, rim: 18 };
}

function getSizeScale(sizeStr: string) {
  const { aspect } = parseSize(sizeStr);
  if (aspect <= 35) return { xy: 0.90, z: 1.06 };
  if (aspect <= 42) return { xy: 0.95, z: 1.02 };
  if (aspect <= 50) return { xy: 1.00, z: 1.00 };
  if (aspect <= 60) return { xy: 1.08, z: 0.98 };
  return { xy: 1.14, z: 0.95 };
}

function DraggableTyre({ accentColor, rimColor, rimRoughness, selectedSize = "245/45 R19" }: TyreProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const isDragging = useRef(false);
  const prevMouse = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const rot = useRef({ x: 0.32, y: 0.55 });
  const { gl } = useThree();

  const tyreProfile = useMemo(buildTyreProfile, []);

  /* Extruded Y-split spoke — depth spans full rim barrel */
  const spokeGeo = useMemo(() => {
    const shape = buildSpokeShape();
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.920,
      bevelEnabled: true,
      bevelSize: 0.010,
      bevelThickness: 0.008,
      bevelSegments: 4,
    });
  }, []);

  const spokeAngles = useMemo(() =>
    Array.from({ length: 5 }, (_, i) => (i / 5) * Math.PI * 2), []);
  const lugAngles = useMemo(() =>
    Array.from({ length: 5 }, (_, i) => (i / 5) * Math.PI * 2), []);

  /*
   * Per-rim-preset material values:
   *   material-2 (end cap = the front face toward the camera) → polished/machined
   *   material-0 (side walls)                                 → dark anodized
   *   material-1 (start cap = inner back face)                → dark
   */
  const faceClearcoat  = rimRoughness < 0.20 ? 0.95 : rimRoughness < 0.45 ? 0.50 : 0.08;
  const faceMetalness  = rimRoughness < 0.45 ? 0.94 : 0.62;
  const faceRoughness  = Math.max(rimRoughness, 0.10);

  /* Drag interaction */
  useEffect(() => {
    const canvas = gl.domElement;
    const down = (e: PointerEvent) => {
      isDragging.current = true;
      prevMouse.current = { x: e.clientX, y: e.clientY };
      velocity.current = { x: 0, y: 0 };
      canvas.style.cursor = "grabbing";
    };
    const move = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - prevMouse.current.x;
      const dy = e.clientY - prevMouse.current.y;
      velocity.current = { x: dy * 0.009, y: dx * 0.009 };
      rot.current.x += dy * 0.009;
      rot.current.y += dx * 0.009;
      prevMouse.current = { x: e.clientX, y: e.clientY };
    };
    const up = () => { isDragging.current = false; canvas.style.cursor = "grab"; };
    canvas.style.cursor = "grab";
    canvas.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      canvas.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [gl]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (!isDragging.current) {
      rot.current.y += delta * 0.26;
      velocity.current.x *= 0.92;
      velocity.current.y *= 0.92;
      rot.current.x += velocity.current.x;
      rot.current.y += velocity.current.y;
    }
    groupRef.current.rotation.x = rot.current.x;
    groupRef.current.rotation.y = rot.current.y;
    groupRef.current.rotation.z = 0;
  });

  const sz = getSizeScale(selectedSize);
  const cylRot: [number, number, number] = [Math.PI / 2, 0, 0];
  const HALF_DEPTH = 0.460;

  return (
    <group ref={groupRef} scale={[sz.xy * 0.80, sz.xy * 0.80, sz.z * 0.80]}>

      {/* ── Tyre rubber ── */}
      <mesh rotation={cylRot}>
        <latheGeometry args={[tyreProfile, 96]} />
        <meshStandardMaterial color="#090910" roughness={0.94} metalness={0.0} emissive="#030306" emissiveIntensity={0.06} />
      </mesh>

      {/* Circumferential tread grooves */}
      {([-0.34, -0.17, 0.00, 0.17, 0.34] as number[]).map((z, i) => (
        <mesh key={`groove-${i}`} position={[0, 0, z]}>
          <torusGeometry args={[1.468, 0.040, 10, 96]} />
          <meshStandardMaterial color="#030305" roughness={1.0} metalness={0} />
        </mesh>
      ))}

      {/* Shoulder grooves */}
      {([-0.42, 0.42] as number[]).map((z, i) => (
        <mesh key={`sg-${i}`} position={[0, 0, z]}>
          <torusGeometry args={[1.410, 0.028, 8, 80]} />
          <meshStandardMaterial color="#030305" roughness={1.0} metalness={0} />
        </mesh>
      ))}

      {/* Sidewall raised text ridge (simulated) */}
      {([0.470, -0.470] as number[]).map((z, i) => (
        <mesh key={`ridge-${i}`} position={[0, 0, z]}>
          <torusGeometry args={[1.075, 0.008, 6, 96]} />
          <meshStandardMaterial color="#111116" roughness={0.9} metalness={0} />
        </mesh>
      ))}

      {/* Sidewall accent rings */}
      {([0.480, -0.480] as number[]).map((z, i) => (
        <mesh key={`sw-${i}`} position={[0, 0, z]}>
          <torusGeometry args={[1.022, 0.018, 14, 96]} />
          <meshStandardMaterial color={accentColor} roughness={0.38} metalness={0.28} emissive={accentColor} emissiveIntensity={0.45} />
        </mesh>
      ))}

      {/* ── Rim barrel (dark inner tube) ── */}
      <mesh rotation={cylRot}>
        <cylinderGeometry args={[0.945, 0.945, 0.930, 72, 1, true]} />
        <meshStandardMaterial color="#0E0E14" roughness={0.22} metalness={0.88} side={THREE.DoubleSide} />
      </mesh>

      {/* Outer rim barrel lip — wide polished chrome ring (the prominent outer ring in ref photo) */}
      {([0.468, -0.468] as number[]).map((z, i) => (
        <mesh key={`lip-${i}`} position={[0, 0, z]} rotation={cylRot}>
          <cylinderGeometry args={[0.968, 0.960, 0.048, 72]} />
          <meshPhysicalMaterial
            color={rimRoughness < 0.50 ? "#D2D8E6" : rimColor}
            roughness={Math.max(rimRoughness * 0.45, 0.08)}
            metalness={0.96}
            clearcoat={0.95}
            clearcoatRoughness={0.06}
            reflectivity={0.95}
          />
        </mesh>
      ))}

      {/* Barrel inner step ring (the bead seat step) */}
      {([0.430, -0.430] as number[]).map((z, i) => (
        <mesh key={`step-${i}`} position={[0, 0, z]} rotation={cylRot}>
          <cylinderGeometry args={[0.920, 0.945, 0.018, 72]} />
          <meshStandardMaterial color="#0E0E14" roughness={0.22} metalness={0.88} />
        </mesh>
      ))}

      {/* Inner back wall disc */}
      <mesh position={[0, 0, -0.428]} rotation={cylRot}>
        <cylinderGeometry args={[0.920, 0.920, 0.010, 56]} />
        <meshStandardMaterial color="#0A0A12" roughness={0.24} metalness={0.85} />
      </mesh>

      {/* ── 5 Y-split spokes ──
           ExtrudeGeometry group indices:
             0 = side walls (extruded walls)  → dark anodized
             1 = start cap (inner back face)  → dark
             2 = end cap (front face, camera side) → polished/machined
           position={[0,0,-HALF_DEPTH]}: shape at z=-0.46, end cap at z=+0.46 ✓
      */}
      {spokeAngles.map((angle, i) => (
        <mesh
          key={`spoke-${i}`}
          rotation={[0, 0, angle]}
          position={[0, 0, -HALF_DEPTH]}
          geometry={spokeGeo}
        >
          {/* Side walls — dark anodized/painted */}
          <meshPhysicalMaterial attach="material-0"
            color="#0C0C14" roughness={0.22} metalness={0.88}
          />
          {/* Inner back face — dark */}
          <meshPhysicalMaterial attach="material-1"
            color="#0A0A12" roughness={0.28} metalness={0.80}
          />
          {/* Front machined face — polished, matches rim color preset */}
          <meshPhysicalMaterial attach="material-2"
            color={rimColor}
            roughness={faceRoughness}
            metalness={faceMetalness}
            clearcoat={faceClearcoat}
            clearcoatRoughness={0.09}
            reflectivity={0.92}
          />
        </mesh>
      ))}

      {/* ── Hub cylinder ── */}
      <mesh rotation={cylRot}>
        <cylinderGeometry args={[0.198, 0.198, 1.010, 40]} />
        <meshStandardMaterial color="#0E0E14" roughness={0.22} metalness={0.88} />
      </mesh>

      {/* Hub cap (dark badge area) */}
      {([0.510, -0.510] as number[]).map((z, i) => (
        <mesh key={`hubcap-${i}`} position={[0, 0, z]} rotation={cylRot}>
          <cylinderGeometry args={[0.178, 0.178, 0.028, 32]} />
          <meshStandardMaterial color="#0A0A10" roughness={0.30} metalness={0.85} />
        </mesh>
      ))}

      {/* Hub cap accent ring */}
      {([0.514, -0.514] as number[]).map((z, i) => (
        <mesh key={`hubring-${i}`} position={[0, 0, z]}>
          <torusGeometry args={[0.168, 0.010, 8, 32]} />
          <meshStandardMaterial color={accentColor} roughness={0.35} metalness={0.40} emissive={accentColor} emissiveIntensity={0.50} />
        </mesh>
      ))}

      {/* ── Lug bolts — 5 bolts on PCD circle ── */}
      {lugAngles.map((a, i) => {
        const lx = Math.cos(a) * 0.650;
        const ly = Math.sin(a) * 0.650;
        return ([0.508, -0.508] as number[]).map((z, j) => (
          <group key={`luggroup-${i}-${j}`} position={[lx, ly, z]}>
            {/* Bolt shank */}
            <mesh rotation={cylRot}>
              <cylinderGeometry args={[0.052, 0.052, 0.062, 10]} />
              <meshPhysicalMaterial color="#C8CCD8" roughness={0.18} metalness={0.92} clearcoat={0.7} clearcoatRoughness={0.12} />
            </mesh>
            {/* Bolt hex head face */}
            <mesh position={[0, 0, j === 0 ? 0.032 : -0.032]} rotation={cylRot}>
              <cylinderGeometry args={[0.046, 0.046, 0.010, 6]} />
              <meshPhysicalMaterial color="#B8BCC8" roughness={0.15} metalness={0.95} clearcoat={0.8} clearcoatRoughness={0.10} />
            </mesh>
          </group>
        ));
      })}

      {/* Ground shadow */}
      <mesh position={[0, -1.65, -0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.2, 1.8]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.08} />
      </mesh>

    </group>
  );
}

interface Props {
  accentColor: string;
  rimColor: string;
  rimRoughness: number;
  selectedSize?: string;
}

export default function ConfiguratorScene({ accentColor, rimColor, rimRoughness, selectedSize }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.5], fov: 34 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
      onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); }}
    >
      <ambientLight intensity={0.24} color="#eef0ff" />
      {/* Key light — high right front, creates strong highlights on the machined face */}
      <directionalLight position={[5, 8, 6]}   intensity={4.0} color="#ffffff" />
      {/* Soft fill from left */}
      <directionalLight position={[-5, 2, 4]}  intensity={0.70} color="#d4e0ff" />
      {/* Under-bounce */}
      <directionalLight position={[0, -5, 3]}  intensity={0.28} color="#c8d4ff" />
      {/* Accent back glow */}
      <pointLight position={[0, 0, -7]}   intensity={3.5} color={accentColor} distance={18} />
      {/* Side rim-light for depth */}
      <pointLight position={[-7, 1, 0]}   intensity={2.0} color="#b8ccff" distance={16} />
      <pointLight position={[7, 1, 0]}    intensity={1.6} color="#ffffff"  distance={16} />
      {/* Front key point — catches the spoke faces */}
      <pointLight position={[2, 4, 7]}    intensity={2.0} color="#ffffff"  distance={16} />

      {/* IBL for realistic metal reflections */}
      <Environment preset="studio" background={false} />

      <DraggableTyre
        accentColor={accentColor}
        rimColor={rimColor}
        rimRoughness={rimRoughness}
        selectedSize={selectedSize}
      />
    </Canvas>
  );
}
