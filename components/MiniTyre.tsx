"use client";

import { useRef, useMemo, type ReactElement } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function TyreMesh({ accentColor }: { accentColor: string }) {
  const groupRef = useRef<THREE.Group>(null!);

  const rubber = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#0d0d10", roughness: 0.95, metalness: 0.02 }),
    []
  );
  const rimMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#282835", roughness: 0.25, metalness: 0.85 }),
    []
  );
  const accentMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: accentColor,
        roughness: 0.4,
        metalness: 0.3,
        emissive: accentColor,
        emissiveIntensity: 0.3,
      }),
    [accentColor]
  );

  const tread = useMemo((): ReactElement[] => {
    const blocks: ReactElement[] = [];
    const count = 22;
    const R = 1.44;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      blocks.push(
        <mesh key={i} position={[Math.cos(a) * R, Math.sin(a) * R, 0]} rotation={[0, 0, a]} material={rubber}>
          <boxGeometry args={[0.20, 0.28, 0.58]} />
        </mesh>
      );
    }
    return blocks;
  }, [rubber]);

  const spokes = useMemo((): ReactElement[] => {
    return Array.from({ length: 5 }).map((_, i) => {
      const a = (i / 5) * Math.PI * 2;
      return (
        <group key={i} rotation={[0, 0, a]}>
          <mesh position={[0, 0.52, 0]} material={rimMat}>
            <boxGeometry args={[0.09, 0.80, 0.18]} />
          </mesh>
        </group>
      );
    });
  }, [rimMat]);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.z -= delta * 0.4;
  });

  const cylRot: [number, number, number] = [Math.PI / 2, 0, 0];

  return (
    <group ref={groupRef}>
      <mesh material={rubber}><torusGeometry args={[1.44, 0.48, 20, 80]} /></mesh>
      {tread}
      <mesh material={rubber} rotation={cylRot}><cylinderGeometry args={[0.96, 0.96, 0.96, 48, 1, true]} /></mesh>
      <mesh material={accentMat} position={[0, 0, 0.48]}><torusGeometry args={[0.95, 0.025, 12, 80]} /></mesh>
      <mesh material={accentMat} position={[0, 0, -0.48]}><torusGeometry args={[0.95, 0.025, 12, 80]} /></mesh>
      <mesh material={rimMat} rotation={cylRot}><cylinderGeometry args={[0.91, 0.91, 0.95, 48]} /></mesh>
      <mesh material={rimMat} position={[0, 0, 0.47]}><torusGeometry args={[0.6, 0.28, 12, 56]} /></mesh>
      <mesh material={rimMat} position={[0, 0, -0.47]}><torusGeometry args={[0.6, 0.28, 12, 56]} /></mesh>
      {spokes}
      <mesh material={rimMat} rotation={cylRot}><cylinderGeometry args={[0.18, 0.18, 1.0, 24]} /></mesh>
      <mesh material={accentMat} position={[0, 0, 0.51]} rotation={cylRot}><cylinderGeometry args={[0.14, 0.14, 0.02, 24]} /></mesh>
      <mesh material={accentMat} position={[0, 0, -0.51]} rotation={cylRot}><cylinderGeometry args={[0.14, 0.14, 0.02, 24]} /></mesh>
    </group>
  );
}

export default function MiniTyre({ accentColor }: { accentColor: string }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.0], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      <ambientLight intensity={0.10} color="#c0d0ff" />
      <directionalLight position={[3, 5, 4]} intensity={1.8} color="#f0f2ff" />
      <directionalLight position={[-4, -2, -3]} intensity={0.5} color="#2233aa" />
      <pointLight position={[0, 0, -3]} intensity={1.2} color={accentColor} distance={7} />
      <pointLight position={[2, 2, 3]} intensity={0.7} color="#ffffff" distance={5} />
      <TyreMesh accentColor={accentColor} />
    </Canvas>
  );
}
