"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

function buildSpokeShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-0.048, 0.200);
  s.bezierCurveTo(-0.076, 0.400, -0.138, 0.660, -0.170, 0.908);
  s.lineTo(0.170, 0.908);
  s.bezierCurveTo(0.138, 0.660, 0.076, 0.400, 0.048, 0.200);
  s.closePath();
  return s;
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
      bevelSize: 0.007,
      bevelThickness: 0.007,
      bevelSegments: 2,
    });
  }, []);

  const spokeAngles = useMemo(() =>
    Array.from({ length: 5 }, (_, i) => (i / 5) * Math.PI * 2), []);

  const lugAngles = useMemo(() =>
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
        <meshStandardMaterial color="#0a0a10" roughness={0.92} metalness={0.0} emissive="#040408" emissiveIntensity={0.05} />
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

      {/* Sidewall accent rings */}
      {([0.474, -0.474] as number[]).map((z, i) => (
        <mesh key={`sw-${i}`} position={[0, 0, z]}>
          <torusGeometry args={[1.022, 0.020, 12, 80]} />
          <meshStandardMaterial color={accentColor} roughness={0.40} metalness={0.30} emissive={accentColor} emissiveIntensity={0.50} />
        </mesh>
      ))}

      {/* Rim barrel */}
      <mesh rotation={cylRot}>
        <cylinderGeometry args={[0.945, 0.945, 0.940, 48, 1, true]} />
        <meshStandardMaterial color="#141418" roughness={0.24} metalness={0.85} side={THREE.DoubleSide} />
      </mesh>

      {/* Barrel lip flanges */}
      {([0.470, -0.470] as number[]).map((z, i) => (
        <mesh key={`lip-${i}`} position={[0, 0, z]} rotation={cylRot}>
          <cylinderGeometry args={[0.958, 0.958, 0.022, 48]} />
          <meshStandardMaterial color="#141418" roughness={0.24} metalness={0.85} />
        </mesh>
      ))}

      {/* Inner back disc */}
      <mesh position={[0, 0, -0.425]} rotation={cylRot}>
        <cylinderGeometry args={[0.918, 0.918, 0.010, 40]} />
        <meshStandardMaterial color="#141418" roughness={0.24} metalness={0.85} />
      </mesh>

      {/* 5 wide blade spokes */}
      {spokeAngles.map((angle, i) => (
        <mesh key={`spoke-${i}`} rotation={[0, 0, angle]} position={[0, 0, -HALF_DEPTH]} geometry={spokeGeo}>
          <meshPhysicalMaterial
            color="#C8D2E2"
            roughness={0.22}
            metalness={0.90}
            clearcoat={0.85}
            clearcoatRoughness={0.10}
            reflectivity={0.85}
          />
        </mesh>
      ))}

      {/* Hub */}
      <mesh rotation={cylRot}>
        <cylinderGeometry args={[0.195, 0.195, 1.005, 28]} />
        <meshStandardMaterial color="#141418" roughness={0.24} metalness={0.85} />
      </mesh>

      {/* Hub caps */}
      {([0.508, -0.508] as number[]).map((z, i) => (
        <mesh key={`cap-${i}`} position={[0, 0, z]} rotation={cylRot}>
          <cylinderGeometry args={[0.162, 0.162, 0.024, 24]} />
          <meshStandardMaterial color={accentColor} roughness={0.35} metalness={0.40} emissive={accentColor} emissiveIntensity={0.45} />
        </mesh>
      ))}

      {/* Lug bolts */}
      {lugAngles.map((a, i) => {
        const lx = Math.cos(a) * 0.645;
        const ly = Math.sin(a) * 0.645;
        return ([0.505, -0.505] as number[]).map((z, j) => (
          <mesh key={`lug-${i}-${j}`} position={[lx, ly, z]} rotation={cylRot}>
            <cylinderGeometry args={[0.056, 0.056, 0.055, 8]} />
            <meshStandardMaterial color="#28282e" roughness={0.45} metalness={0.80} />
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
      <ambientLight intensity={0.60} color="#e8eeff" />
      <directionalLight position={[4.5, 7, 5.5]}  intensity={4.2} color="#ffffff" />
      <directionalLight position={[-4, 2, 3.5]}   intensity={0.90} color="#ccd8ff" />
      <directionalLight position={[1, -4, 2]}     intensity={0.55} color="#d0d8ff" />
      <pointLight position={[0, 0, -5]}  intensity={1.8} color={accentColor} distance={12} />
      <pointLight position={[-5, 2, 1]}  intensity={2.2} color="#c8d8ff"    distance={14} />
      <pointLight position={[5, 2, 1]}   intensity={1.8} color="#ffffff"    distance={14} />
      <pointLight position={[0, 0, 5]}   intensity={2.0} color="#ffffff"    distance={10} />

      <Environment preset="studio" background={false} />

      <TyreMesh accentColor={accentColor} />
    </Canvas>
  );
}
