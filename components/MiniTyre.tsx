"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

/* Y-split spoke — identical geometry to ConfiguratorScene */
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

function TyreMesh({ accentColor }: { accentColor: string }) {
  const groupRef = useRef<THREE.Group>(null!);
  const rot = useRef({ x: 0.32, y: 0.55 });

  const tyreProfile = useMemo<THREE.Vector2[]>(() => [
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
  ], []);

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
  const lugAngles   = useMemo(() =>
    Array.from({ length: 5 }, (_, i) => (i / 5) * Math.PI * 2), []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    rot.current.y += delta * 0.30;
    groupRef.current.rotation.x = rot.current.x;
    groupRef.current.rotation.y = rot.current.y;
  });

  const cylRot: [number, number, number] = [Math.PI / 2, 0, 0];
  const HALF_DEPTH = 0.460;

  return (
    <group ref={groupRef} scale={[0.70, 0.70, 0.70]}>

      {/* Tyre body */}
      <mesh rotation={cylRot}>
        <latheGeometry args={[tyreProfile, 80]} />
        <meshStandardMaterial color="#090910" roughness={0.94} metalness={0.0} emissive="#030306" emissiveIntensity={0.05} />
      </mesh>

      {/* Tread grooves */}
      {([-0.34, -0.17, 0.00, 0.17, 0.34] as number[]).map((z, i) => (
        <mesh key={`g-${i}`} position={[0, 0, z]}>
          <torusGeometry args={[1.468, 0.038, 9, 80]} />
          <meshStandardMaterial color="#030305" roughness={1.0} metalness={0} />
        </mesh>
      ))}

      {/* Shoulder grooves */}
      {([-0.42, 0.42] as number[]).map((z, i) => (
        <mesh key={`sg-${i}`} position={[0, 0, z]}>
          <torusGeometry args={[1.408, 0.026, 7, 72]} />
          <meshStandardMaterial color="#030305" roughness={1.0} metalness={0} />
        </mesh>
      ))}

      {/* Sidewall accent */}
      {([0.474, -0.474] as number[]).map((z, i) => (
        <mesh key={`sw-${i}`} position={[0, 0, z]}>
          <torusGeometry args={[1.022, 0.018, 12, 80]} />
          <meshStandardMaterial color={accentColor} roughness={0.38} metalness={0.28} emissive={accentColor} emissiveIntensity={0.45} />
        </mesh>
      ))}

      {/* Rim barrel */}
      <mesh rotation={cylRot}>
        <cylinderGeometry args={[0.945, 0.945, 0.930, 56, 1, true]} />
        <meshStandardMaterial color="#0E0E14" roughness={0.22} metalness={0.88} side={THREE.DoubleSide} />
      </mesh>

      {/* Polished outer lip rings */}
      {([0.468, -0.468] as number[]).map((z, i) => (
        <mesh key={`lip-${i}`} position={[0, 0, z]} rotation={cylRot}>
          <cylinderGeometry args={[0.968, 0.960, 0.048, 56]} />
          <meshPhysicalMaterial color="#D2D8E6" roughness={0.08} metalness={0.96} clearcoat={0.95} clearcoatRoughness={0.06} reflectivity={0.95} />
        </mesh>
      ))}

      {/* Inner back disc */}
      <mesh position={[0, 0, -0.428]} rotation={cylRot}>
        <cylinderGeometry args={[0.920, 0.920, 0.010, 40]} />
        <meshStandardMaterial color="#0A0A12" roughness={0.24} metalness={0.85} />
      </mesh>

      {/* 5 Y-split spokes — chrome preset (product cards always show chrome) */}
      {spokeAngles.map((angle, i) => (
        <mesh
          key={`spoke-${i}`}
          rotation={[0, 0, angle]}
          position={[0, 0, -HALF_DEPTH]}
          geometry={spokeGeo}
        >
          <meshPhysicalMaterial attach="material-0"
            color="#0C0C14" roughness={0.22} metalness={0.88}
          />
          <meshPhysicalMaterial attach="material-1"
            color="#0A0A12" roughness={0.28} metalness={0.80}
          />
          <meshPhysicalMaterial attach="material-2"
            color="#C8D2E2" roughness={0.14} metalness={0.94}
            clearcoat={0.92} clearcoatRoughness={0.08} reflectivity={0.92}
          />
        </mesh>
      ))}

      {/* Hub */}
      <mesh rotation={cylRot}>
        <cylinderGeometry args={[0.198, 0.198, 1.010, 28]} />
        <meshStandardMaterial color="#0E0E14" roughness={0.22} metalness={0.88} />
      </mesh>

      {/* Hub cap */}
      {([0.510, -0.510] as number[]).map((z, i) => (
        <mesh key={`cap-${i}`} position={[0, 0, z]} rotation={cylRot}>
          <cylinderGeometry args={[0.178, 0.178, 0.028, 24]} />
          <meshStandardMaterial color="#0A0A10" roughness={0.30} metalness={0.85} />
        </mesh>
      ))}

      {/* Hub accent ring */}
      {([0.514, -0.514] as number[]).map((z, i) => (
        <mesh key={`hubring-${i}`} position={[0, 0, z]}>
          <torusGeometry args={[0.168, 0.010, 8, 32]} />
          <meshStandardMaterial color={accentColor} roughness={0.35} metalness={0.40} emissive={accentColor} emissiveIntensity={0.50} />
        </mesh>
      ))}

      {/* Lug bolts */}
      {lugAngles.map((a, i) => {
        const lx = Math.cos(a) * 0.650;
        const ly = Math.sin(a) * 0.650;
        return ([0.508, -0.508] as number[]).map((z, j) => (
          <mesh key={`lug-${i}-${j}`} position={[lx, ly, z]} rotation={cylRot}>
            <cylinderGeometry args={[0.052, 0.052, 0.058, 10]} />
            <meshPhysicalMaterial color="#C8CCD8" roughness={0.18} metalness={0.92} clearcoat={0.7} clearcoatRoughness={0.12} />
          </mesh>
        ));
      })}

    </group>
  );
}

export default function MiniTyre({ accentColor }: { accentColor: string }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 32 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
      onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); }}
    >
      <ambientLight intensity={0.55} color="#e8eeff" />
      <directionalLight position={[5, 8, 6]}  intensity={4.0} color="#ffffff" />
      <directionalLight position={[-4, 2, 4]} intensity={0.80} color="#ccd8ff" />
      <directionalLight position={[1, -4, 2]} intensity={0.45} color="#d0d8ff" />
      <pointLight position={[0, 0, -5]}  intensity={1.6} color={accentColor} distance={12} />
      <pointLight position={[-5, 2, 1]}  intensity={2.0} color="#c8d8ff"    distance={14} />
      <pointLight position={[5, 2, 1]}   intensity={1.6} color="#ffffff"    distance={14} />
      <pointLight position={[0, 0, 5]}   intensity={1.8} color="#ffffff"    distance={10} />

      <Environment preset="studio" background={false} />

      <TyreMesh accentColor={accentColor} />
    </Canvas>
  );
}
