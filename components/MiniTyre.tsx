"use client";

import { useRef, useMemo, type ReactElement } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function TyreMesh({ accentColor }: { accentColor: string }) {
  const groupRef = useRef<THREE.Group>(null!);
  const rot = useRef({ x: 0.42, y: 0.0 });

  /* ── Materials ── */
  const rubber = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#0c0c12",
    roughness: 0.92,
    metalness: 0.0,
    emissive: "#050508",
    emissiveIntensity: 0.05,
  }), []);

  const grooveMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#040406",
    roughness: 0.99,
    metalness: 0,
  }), []);

  // Dark painted rim body
  const rimBodyMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#18181f",
    roughness: 0.28,
    metalness: 0.82,
  }), []);

  // Machined polished spoke faces
  const spokeMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#C0C8D8",
    roughness: 0.14,
    metalness: 0.92,
    envMapIntensity: 1.3,
  }), []);

  const accentMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: accentColor,
    roughness: 0.40,
    metalness: 0.30,
    emissive: accentColor,
    emissiveIntensity: 0.50,
  }), [accentColor]);

  const lugMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#2a2a38",
    roughness: 0.45,
    metalness: 0.80,
  }), []);

  /* ── Tyre profile (same as ConfiguratorScene) ── */
  const tyreProfile = useMemo<THREE.Vector2[]>(() => [
    new THREE.Vector2(0.955, -0.495),
    new THREE.Vector2(0.970, -0.440),
    new THREE.Vector2(1.020, -0.430),
    new THREE.Vector2(1.090, -0.460),
    new THREE.Vector2(1.200, -0.470),
    new THREE.Vector2(1.330, -0.465),
    new THREE.Vector2(1.420, -0.430),
    new THREE.Vector2(1.460, -0.360),
    new THREE.Vector2(1.475, -0.260),
    new THREE.Vector2(1.482, -0.140),
    new THREE.Vector2(1.484, -0.040),
    new THREE.Vector2(1.484,  0.000),
    new THREE.Vector2(1.484,  0.040),
    new THREE.Vector2(1.482,  0.140),
    new THREE.Vector2(1.475,  0.260),
    new THREE.Vector2(1.460,  0.360),
    new THREE.Vector2(1.420,  0.430),
    new THREE.Vector2(1.330,  0.465),
    new THREE.Vector2(1.200,  0.470),
    new THREE.Vector2(1.090,  0.460),
    new THREE.Vector2(1.020,  0.430),
    new THREE.Vector2(0.970,  0.440),
    new THREE.Vector2(0.955,  0.495),
  ], []);

  /* ── 5 circumferential tread grooves ── */
  const treadGrooves = useMemo<ReactElement[]>(() => {
    const grooveZ = [-0.30, -0.14, 0.00, 0.14, 0.30];
    return grooveZ.map((z, i) => (
      <mesh key={i} position={[0, 0, z]} material={grooveMat}>
        <torusGeometry args={[1.473, 0.034, 10, 80]} />
      </mesh>
    ));
  }, [grooveMat]);

  /* ── 10 spokes in 5 Y-pairs ── */
  const spokes = useMemo<ReactElement[]>(() => {
    const out: ReactElement[] = [];
    const OFFSET = 0.105;
    for (let i = 0; i < 5; i++) {
      const base = (i / 5) * Math.PI * 2;
      for (const off of [-OFFSET, OFFSET]) {
        const a = base + off;
        out.push(
          <group key={`s-${i}-${off}`} rotation={[0, 0, a]}>
            <mesh position={[0, 0.50, 0]} material={spokeMat}>
              <boxGeometry args={[0.082, 0.68, 0.195]} />
            </mesh>
            <mesh position={[0, 0.865, 0]} material={spokeMat}>
              <boxGeometry args={[0.130, 0.185, 0.240]} />
            </mesh>
            <mesh position={[0, 0.255, 0]} material={spokeMat}>
              <boxGeometry args={[0.068, 0.175, 0.160]} />
            </mesh>
          </group>
        );
      }
    }
    return out;
  }, [spokeMat]);

  /* ── 5 lug bolts per face ── */
  const lugBolts = useMemo<ReactElement[]>(() => {
    const bolts: ReactElement[] = [];
    const cylRot: [number, number, number] = [Math.PI / 2, 0, 0];
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      const x = Math.cos(a) * 0.660;
      const y = Math.sin(a) * 0.660;
      for (const z of [0.490, -0.490]) {
        bolts.push(
          <mesh key={`lug-${i}-${z}`} position={[x, y, z]} rotation={cylRot} material={lugMat}>
            <cylinderGeometry args={[0.055, 0.055, 0.055, 8]} />
          </mesh>
        );
      }
    }
    return bolts;
  }, [lugMat]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    rot.current.y += delta * 0.30;
    groupRef.current.rotation.x = rot.current.x;
    groupRef.current.rotation.y = rot.current.y;
  });

  const cylRot: [number, number, number] = [Math.PI / 2, 0, 0];

  return (
    <group ref={groupRef} scale={[0.70, 0.70, 0.70]}>

      {/* Tyre body */}
      <mesh material={rubber} rotation={cylRot}>
        <latheGeometry args={[tyreProfile, 80]} />
      </mesh>

      {/* Tread grooves */}
      {treadGrooves}

      {/* Sidewall accent stripes */}
      <mesh material={accentMat} position={[0, 0, 0.475]}>
        <torusGeometry args={[1.025, 0.020, 12, 80]} />
      </mesh>
      <mesh material={accentMat} position={[0, 0, -0.475]}>
        <torusGeometry args={[1.025, 0.020, 12, 80]} />
      </mesh>

      {/* Rim barrel (dark, open cylinder) */}
      <mesh material={rimBodyMat} rotation={cylRot}>
        <cylinderGeometry args={[0.948, 0.948, 0.945, 48, 1, true]} />
      </mesh>

      {/* Dark rim face background discs */}
      <mesh material={rimBodyMat} position={[0, 0, 0.460]} rotation={cylRot}>
        <cylinderGeometry args={[0.930, 0.180, 0.010, 48]} />
      </mesh>
      <mesh material={rimBodyMat} position={[0, 0, -0.460]} rotation={cylRot}>
        <cylinderGeometry args={[0.930, 0.180, 0.010, 48]} />
      </mesh>

      {/* Rim barrel lip edges */}
      <mesh material={rimBodyMat} position={[0, 0, 0.468]} rotation={cylRot}>
        <cylinderGeometry args={[0.960, 0.935, 0.022, 48]} />
      </mesh>
      <mesh material={rimBodyMat} position={[0, 0, -0.468]} rotation={cylRot}>
        <cylinderGeometry args={[0.960, 0.935, 0.022, 48]} />
      </mesh>

      {/* 10 Y-spokes */}
      {spokes}

      {/* Lug bolts */}
      {lugBolts}

      {/* Hub cylinder */}
      <mesh material={rimBodyMat} rotation={cylRot}>
        <cylinderGeometry args={[0.190, 0.190, 1.00, 28]} />
      </mesh>

      {/* Hub caps */}
      <mesh material={accentMat} position={[0, 0, 0.502]} rotation={cylRot}>
        <cylinderGeometry args={[0.165, 0.165, 0.022, 24]} />
      </mesh>
      <mesh material={accentMat} position={[0, 0, -0.502]} rotation={cylRot}>
        <cylinderGeometry args={[0.165, 0.165, 0.022, 24]} />
      </mesh>

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
      <ambientLight intensity={0.32} color="#eef0ff" />
      <directionalLight position={[4, 6, 5]} intensity={3.5} color="#f5f6ff" />
      <directionalLight position={[-4, -2, -3]} intensity={0.60} color="#3344cc" />
      <pointLight position={[0, 0, -5]} intensity={2.2} color={accentColor} distance={12} />
      <pointLight position={[-6, 1, 0]} intensity={2.4} color="#b8ccff" distance={12} />
      <pointLight position={[6, 1, 0]} intensity={2.0} color="#ffffff" distance={12} />
      <pointLight position={[0, 5, 4]} intensity={1.4} color="#ffffff" distance={10} />
      <TyreMesh accentColor={accentColor} />
    </Canvas>
  );
}
