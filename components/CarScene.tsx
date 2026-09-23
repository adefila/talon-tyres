"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

/* ── Tyre geometry constants ── */
const TYRE_SCALE = 0.225;
const FRONT_X  =  1.38;
const REAR_X   = -1.32;
const AXLE_Y   =  0.34;

const tyreProfile: THREE.Vector2[] = [
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

function buildSpokeShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-0.048, 0.200);
  s.bezierCurveTo(-0.076, 0.400, -0.138, 0.660, -0.170, 0.908);
  s.lineTo(0.170, 0.908);
  s.bezierCurveTo(0.138, 0.660, 0.076, 0.400, 0.048, 0.200);
  s.closePath();
  return s;
}

function buildCarBodyShape(): THREE.Shape {
  const shape = new THREE.Shape();

  shape.moveTo(2.25, 0);
  shape.lineTo(2.25, 0.24);
  shape.bezierCurveTo(2.22, 0.40, 2.14, 0.50, 1.94, 0.54);
  shape.bezierCurveTo(1.70, 0.57, 1.44, 0.56, 1.14, 0.53);
  shape.bezierCurveTo(0.90, 0.52, 0.70, 0.64, 0.52, 0.87);
  shape.bezierCurveTo(0.36, 1.04, 0.14, 1.20, -0.10, 1.25);
  shape.bezierCurveTo(-0.34, 1.29, -0.70, 1.29, -1.00, 1.23);
  shape.bezierCurveTo(-1.20, 1.17, -1.38, 1.04, -1.50, 0.92);
  shape.bezierCurveTo(-1.60, 0.82, -1.70, 0.66, -1.78, 0.56);
  shape.bezierCurveTo(-1.90, 0.47, -2.08, 0.43, -2.20, 0.43);
  shape.bezierCurveTo(-2.23, 0.42, -2.25, 0.34, -2.25, 0.24);
  shape.lineTo(-2.25, 0);
  shape.lineTo(2.25, 0);
  shape.closePath();

  /* Wheel arch holes */
  const frontHole = new THREE.Path();
  frontHole.absarc(FRONT_X, AXLE_Y, 0.37, 0, Math.PI * 2, true);
  shape.holes.push(frontHole);

  const rearHole = new THREE.Path();
  rearHole.absarc(REAR_X, AXLE_Y, 0.37, 0, Math.PI * 2, true);
  shape.holes.push(rearHole);

  return shape;
}

function buildGlassShape(): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(0.54, 0.87);
  shape.bezierCurveTo(0.36, 1.04, 0.14, 1.20, -0.10, 1.25);
  shape.bezierCurveTo(-0.34, 1.28, -0.70, 1.28, -1.00, 1.22);
  shape.bezierCurveTo(-1.20, 1.16, -1.38, 1.03, -1.50, 0.91);
  shape.bezierCurveTo(-1.54, 0.86, -1.56, 0.78, -1.56, 0.74);
  shape.bezierCurveTo(-1.38, 0.70, -0.60, 0.67, 0.00, 0.70);
  shape.bezierCurveTo(0.20, 0.71, 0.40, 0.76, 0.54, 0.87);
  shape.closePath();
  return shape;
}

/* ── Wheel mesh — renders one wheel; spins on its Z axis ── */
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
      bevelSize: 0.008, bevelThickness: 0.008, bevelSegments: 2,
    });
  }, []);

  const spokeAngles = useMemo(() =>
    Array.from({ length: 5 }, (_, i) => (i / 5) * Math.PI * 2), []);

  const spokeClearcoat = rimRoughness < 0.20 ? 0.90 : rimRoughness < 0.45 ? 0.40 : 0.05;
  const spokeMetalness = rimRoughness < 0.45 ? 0.92 : 0.58;
  const spokeRoughness = Math.max(rimRoughness, 0.12);

  const cylRot: [number, number, number] = [Math.PI / 2, 0, 0];
  const HALF_DEPTH = 0.460;

  return (
    <group ref={groupRef} scale={[TYRE_SCALE, TYRE_SCALE, TYRE_SCALE]}>

      <mesh rotation={cylRot}>
        <latheGeometry args={[tyreProfile, 64]} />
        <meshStandardMaterial color="#0a0a10" roughness={0.93} metalness={0.0} />
      </mesh>

      {([-0.34, -0.17, 0.00, 0.17, 0.34] as number[]).map((z, i) => (
        <mesh key={`g-${i}`} position={[0, 0, z]}>
          <torusGeometry args={[1.468, 0.038, 8, 64]} />
          <meshStandardMaterial color="#030305" roughness={1.0} />
        </mesh>
      ))}

      {([0.478, -0.478] as number[]).map((z, i) => (
        <mesh key={`sw-${i}`} position={[0, 0, z]}>
          <torusGeometry args={[1.022, 0.020, 10, 64]} />
          <meshStandardMaterial color={accentColor} roughness={0.40} metalness={0.30} emissive={accentColor} emissiveIntensity={0.40} />
        </mesh>
      ))}

      <mesh rotation={cylRot}>
        <cylinderGeometry args={[0.945, 0.945, 0.940, 48, 1, true]} />
        <meshStandardMaterial color="#141418" roughness={0.24} metalness={0.85} side={THREE.DoubleSide} />
      </mesh>

      {([0.470, -0.470] as number[]).map((z, i) => (
        <mesh key={`lip-${i}`} position={[0, 0, z]} rotation={cylRot}>
          <cylinderGeometry args={[0.962, 0.962, 0.024, 48]} />
          <meshStandardMaterial color="#141418" roughness={0.24} metalness={0.85} />
        </mesh>
      ))}

      <mesh position={[0, 0, -0.430]} rotation={cylRot}>
        <cylinderGeometry args={[0.920, 0.920, 0.010, 36]} />
        <meshStandardMaterial color="#141418" roughness={0.24} metalness={0.85} />
      </mesh>

      {spokeAngles.map((angle, i) => (
        <mesh key={`spoke-${i}`} rotation={[0, 0, angle]} position={[0, 0, -HALF_DEPTH]} geometry={spokeGeo}>
          <meshPhysicalMaterial
            color={rimColor}
            roughness={spokeRoughness}
            metalness={spokeMetalness}
            clearcoat={spokeClearcoat}
            clearcoatRoughness={0.12}
            reflectivity={0.85}
          />
        </mesh>
      ))}

      <mesh rotation={cylRot}>
        <cylinderGeometry args={[0.195, 0.195, 1.005, 24]} />
        <meshStandardMaterial color="#141418" roughness={0.24} metalness={0.85} />
      </mesh>

      {([0.508, -0.508] as number[]).map((z, i) => (
        <mesh key={`cap-${i}`} position={[0, 0, z]} rotation={cylRot}>
          <cylinderGeometry args={[0.162, 0.162, 0.024, 20]} />
          <meshStandardMaterial color={accentColor} roughness={0.35} metalness={0.40} emissive={accentColor} emissiveIntensity={0.35} />
        </mesh>
      ))}

    </group>
  );
}

/* ── Car body ── */
function CarBody({ accentColor }: { accentColor: string }) {
  const bodyGeo = useMemo(() => {
    const shape = buildCarBodyShape();
    return new THREE.ExtrudeGeometry(shape, {
      depth: 1.72,
      bevelEnabled: true,
      bevelSize: 0.038,
      bevelThickness: 0.032,
      bevelSegments: 4,
    });
  }, []);

  const glassGeo = useMemo(() => {
    const shape = buildGlassShape();
    return new THREE.ExtrudeGeometry(shape, {
      depth: 1.64,
      bevelEnabled: true,
      bevelSize: 0.018,
      bevelThickness: 0.014,
      bevelSegments: 3,
    });
  }, []);

  /* Underside tray to close the bottom */
  const underbodyGeo = useMemo(() => new THREE.BoxGeometry(4.44, 0.06, 1.70), []);

  return (
    <group>
      {/* Main body */}
      <group position={[0, 0, -0.86]}>
        <mesh geometry={bodyGeo} castShadow receiveShadow>
          <meshStandardMaterial color="#1B1C2A" roughness={0.42} metalness={0.32} />
        </mesh>

        {/* Glass */}
        <group position={[0, 0, 0.04]}>
          <mesh geometry={glassGeo}>
            <meshPhysicalMaterial
              color="#060B12"
              roughness={0.08}
              metalness={0.08}
              transparent
              opacity={0.72}
              transmission={0.0}
            />
          </mesh>
        </group>

        {/* Underbody tray */}
        <mesh geometry={underbodyGeo} position={[0, 0.03, 0.86]}>
          <meshStandardMaterial color="#111118" roughness={0.80} metalness={0.20} />
        </mesh>
      </group>

      {/* Accent stripe along beltline */}
      <mesh position={[0, 0.66, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[3.60, 0.93, 0.014]} />
        <meshStandardMaterial color={accentColor} roughness={0.40} metalness={0.30} emissive={accentColor} emissiveIntensity={0.20} transparent opacity={0.55} />
      </mesh>

      {/* Front headlights */}
      {([-0.55, 0.55] as number[]).map((z, i) => (
        <mesh key={`hl-${i}`} position={[2.24, 0.42, z]}>
          <boxGeometry args={[0.04, 0.10, 0.28]} />
          <meshStandardMaterial color="#FFFFFF" emissive="#E8F0FF" emissiveIntensity={3.0} roughness={0.05} metalness={0} />
        </mesh>
      ))}

      {/* Rear tail lights */}
      {([-0.55, 0.55] as number[]).map((z, i) => (
        <mesh key={`tl-${i}`} position={[-2.24, 0.42, z]}>
          <boxGeometry args={[0.04, 0.10, 0.28]} />
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={2.5} roughness={0.10} metalness={0} />
        </mesh>
      ))}

      {/* Front grille opening */}
      <mesh position={[2.23, 0.24, 0]}>
        <boxGeometry args={[0.04, 0.18, 0.88]} />
        <meshStandardMaterial color="#08080F" roughness={0.80} metalness={0.30} />
      </mesh>
    </group>
  );
}

/* ── Scene root ── */
function Scene({
  accentColor, rimColor, rimRoughness,
}: {
  accentColor: string; rimColor: string; rimRoughness: number;
}) {
  const wheelPositions: Array<{ x: number; flipY: boolean }> = [
    { x: FRONT_X, flipY: false },
    { x: REAR_X,  flipY: false },
  ];
  const leftWheelPositions: Array<{ x: number; flipY: boolean }> = [
    { x: FRONT_X, flipY: true },
    { x: REAR_X,  flipY: true },
  ];

  return (
    <>
      <CarBody accentColor={accentColor} />

      {/* Right-side wheels (rim faces +Z, toward default camera) */}
      {wheelPositions.map(({ x }, i) => (
        <group key={`rw-${i}`} position={[x, AXLE_Y, 0.86]}>
          <WheelMesh rimColor={rimColor} rimRoughness={rimRoughness} accentColor={accentColor} />
        </group>
      ))}

      {/* Left-side wheels (rim faces -Z) */}
      {leftWheelPositions.map(({ x }, i) => (
        <group key={`lw-${i}`} position={[x, AXLE_Y, -0.86]} rotation={[0, Math.PI, 0]}>
          <WheelMesh rimColor={rimColor} rimRoughness={rimRoughness} accentColor={accentColor} />
        </group>
      ))}

      <ContactShadows
        position={[0, 0.002, 0]}
        opacity={0.45}
        width={9}
        height={5}
        blur={1.8}
        far={1.5}
      />
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
    <div className="relative w-full h-full" style={{ background: "#F4F5F8" }}>
      <Canvas
        shadows
        camera={{ position: [3.4, 1.8, 4.8], fov: 40 }}
        gl={{ antialias: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <color attach="background" args={["#F4F5F8"]} />

        <ambientLight intensity={0.55} color="#eef0ff" />
        <directionalLight
          position={[6, 10, 6]} intensity={2.8} color="#ffffff"
          castShadow shadow-mapSize={[1024, 1024]}
          shadow-camera-left={-6} shadow-camera-right={6}
          shadow-camera-top={4} shadow-camera-bottom={-4}
        />
        <directionalLight position={[-5, 4, 3]} intensity={0.80} color="#d4e0ff" />
        <directionalLight position={[0, 2, -6]} intensity={0.35} color="#c8d8ff" />
        <pointLight position={[0, 4, 0]} intensity={1.2} color="#ffffff" distance={14} />

        <Environment preset="studio" background={false} />

        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[24, 16]} />
          <meshStandardMaterial color="#ECEDF2" roughness={0.92} metalness={0.0} />
        </mesh>

        <Scene accentColor={accentColor} rimColor={rimColor} rimRoughness={rimRoughness} />

        <OrbitControls
          target={[0, 0.5, 0]}
          autoRotate
          autoRotateSpeed={0.4}
          enableDamping
          dampingFactor={0.06}
          minPolarAngle={Math.PI / 10}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={3}
          maxDistance={10}
        />
      </Canvas>

      {/* Badge */}
      <div className="absolute top-4 left-4 text-[9px] font-bold tracking-[0.22em] uppercase text-[#9CA3AF] flex items-center gap-2 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        3D Preview · Drag to Rotate
      </div>
    </div>
  );
}
