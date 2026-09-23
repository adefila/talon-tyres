"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

const TYRE_SCALE = 0.228;
const FRONT_X    =  1.38;
const REAR_X     = -1.32;
const AXLE_Y     =  0.34;

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

function buildSpokeShape(): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(-0.052, 0.195);
  shape.bezierCurveTo(-0.098, 0.368, -0.200, 0.590, -0.276, 0.804);
  shape.bezierCurveTo(-0.305, 0.858, -0.296, 0.908, -0.265, 0.914);
  shape.lineTo(0.265, 0.914);
  shape.bezierCurveTo(0.296, 0.908, 0.305, 0.858, 0.276, 0.804);
  shape.bezierCurveTo(0.200, 0.590, 0.098, 0.368, 0.052, 0.195);
  shape.closePath();
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

/* Sedan side profile — nose at +X, tail at -X */
function buildCarBodyShape(): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(2.28, 0);
  shape.lineTo(2.28, 0.22);
  shape.bezierCurveTo(2.24, 0.38, 2.16, 0.50, 1.96, 0.54);
  shape.bezierCurveTo(1.72, 0.58, 1.46, 0.57, 1.16, 0.54);
  shape.bezierCurveTo(0.90, 0.52, 0.70, 0.64, 0.52, 0.87);
  shape.bezierCurveTo(0.36, 1.05, 0.12, 1.21, -0.12, 1.26);
  shape.bezierCurveTo(-0.36, 1.30, -0.72, 1.30, -1.02, 1.24);
  shape.bezierCurveTo(-1.22, 1.18, -1.40, 1.05, -1.52, 0.92);
  shape.bezierCurveTo(-1.62, 0.82, -1.72, 0.66, -1.80, 0.56);
  shape.bezierCurveTo(-1.92, 0.47, -2.10, 0.43, -2.22, 0.43);
  shape.bezierCurveTo(-2.25, 0.42, -2.28, 0.34, -2.28, 0.22);
  shape.lineTo(-2.28, 0);
  shape.lineTo(2.28, 0);
  shape.closePath();
  const frontArch = new THREE.Path();
  frontArch.absarc(FRONT_X, AXLE_Y, 0.38, 0, Math.PI * 2, true);
  shape.holes.push(frontArch);
  const rearArch = new THREE.Path();
  rearArch.absarc(REAR_X, AXLE_Y, 0.38, 0, Math.PI * 2, true);
  shape.holes.push(rearArch);
  return shape;
}

function buildGlassShape(): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(0.54, 0.87);
  shape.bezierCurveTo(0.36, 1.05, 0.12, 1.21, -0.12, 1.26);
  shape.bezierCurveTo(-0.36, 1.30, -0.72, 1.29, -1.02, 1.23);
  shape.bezierCurveTo(-1.22, 1.17, -1.40, 1.04, -1.52, 0.91);
  shape.bezierCurveTo(-1.56, 0.86, -1.58, 0.78, -1.58, 0.73);
  shape.bezierCurveTo(-1.40, 0.69, -0.60, 0.66, 0.00, 0.69);
  shape.bezierCurveTo(0.20, 0.70, 0.40, 0.76, 0.54, 0.87);
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
    if (groupRef.current) groupRef.current.rotation.z -= delta * 1.4;
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
          <meshPhysicalMaterial attach="material-0" color="#0C0C14" roughness={0.22} metalness={0.88} />
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
          <meshStandardMaterial color="#0A0A10" roughness={0.30} metalness={0.85} />
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

/* ── Car body ── */
function CarBody({ accentColor }: { accentColor: string }) {
  const bodyGeo = useMemo(() => new THREE.ExtrudeGeometry(buildCarBodyShape(), {
    depth: 1.72,
    bevelEnabled: true,
    bevelSize: 0.065,
    bevelThickness: 0.055,
    bevelSegments: 6,
  }), []);

  const glassGeo = useMemo(() => new THREE.ExtrudeGeometry(buildGlassShape(), {
    depth: 1.62,
    bevelEnabled: true,
    bevelSize: 0.022,
    bevelThickness: 0.018,
    bevelSegments: 4,
  }), []);

  const underbodyGeo = useMemo(() => new THREE.BoxGeometry(4.50, 0.06, 1.68), []);

  return (
    <group>
      {/* ── Main body — deep metallic paint with clearcoat ── */}
      <group position={[0, 0, -0.86]}>
        <mesh geometry={bodyGeo} castShadow receiveShadow>
          <meshPhysicalMaterial
            color="#18192A"
            roughness={0.38}
            metalness={0.30}
            clearcoat={1.0}
            clearcoatRoughness={0.10}
          />
        </mesh>

        {/* Window glass */}
        <group position={[0, 0, 0.05]}>
          <mesh geometry={glassGeo}>
            <meshPhysicalMaterial
              color="#060C14"
              roughness={0.06}
              metalness={0.05}
              transparent
              opacity={0.74}
              reflectivity={0.8}
            />
          </mesh>
        </group>

        {/* Underbody */}
        <mesh geometry={underbodyGeo} position={[0, 0.03, 0.86]}>
          <meshStandardMaterial color="#10101A" roughness={0.82} metalness={0.18} />
        </mesh>

        {/* Wheel arch liners (dark recessed inner arch) */}
        {([
          { cx: FRONT_X, cy: AXLE_Y },
          { cx: REAR_X,  cy: AXLE_Y },
        ]).map(({ cx, cy }, i) => (
          <mesh key={`arch-${i}`} position={[cx, cy, 0]}>
            <torusGeometry args={[0.385, 0.035, 8, 56, Math.PI]} />
            <meshStandardMaterial color="#0A0A14" roughness={0.80} metalness={0.20} side={THREE.BackSide} />
          </mesh>
        ))}
      </group>

      {/* ── Accent stripe along beltline ── */}
      <mesh position={[0, 0.628, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[3.80, 0.90, 0.010]} />
        <meshStandardMaterial color={accentColor} roughness={0.42} metalness={0.28} emissive={accentColor} emissiveIntensity={0.14} transparent opacity={0.45} />
      </mesh>

      {/* ── Front headlights — LED strip style ── */}
      {([-0.60, 0.60] as number[]).map((z, i) => (
        <group key={`hl-${i}`} position={[2.26, 0.44, z]}>
          <mesh>
            <boxGeometry args={[0.04, 0.06, 0.34]} />
            <meshStandardMaterial color="#FFFFFF" emissive="#DDEEFF" emissiveIntensity={4.0} roughness={0.04} metalness={0} />
          </mesh>
          {/* DRL strip */}
          <mesh position={[0, -0.04, 0]}>
            <boxGeometry args={[0.025, 0.018, 0.30]} />
            <meshStandardMaterial color="#FFFBE8" emissive="#FFFBE8" emissiveIntensity={5.0} roughness={0.02} metalness={0} />
          </mesh>
        </group>
      ))}

      {/* ── Rear tail lights — accent coloured ── */}
      {([-0.60, 0.60] as number[]).map((z, i) => (
        <group key={`tl-${i}`} position={[-2.26, 0.44, z]}>
          <mesh>
            <boxGeometry args={[0.04, 0.08, 0.36]} />
            <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={3.5} roughness={0.08} metalness={0} />
          </mesh>
          <mesh position={[0, -0.05, 0]}>
            <boxGeometry args={[0.025, 0.022, 0.30]} />
            <meshStandardMaterial color="#FF2222" emissive="#FF1111" emissiveIntensity={4.0} roughness={0.04} metalness={0} />
          </mesh>
        </group>
      ))}

      {/* ── Front grille / lower bumper ── */}
      <mesh position={[2.26, 0.18, 0]}>
        <boxGeometry args={[0.05, 0.22, 1.00]} />
        <meshPhysicalMaterial color="#0A0A12" roughness={0.45} metalness={0.60} clearcoat={0.4} clearcoatRoughness={0.2} />
      </mesh>

      {/* Grille horizontal slats */}
      {([0.06, 0.13, 0.20] as number[]).map((y, i) => (
        <mesh key={`slat-${i}`} position={[2.25, y, 0]}>
          <boxGeometry args={[0.04, 0.012, 0.96]} />
          <meshPhysicalMaterial color="#1A1A28" roughness={0.30} metalness={0.80} clearcoat={0.5} clearcoatRoughness={0.15} />
        </mesh>
      ))}

      {/* Door lines (thin embossed edge) */}
      <mesh position={[-0.05, 0.65, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.014, 0.92, 0.60]} />
        <meshStandardMaterial color="#131320" roughness={0.50} metalness={0.50} />
      </mesh>

      {/* Side mirror stubs */}
      {([0.82, -0.82] as number[]).map((z, i) => (
        <mesh key={`mirror-${i}`} position={[0.88, 0.96, z]}>
          <boxGeometry args={[0.14, 0.07, 0.10]} />
          <meshPhysicalMaterial color="#16172A" roughness={0.36} metalness={0.28} clearcoat={0.9} clearcoatRoughness={0.10} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Scene root ── */
function Scene({
  accentColor, rimColor, rimRoughness,
}: {
  accentColor: string; rimColor: string; rimRoughness: number;
}) {
  return (
    <>
      <CarBody accentColor={accentColor} />

      {/* Right-side wheels (rim faces +Z = toward default camera) */}
      {([FRONT_X, REAR_X] as number[]).map((x, i) => (
        <group key={`rw-${i}`} position={[x, AXLE_Y, 0.86]}>
          <WheelMesh rimColor={rimColor} rimRoughness={rimRoughness} accentColor={accentColor} />
        </group>
      ))}

      {/* Left-side wheels (flipped, rim faces −Z) */}
      {([FRONT_X, REAR_X] as number[]).map((x, i) => (
        <group key={`lw-${i}`} position={[x, AXLE_Y, -0.86]} rotation={[0, Math.PI, 0]}>
          <WheelMesh rimColor={rimColor} rimRoughness={rimRoughness} accentColor={accentColor} />
        </group>
      ))}

      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={0.52}
        width={10}
        height={5.5}
        blur={2.0}
        far={1.8}
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
    <div className="relative w-full h-full" style={{ background: "#F2F3F8" }}>
      <Canvas
        shadows
        camera={{ position: [3.6, 1.9, 5.0], fov: 40 }}
        gl={{ antialias: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <color attach="background" args={["#F2F3F8"]} />

        <ambientLight intensity={0.50} color="#eef0ff" />
        <directionalLight
          position={[7, 12, 7]} intensity={2.6} color="#ffffff"
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-left={-7} shadow-camera-right={7}
          shadow-camera-top={4} shadow-camera-bottom={-1}
        />
        <directionalLight position={[-5, 5, 4]} intensity={0.75} color="#d4e0ff" />
        <directionalLight position={[0, 2, -6]} intensity={0.30} color="#c8d8ff" />
        <pointLight position={[0, 5, 0]} intensity={1.0} color="#ffffff" distance={16} />

        <Environment preset="studio" background={false} />

        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[30, 20]} />
          <meshStandardMaterial color="#ECEDF4" roughness={0.95} metalness={0.0} />
        </mesh>

        <Scene accentColor={accentColor} rimColor={rimColor} rimRoughness={rimRoughness} />

        <OrbitControls
          target={[0, 0.5, 0]}
          autoRotate
          autoRotateSpeed={0.35}
          enableDamping
          dampingFactor={0.06}
          minPolarAngle={Math.PI / 10}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={3.5}
          maxDistance={11}
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
