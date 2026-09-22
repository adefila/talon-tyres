"use client";

import { useRef, useMemo, type ReactElement } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function TyreMesh({ accentColor }: { accentColor: string }) {
  const groupRef = useRef<THREE.Group>(null!);
  // Start at a nice 3/4 angle matching the configurator
  const rot = useRef({ x: 0.38, y: 0.0 });

  const rubber = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#222232",
    roughness: 0.90,
    metalness: 0.03,
    emissive: "#0a0a14",
    emissiveIntensity: 0.10,
  }), []);

  const rimMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#C0C8D8",
    roughness: 0.14,
    metalness: 0.92,
    envMapIntensity: 1.3,
  }), []);

  const spokeMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#B8C4D4",
    roughness: 0.12,
    metalness: 0.90,
  }), []);

  const accentMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: accentColor,
    roughness: 0.35,
    metalness: 0.35,
    emissive: accentColor,
    emissiveIntensity: 0.55,
  }), [accentColor]);

  const tread = useMemo((): ReactElement[] => {
    const blocks: ReactElement[] = [];
    const count = 28;
    const R = 1.44;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const isMain = i % 2 === 0;
      blocks.push(
        <mesh key={i} position={[Math.cos(a) * R, Math.sin(a) * R, 0]}
          rotation={[0, 0, a]} material={rubber}>
          <boxGeometry args={isMain ? [0.18, 0.28, 0.55] : [0.12, 0.20, 0.55]} />
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
          <mesh position={[0, 0.50, 0]} material={spokeMat}>
            <boxGeometry args={[0.10, 0.78, 0.20]} />
          </mesh>
          <mesh position={[0, 0.84, 0]} material={rimMat}>
            <boxGeometry args={[0.15, 0.22, 0.26]} />
          </mesh>
        </group>
      );
    });
  }, [spokeMat, rimMat]);

  // Y-axis turntable rotation — matches configurator
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    rot.current.y += delta * 0.30;
    groupRef.current.rotation.x = rot.current.x;
    groupRef.current.rotation.y = rot.current.y;
  });

  const cylRot: [number, number, number] = [Math.PI / 2, 0, 0];

  return (
    // Scaled to prevent clipping at any rotation angle
    <group ref={groupRef} scale={[0.70, 0.70, 0.70]}>
      <mesh material={rubber}><torusGeometry args={[1.44, 0.48, 24, 80]} /></mesh>
      {tread}
      <mesh material={rubber} rotation={cylRot}><cylinderGeometry args={[0.96, 0.96, 0.96, 48, 1, true]} /></mesh>
      {/* Accent rings */}
      <mesh material={accentMat} position={[0, 0, 0.48]}><torusGeometry args={[0.95, 0.028, 14, 80]} /></mesh>
      <mesh material={accentMat} position={[0, 0, -0.48]}><torusGeometry args={[0.95, 0.028, 14, 80]} /></mesh>
      {/* Rim */}
      <mesh material={rimMat} rotation={cylRot}><cylinderGeometry args={[0.91, 0.91, 0.95, 48]} /></mesh>
      <mesh material={rimMat} position={[0, 0, 0.47]}><torusGeometry args={[0.60, 0.27, 12, 56]} /></mesh>
      <mesh material={rimMat} position={[0, 0, -0.47]}><torusGeometry args={[0.60, 0.27, 12, 56]} /></mesh>
      {spokes}
      {/* Hub */}
      <mesh material={rimMat} rotation={cylRot}><cylinderGeometry args={[0.18, 0.18, 1.0, 24]} /></mesh>
      <mesh material={accentMat} position={[0, 0, 0.50]} rotation={cylRot}><cylinderGeometry args={[0.16, 0.16, 0.02, 24]} /></mesh>
      <mesh material={accentMat} position={[0, 0, -0.50]} rotation={cylRot}><cylinderGeometry args={[0.16, 0.16, 0.02, 24]} /></mesh>
      <mesh material={accentMat} position={[0, 0, 0.515]} rotation={cylRot}><cylinderGeometry args={[0.065, 0.065, 0.01, 16]} /></mesh>
      <mesh material={accentMat} position={[0, 0, -0.515]} rotation={cylRot}><cylinderGeometry args={[0.065, 0.065, 0.01, 16]} /></mesh>
    </group>
  );
}

export default function MiniTyre({ accentColor }: { accentColor: string }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.0], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
      onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); }}
    >
      <ambientLight intensity={0.30} color="#c8d4ff" />
      <directionalLight position={[4, 6, 5]} intensity={3.0} color="#f5f6ff" />
      <directionalLight position={[-4, -2, -3]} intensity={0.7} color="#3344cc" />
      {/* Accent back-light */}
      <pointLight position={[0, 0, -5]} intensity={3.0} color={accentColor} distance={12} />
      {/* Rim kickers */}
      <pointLight position={[-6, 1, 0]} intensity={2.5} color="#b8ccff" distance={12} />
      <pointLight position={[6, 1, 0]} intensity={2.0} color="#ffffff" distance={12} />
      <pointLight position={[0, 5, 4]} intensity={1.5} color="#ffffff" distance={10} />
      <TyreMesh accentColor={accentColor} />
    </Canvas>
  );
}
