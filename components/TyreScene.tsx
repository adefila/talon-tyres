"use client";

import { useRef, useMemo, useEffect, useState, type ReactElement } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ── Mouse tracking ── */
function useMouseParallax() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const move = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return mouse;
}

/*
  Tyre orientation:
  - Camera is at [0, 0, 4.2] looking toward origin (down the -Z axis)
  - Tyre "face" is in the XY plane → viewer sees a ring
  - Tyre axle runs along Z
  - Three.js TorusGeometry: default XY plane ✓ → no rotation needed
  - Three.js CylinderGeometry: default axis along Y → rotate [Math.PI/2, 0, 0] for Z-axis
*/

function Tyre3D() {
  const groupRef = useRef<THREE.Group>(null!);
  const mouse = useMouseParallax();
  const targetRot = useRef({ x: 0, y: 0 });

  /* Shared materials */
  const rubber = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#0e0e12", roughness: 0.95, metalness: 0.02 }),
    []
  );
  const rim = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#28283a", roughness: 0.22, metalness: 0.88 }),
    []
  );
  const spoke = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#303048", roughness: 0.18, metalness: 0.92 }),
    []
  );
  const hub = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#CC0000", roughness: 0.35, metalness: 0.55 }),
    []
  );
  const redAccent = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#CC0000",
        roughness: 0.45,
        metalness: 0.3,
        emissive: "#550000",
        emissiveIntensity: 0.4,
      }),
    []
  );

  /* Tread blocks — placed around XY plane circumference */
  const treadBlocks = useMemo(() => {
    const blocks: ReactElement[] = [];
    const count = 30;
    const R = 1.44;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * R;
      const y = Math.sin(angle) * R;
      blocks.push(
        /* Main block */
        <mesh key={`t${i}`} position={[x, y, 0]} rotation={[0, 0, angle]} material={rubber}>
          <boxGeometry args={[0.19, 0.30, 0.60]} />
        </mesh>
      );
      /* Offset side block */
      blocks.push(
        <mesh key={`s${i}`} position={[x * 0.982, y * 0.982, 0.24]} rotation={[0, 0, angle]} material={rubber}>
          <boxGeometry args={[0.12, 0.16, 0.10]} />
        </mesh>
      );
    }
    return blocks;
  }, [rubber]);

  /* 5 spokes in XY plane */
  const spokes = useMemo(() => {
    const arms: ReactElement[] = [];
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      arms.push(
        <group key={i} rotation={[0, 0, angle]}>
          {/* Arm */}
          <mesh position={[0, 0.52, 0]} material={spoke}>
            <boxGeometry args={[0.10, 0.82, 0.20]} />
          </mesh>
          {/* Rim junction */}
          <mesh position={[0, 0.87, 0]} material={rim}>
            <boxGeometry args={[0.16, 0.22, 0.26]} />
          </mesh>
        </group>
      );
    }
    return arms;
  }, [spoke, rim]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    /* Continuous spin — rotate in XY plane (around Z axis) */
    groupRef.current.rotation.z -= delta * 0.32;
    /* Smooth mouse parallax tilts */
    targetRot.current.x += (-mouse.y * 0.22 - targetRot.current.x) * 0.055;
    targetRot.current.y += (mouse.x * 0.22 - targetRot.current.y) * 0.055;
    groupRef.current.rotation.x = targetRot.current.x;
    groupRef.current.rotation.y = targetRot.current.y;
  });

  const cylRot: [number, number, number] = [Math.PI / 2, 0, 0];

  return (
    <group ref={groupRef}>
      {/* ── Outer rubber tyre body (torus in XY plane) ── */}
      <mesh material={rubber}>
        <torusGeometry args={[1.44, 0.50, 28, 96]} />
      </mesh>

      {/* Tread blocks */}
      {treadBlocks}

      {/* ── Sidewall inner tube ── */}
      <mesh material={rubber} rotation={cylRot}>
        <cylinderGeometry args={[0.96, 0.96, 1.02, 64, 1, true]} />
      </mesh>

      {/* Sidewall red accent rings */}
      <mesh material={redAccent} position={[0, 0, 0.50]}>
        <torusGeometry args={[0.955, 0.025, 16, 96]} />
      </mesh>
      <mesh material={redAccent} position={[0, 0, -0.50]}>
        <torusGeometry args={[0.955, 0.025, 16, 96]} />
      </mesh>

      {/* ── Rim barrel (cylinder along Z) ── */}
      <mesh material={rim} rotation={cylRot}>
        <cylinderGeometry args={[0.92, 0.92, 0.98, 64, 1, false]} />
      </mesh>

      {/* Rim face rings (at front and back of rim) */}
      <mesh material={rim} position={[0, 0, 0.49]}>
        <torusGeometry args={[0.62, 0.28, 16, 64]} />
      </mesh>
      <mesh material={rim} position={[0, 0, -0.49]}>
        <torusGeometry args={[0.62, 0.28, 16, 64]} />
      </mesh>

      {/* ── Spokes (in XY plane) ── */}
      {spokes}

      {/* ── Center hub cylinder ── */}
      <mesh material={rim} rotation={cylRot}>
        <cylinderGeometry args={[0.18, 0.18, 1.04, 32]} />
      </mesh>

      {/* Hub caps */}
      <mesh material={hub} position={[0, 0, 0.52]} rotation={cylRot}>
        <cylinderGeometry args={[0.16, 0.16, 0.02, 32]} />
      </mesh>
      <mesh material={hub} position={[0, 0, -0.52]} rotation={cylRot}>
        <cylinderGeometry args={[0.16, 0.16, 0.02, 32]} />
      </mesh>

      {/* Hub center bolt/logo disc */}
      <mesh material={redAccent} position={[0, 0, 0.535]} rotation={cylRot}>
        <cylinderGeometry args={[0.06, 0.06, 0.01, 16]} />
      </mesh>
      <mesh material={redAccent} position={[0, 0, -0.535]} rotation={cylRot}>
        <cylinderGeometry args={[0.06, 0.06, 0.01, 16]} />
      </mesh>
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.55} color="#c8d4ff" />
      <directionalLight position={[3, 5, 4]} intensity={2.4} color="#f5f6ff" />
      <directionalLight position={[-4, -2, -3]} intensity={0.9} color="#3344cc" />
      {/* Red rim backlight */}
      <pointLight position={[0, 0, -4]} intensity={2.2} color="#CC0000" distance={9} />
      {/* Front-right key */}
      <pointLight position={[3, 1, 3]} intensity={1.6} color="#ffffff" distance={8} />
      {/* Front-left fill */}
      <pointLight position={[-3, 0, 2.5]} intensity={1.0} color="#aabfff" distance={7} />
      {/* Side rim lights for silhouette */}
      <pointLight position={[-3, 0, -1.5]} intensity={3.0} color="#e8eeff" distance={9} />
      <pointLight position={[3, 0, -1.5]} intensity={2.4} color="#ddeeff" distance={9} />
    </>
  );
}

export default function TyreScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.4], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      <Lights />
      <Tyre3D />
    </Canvas>
  );
}
