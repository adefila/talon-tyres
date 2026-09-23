"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

/* ── Axle positions (SUV proportions) ── */
const FRONT_X  =  1.24;
const REAR_X   = -1.18;
const AXLE_Y   =  0.50;
const TYRE_SCALE = 0.250;

/* ── Tyre lathe profile ── */
const tyreProfile: THREE.Vector2[] = [
  new THREE.Vector2(0.952, -0.495), new THREE.Vector2(0.968, -0.442),
  new THREE.Vector2(1.018, -0.432), new THREE.Vector2(1.085, -0.458),
  new THREE.Vector2(1.195, -0.468), new THREE.Vector2(1.328, -0.464),
  new THREE.Vector2(1.418, -0.428), new THREE.Vector2(1.458, -0.356),
  new THREE.Vector2(1.473, -0.254), new THREE.Vector2(1.480, -0.136),
  new THREE.Vector2(1.482, -0.038), new THREE.Vector2(1.482,  0.000),
  new THREE.Vector2(1.482,  0.038), new THREE.Vector2(1.480,  0.136),
  new THREE.Vector2(1.473,  0.254), new THREE.Vector2(1.458,  0.356),
  new THREE.Vector2(1.418,  0.428), new THREE.Vector2(1.328,  0.464),
  new THREE.Vector2(1.195,  0.468), new THREE.Vector2(1.085,  0.458),
  new THREE.Vector2(1.018,  0.432), new THREE.Vector2(0.968,  0.442),
  new THREE.Vector2(0.952,  0.495),
];

/* ── Twin-spoke shape (RTX style: 2 arms, gap starts near hub) ── */
function buildSpokeShape(): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(-0.052, 0.175);
  shape.bezierCurveTo(-0.125, 0.355, -0.245, 0.605, -0.325, 0.822);
  shape.bezierCurveTo(-0.344, 0.872, -0.334, 0.908, -0.298, 0.912);
  shape.lineTo(0.298, 0.912);
  shape.bezierCurveTo(0.334, 0.908, 0.344, 0.872, 0.325, 0.822);
  shape.bezierCurveTo(0.245, 0.605, 0.125, 0.355, 0.052, 0.175);
  shape.closePath();
  const gap = new THREE.Path();
  gap.moveTo(0.000, 0.248);
  gap.bezierCurveTo(0.042, 0.345, 0.140, 0.548, 0.172, 0.768);
  gap.bezierCurveTo(0.178, 0.832, 0.160, 0.872, 0.124, 0.882);
  gap.lineTo(-0.124, 0.882);
  gap.bezierCurveTo(-0.160, 0.872, -0.178, 0.832, -0.172, 0.768);
  gap.bezierCurveTo(-0.140, 0.548, -0.042, 0.345, 0.000, 0.248);
  gap.closePath();
  shape.holes.push(gap);
  return shape;
}

/* ── Range Rover Evoque-style SUV body profile ── */
function buildSUVBodyShape(): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(-2.38, 0.08);
  shape.lineTo(2.38, 0.08);
  shape.bezierCurveTo(2.50, 0.08, 2.52, 0.18, 2.52, 0.36);
  shape.lineTo(2.52, 0.52);
  shape.bezierCurveTo(2.48, 0.62, 2.30, 0.76, 2.10, 0.80);
  shape.lineTo(1.10, 0.82);
  shape.bezierCurveTo(0.95, 0.83, 0.82, 0.90, 0.74, 1.02);
  shape.bezierCurveTo(0.68, 1.18, 0.66, 1.46, 0.64, 1.64);
  shape.lineTo(-1.14, 1.68);
  shape.bezierCurveTo(-1.32, 1.68, -1.58, 1.56, -1.78, 1.38);
  shape.bezierCurveTo(-1.90, 1.26, -2.00, 1.10, -2.10, 0.96);
  shape.bezierCurveTo(-2.28, 0.80, -2.44, 0.60, -2.50, 0.44);
  shape.bezierCurveTo(-2.52, 0.30, -2.52, 0.14, -2.38, 0.08);
  shape.closePath();

  const frontArch = new THREE.Path();
  frontArch.absarc(FRONT_X, AXLE_Y, 0.44, 0, Math.PI * 2, true);
  shape.holes.push(frontArch);

  const rearArch = new THREE.Path();
  rearArch.absarc(REAR_X, AXLE_Y, 0.44, 0, Math.PI * 2, true);
  shape.holes.push(rearArch);

  return shape;
}

/* ── Glass area ── */
function buildGlassShape(): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(1.10, 0.82);
  shape.bezierCurveTo(0.95, 0.83, 0.82, 0.90, 0.74, 1.02);
  shape.bezierCurveTo(0.68, 1.18, 0.66, 1.46, 0.64, 1.64);
  shape.lineTo(-1.14, 1.68);
  shape.bezierCurveTo(-1.32, 1.68, -1.55, 1.56, -1.75, 1.38);
  shape.bezierCurveTo(-1.86, 1.26, -1.95, 1.10, -2.04, 0.96);
  shape.bezierCurveTo(-1.80, 0.88, -0.60, 0.84, 0.20, 0.84);
  shape.bezierCurveTo(0.50, 0.84, 0.80, 0.83, 1.10, 0.82);
  shape.closePath();
  return shape;
}

/* ── Wheel mesh ── */
function WheelMesh({
  rimColor, rimRoughness, accentColor,
}: {
  rimColor: string; rimRoughness: number; accentColor: string;
}) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.z -= delta * 1.2;
  });

  const spokeGeo = useMemo(() => {
    const shape = buildSpokeShape();
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.920, bevelEnabled: true,
      bevelSize: 0.010, bevelThickness: 0.008, bevelSegments: 3,
    });
  }, []);

  const spokeAngles = useMemo(() =>
    Array.from({ length: 5 }, (_, i) => (i / 5) * Math.PI * 2), []);

  const faceClearcoat = rimRoughness < 0.20 ? 0.95 : rimRoughness < 0.45 ? 0.50 : 0.08;
  const faceMetalness = rimRoughness < 0.45 ? 0.94 : 0.62;
  const faceRoughness = Math.max(rimRoughness, 0.10);
  const cylRot: [number, number, number] = [Math.PI / 2, 0, 0];
  const HALF_DEPTH = 0.460;

  return (
    <group ref={groupRef} scale={[TYRE_SCALE, TYRE_SCALE, TYRE_SCALE]}>
      <mesh rotation={cylRot}>
        <latheGeometry args={[tyreProfile, 56]} />
        <meshStandardMaterial color="#090910" roughness={0.93} metalness={0.0} />
      </mesh>
      {([-0.34, -0.17, 0.00, 0.17, 0.34] as number[]).map((z, i) => (
        <mesh key={`g-${i}`} position={[0, 0, z]}>
          <torusGeometry args={[1.468, 0.038, 8, 56]} />
          <meshStandardMaterial color="#030305" roughness={1.0} />
        </mesh>
      ))}
      {([0.480, -0.480] as number[]).map((z, i) => (
        <mesh key={`sw-${i}`} position={[0, 0, z]}>
          <torusGeometry args={[1.022, 0.018, 10, 56]} />
          <meshStandardMaterial color={accentColor} roughness={0.38} metalness={0.28} emissive={accentColor} emissiveIntensity={0.38} />
        </mesh>
      ))}
      <mesh rotation={cylRot}>
        <cylinderGeometry args={[0.945, 0.945, 0.930, 56, 1, true]} />
        <meshStandardMaterial color="#0E0E14" roughness={0.22} metalness={0.88} side={THREE.DoubleSide} />
      </mesh>
      {([0.468, -0.468] as number[]).map((z, i) => (
        <mesh key={`lip-${i}`} position={[0, 0, z]} rotation={cylRot}>
          <cylinderGeometry args={[0.968, 0.960, 0.048, 56]} />
          <meshPhysicalMaterial
            color={rimRoughness < 0.50 ? "#D2D8E6" : rimColor}
            roughness={Math.max(rimRoughness * 0.45, 0.08)}
            metalness={0.96} clearcoat={0.95} clearcoatRoughness={0.06} reflectivity={0.95}
          />
        </mesh>
      ))}
      <mesh position={[0, 0, -0.428]} rotation={cylRot}>
        <cylinderGeometry args={[0.920, 0.920, 0.010, 36]} />
        <meshStandardMaterial color="#0A0A12" roughness={0.24} metalness={0.85} />
      </mesh>
      {spokeAngles.map((angle, i) => (
        <mesh key={`spoke-${i}`} rotation={[0, 0, angle]} position={[0, 0, -HALF_DEPTH]} geometry={spokeGeo}>
          <meshPhysicalMaterial attach="material-0" color="#1A1A22" roughness={0.30} metalness={0.82} />
          <meshPhysicalMaterial attach="material-1" color="#0A0A12" roughness={0.28} metalness={0.80} />
          <meshPhysicalMaterial attach="material-2"
            color={rimColor} roughness={faceRoughness} metalness={faceMetalness}
            clearcoat={faceClearcoat} clearcoatRoughness={0.09} reflectivity={0.92}
          />
        </mesh>
      ))}
      <mesh rotation={cylRot}>
        <cylinderGeometry args={[0.198, 0.198, 1.010, 24]} />
        <meshStandardMaterial color="#0E0E14" roughness={0.22} metalness={0.88} />
      </mesh>
      {([0.510, -0.510] as number[]).map((z, i) => (
        <mesh key={`cap-${i}`} position={[0, 0, z]} rotation={cylRot}>
          <cylinderGeometry args={[0.178, 0.178, 0.028, 20]} />
          <meshPhysicalMaterial color="#C8CCD8" roughness={0.12} metalness={0.96} clearcoat={0.9} clearcoatRoughness={0.08} />
        </mesh>
      ))}
      {([0.514, -0.514] as number[]).map((z, i) => (
        <mesh key={`hr-${i}`} position={[0, 0, z]}>
          <torusGeometry args={[0.168, 0.010, 8, 28]} />
          <meshStandardMaterial color={accentColor} roughness={0.35} metalness={0.40} emissive={accentColor} emissiveIntensity={0.50} />
        </mesh>
      ))}
    </group>
  );
}

/* ── SUV body ── */
function SUVBody({ accentColor }: { accentColor: string }) {
  const bodyGeo = useMemo(() => new THREE.ExtrudeGeometry(buildSUVBodyShape(), {
    depth: 1.82, bevelEnabled: true,
    bevelSize: 0.055, bevelThickness: 0.048, bevelSegments: 6,
  }), []);

  const glassGeo = useMemo(() => new THREE.ExtrudeGeometry(buildGlassShape(), {
    depth: 1.68, bevelEnabled: true,
    bevelSize: 0.018, bevelThickness: 0.014, bevelSegments: 4,
  }), []);

  return (
    <group>
      <group position={[0, 0, -0.91]}>
        {/* Painted body */}
        <mesh geometry={bodyGeo} castShadow receiveShadow>
          <meshPhysicalMaterial color="#F5F5F5" roughness={0.32} metalness={0.10} clearcoat={1.0} clearcoatRoughness={0.08} />
        </mesh>

        {/* Roof panel */}
        <mesh position={[-0.26, 1.68, 0.82]} castShadow>
          <boxGeometry args={[1.82, 0.048, 1.50]} />
          <meshPhysicalMaterial color="#F5F5F5" roughness={0.32} metalness={0.10} clearcoat={1.0} clearcoatRoughness={0.08} />
        </mesh>

        {/* Black A-pillar */}
        <mesh position={[0.62, 1.34, 0.0]}>
          <boxGeometry args={[0.12, 0.68, 1.84]} />
          <meshStandardMaterial color="#0A0A0A" roughness={0.55} metalness={0.1} />
        </mesh>
        {/* Black C-pillar */}
        <mesh position={[-1.22, 1.50, 0.0]}>
          <boxGeometry args={[0.20, 0.40, 1.84]} />
          <meshStandardMaterial color="#0A0A0A" roughness={0.55} metalness={0.1} />
        </mesh>

        {/* Side glass */}
        <group position={[0, 0, 0.06]}>
          <mesh geometry={glassGeo}>
            <meshPhysicalMaterial color="#060C14" roughness={0.04} metalness={0.02} transparent opacity={0.72} reflectivity={0.85} />
          </mesh>
        </group>

        {/* Underbody */}
        <mesh position={[0, 0.08, 0.91]}>
          <boxGeometry args={[4.80, 0.08, 1.80]} />
          <meshStandardMaterial color="#111118" roughness={0.88} metalness={0.12} />
        </mesh>

        {/* Lower body cladding */}
        <mesh position={[0, 0.19, 0.91]}>
          <boxGeometry args={[4.60, 0.18, 1.86]} />
          <meshStandardMaterial color="#1A1A1E" roughness={0.85} metalness={0.08} />
        </mesh>

        {/* Wheel arch liners */}
        {([{ cx: FRONT_X, cy: AXLE_Y }, { cx: REAR_X, cy: AXLE_Y }]).map(({ cx, cy }, i) => (
          <mesh key={`arch-${i}`} position={[cx, cy, 0]}>
            <torusGeometry args={[0.445, 0.040, 8, 56, Math.PI]} />
            <meshStandardMaterial color="#0A0A14" roughness={0.80} metalness={0.20} side={THREE.BackSide} />
          </mesh>
        ))}

        {/* Roof rails */}
        {([-0.82, 0.82] as number[]).map((z, i) => (
          <mesh key={`rail-${i}`} position={[-0.28, 1.74, z]}>
            <boxGeometry args={[1.70, 0.032, 0.060]} />
            <meshPhysicalMaterial color="#888899" roughness={0.28} metalness={0.85} clearcoat={0.6} clearcoatRoughness={0.14} />
          </mesh>
        ))}
      </group>

      {/* Front grille */}
      <mesh position={[2.50, 0.54, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[1.64, 0.34, 0.06]} />
        <meshPhysicalMaterial color="#111118" roughness={0.40} metalness={0.70} clearcoat={0.5} clearcoatRoughness={0.18} />
      </mesh>
      {([0.46, 0.52, 0.58, 0.64] as number[]).map((y, i) => (
        <mesh key={`sl-${i}`} position={[2.49, y, 0]}>
          <boxGeometry args={[0.05, 0.016, 1.52]} />
          <meshPhysicalMaterial color="#1E1E28" roughness={0.28} metalness={0.85} clearcoat={0.5} />
        </mesh>
      ))}
      {([-0.60, -0.20, 0.20, 0.60] as number[]).map((z, i) => (
        <mesh key={`vb-${i}`} position={[2.49, 0.56, z]}>
          <boxGeometry args={[0.05, 0.30, 0.016]} />
          <meshPhysicalMaterial color="#1E1E28" roughness={0.28} metalness={0.85} clearcoat={0.5} />
        </mesh>
      ))}
      <mesh position={[2.50, 0.22, 0]}>
        <boxGeometry args={[0.06, 0.18, 1.70]} />
        <meshStandardMaterial color="#1A1A1E" roughness={0.80} metalness={0.20} />
      </mesh>

      {/* LED headlights */}
      {([-0.70, 0.70] as number[]).map((z, i) => (
        <group key={`hl-${i}`} position={[2.48, 0.76, z]}>
          <mesh>
            <boxGeometry args={[0.04, 0.10, 0.38]} />
            <meshStandardMaterial color="#FFFFFF" emissive="#DDEEFF" emissiveIntensity={3.5} roughness={0.04} metalness={0} />
          </mesh>
          <mesh position={[0, -0.06, 0]}>
            <boxGeometry args={[0.025, 0.020, 0.32]} />
            <meshStandardMaterial color="#FFFBE8" emissive="#FFFBE8" emissiveIntensity={5.0} roughness={0.02} metalness={0} />
          </mesh>
        </group>
      ))}

      {/* Rear lights */}
      {([-0.72, 0.72] as number[]).map((z, i) => (
        <group key={`tl-${i}`} position={[-2.48, 0.76, z]}>
          <mesh>
            <boxGeometry args={[0.04, 0.38, 0.10]} />
            <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={3.0} roughness={0.08} metalness={0} />
          </mesh>
          <mesh position={[0, -0.20, 0.18]}>
            <boxGeometry args={[0.025, 0.028, 0.36]} />
            <meshStandardMaterial color="#FF1111" emissive="#FF0000" emissiveIntensity={4.0} roughness={0.04} metalness={0} />
          </mesh>
        </group>
      ))}
      <mesh position={[-2.50, 0.22, 0]}>
        <boxGeometry args={[0.06, 0.20, 1.74]} />
        <meshStandardMaterial color="#1A1A1E" roughness={0.80} metalness={0.12} />
      </mesh>

      {/* Side mirrors */}
      {([0.90, -0.90] as number[]).map((z, i) => (
        <group key={`mir-${i}`} position={[0.90, 1.04, z]}>
          <mesh>
            <boxGeometry args={[0.18, 0.09, 0.12]} />
            <meshPhysicalMaterial color="#1A1A26" roughness={0.34} metalness={0.22} clearcoat={0.85} clearcoatRoughness={0.10} />
          </mesh>
        </group>
      ))}

      {/* Front skid accent */}
      <mesh position={[2.49, 0.12, 0]}>
        <boxGeometry args={[0.05, 0.030, 1.60]} />
        <meshPhysicalMaterial color={accentColor} roughness={0.35} metalness={0.60} emissive={accentColor} emissiveIntensity={0.20} />
      </mesh>
    </group>
  );
}

/* ── Scene root ── */
function Scene({ accentColor, rimColor, rimRoughness }: {
  accentColor: string; rimColor: string; rimRoughness: number;
}) {
  return (
    <>
      <SUVBody accentColor={accentColor} />
      {([FRONT_X, REAR_X] as number[]).map((x, i) => (
        <group key={`rw-${i}`} position={[x, AXLE_Y, 0.91]}>
          <WheelMesh rimColor={rimColor} rimRoughness={rimRoughness} accentColor={accentColor} />
        </group>
      ))}
      {([FRONT_X, REAR_X] as number[]).map((x, i) => (
        <group key={`lw-${i}`} position={[x, AXLE_Y, -0.91]} rotation={[0, Math.PI, 0]}>
          <WheelMesh rimColor={rimColor} rimRoughness={rimRoughness} accentColor={accentColor} />
        </group>
      ))}
      <ContactShadows position={[0, 0.001, 0]} opacity={0.55} width={12} height={6} blur={2.2} far={2.0} />
    </>
  );
}

interface Props {
  accentColor: string;
  rimColor: string;
  rimRoughness: number;
  tyreName?: string;
  rimLabel?: string;
  size?: string;
}

export default function CarScene({ accentColor, rimColor, rimRoughness }: Props) {
  return (
    <div className="relative w-full h-full" style={{ background: "#ECEDF4" }}>
      <Canvas
        shadows
        camera={{ position: [4.2, 2.2, 5.5], fov: 38 }}
        gl={{ antialias: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <color attach="background" args={["#ECEDF4"]} />
        <ambientLight intensity={0.55} color="#eef0ff" />
        <directionalLight
          position={[8, 14, 8]} intensity={2.8} color="#ffffff"
          castShadow shadow-mapSize={[1024, 1024]}
          shadow-camera-left={-8} shadow-camera-right={8}
          shadow-camera-top={5} shadow-camera-bottom={-1}
        />
        <directionalLight position={[-6, 6, 5]} intensity={0.70} color="#d4e0ff" />
        <directionalLight position={[0, 3, -7]} intensity={0.28} color="#c8d8ff" />
        <pointLight position={[0, 6, 0]} intensity={1.2} color="#ffffff" distance={18} />
        <Environment preset="studio" background={false} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[30, 20]} />
          <meshStandardMaterial color="#E8E9F0" roughness={0.96} metalness={0.0} />
        </mesh>
        <Scene accentColor={accentColor} rimColor={rimColor} rimRoughness={rimRoughness} />
        <OrbitControls
          target={[0, 0.8, 0]}
          autoRotate autoRotateSpeed={0.32}
          enableDamping dampingFactor={0.06}
          minPolarAngle={Math.PI / 10} maxPolarAngle={Math.PI / 2.3}
          minDistance={4.0} maxDistance={12}
        />
      </Canvas>
      <div className="absolute top-4 left-4 text-[9px] font-bold tracking-[0.22em] uppercase text-[#9CA3AF] flex items-center gap-2 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        3D Preview · Drag to Rotate
      </div>
    </div>
  );
}
