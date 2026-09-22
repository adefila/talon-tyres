"use client";

import { useRef, useMemo, useEffect, type ReactElement } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface TyreProps {
  accentColor: string;
  rimColor: string;
  rimRoughness: number;
}

function DraggableTyre({ accentColor, rimColor, rimRoughness }: TyreProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const isDragging = useRef(false);
  const prevMouse = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const rotation = useRef({ x: 0.3, z: 0 });
  const { gl } = useThree();

  /* Materials */
  const rubber = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#0c0c10", roughness: 0.95, metalness: 0.02 }),
    []
  );
  const rimMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: rimColor,
        roughness: rimRoughness,
        metalness: rimRoughness < 0.4 ? 0.92 : 0.5,
      }),
    [rimColor, rimRoughness]
  );
  const spokeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: rimColor,
        roughness: rimRoughness + 0.05,
        metalness: rimRoughness < 0.4 ? 0.88 : 0.45,
      }),
    [rimColor, rimRoughness]
  );
  const accentMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: accentColor,
        roughness: 0.4,
        metalness: 0.3,
        emissive: accentColor,
        emissiveIntensity: 0.25,
      }),
    [accentColor]
  );

  /* Tread blocks */
  const treadBlocks = useMemo(() => {
    const blocks: ReactElement[] = [];
    const count = 30;
    const R = 1.44;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      blocks.push(
        <mesh key={`t${i}`} position={[Math.cos(angle) * R, Math.sin(angle) * R, 0]} rotation={[0, 0, angle]} material={rubber}>
          <boxGeometry args={[0.19, 0.30, 0.62]} />
        </mesh>
      );
    }
    return blocks;
  }, [rubber]);

  /* Spokes */
  const spokes = useMemo(() => {
    const arms: ReactElement[] = [];
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      arms.push(
        <group key={i} rotation={[0, 0, angle]}>
          <mesh position={[0, 0.52, 0]} material={spokeMat}>
            <boxGeometry args={[0.10, 0.82, 0.20]} />
          </mesh>
          <mesh position={[0, 0.87, 0]} material={rimMat}>
            <boxGeometry args={[0.16, 0.22, 0.26]} />
          </mesh>
        </group>
      );
    }
    return arms;
  }, [spokeMat, rimMat]);

  /* Pointer drag handlers */
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
      velocity.current = { x: dy * 0.008, y: dx * 0.008 };
      rotation.current.x += dy * 0.008;
      rotation.current.z += dx * 0.008;
      prevMouse.current = { x: e.clientX, y: e.clientY };
    };
    const up = () => {
      isDragging.current = false;
      canvas.style.cursor = "grab";
    };
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
      /* Slow auto-rotate when idle */
      rotation.current.z += delta * 0.18;
      /* Decay velocity */
      velocity.current.x *= 0.94;
      velocity.current.y *= 0.94;
      rotation.current.x += velocity.current.x;
      rotation.current.z += velocity.current.y;
    }
    groupRef.current.rotation.x = rotation.current.x;
    groupRef.current.rotation.z = rotation.current.z;
  });

  const cylRot: [number, number, number] = [Math.PI / 2, 0, 0];

  return (
    <group ref={groupRef}>
      {/* Outer tyre */}
      <mesh material={rubber}>
        <torusGeometry args={[1.44, 0.50, 32, 96]} />
      </mesh>
      {treadBlocks}
      {/* Sidewall */}
      <mesh material={rubber} rotation={cylRot}>
        <cylinderGeometry args={[0.96, 0.96, 1.02, 64, 1, true]} />
      </mesh>
      {/* Accent rings */}
      <mesh material={accentMat} position={[0, 0, 0.50]}>
        <torusGeometry args={[0.955, 0.028, 16, 96]} />
      </mesh>
      <mesh material={accentMat} position={[0, 0, -0.50]}>
        <torusGeometry args={[0.955, 0.028, 16, 96]} />
      </mesh>
      {/* Rim barrel */}
      <mesh material={rimMat} rotation={cylRot}>
        <cylinderGeometry args={[0.92, 0.92, 0.98, 64, 1, false]} />
      </mesh>
      {/* Rim faces */}
      <mesh material={rimMat} position={[0, 0, 0.49]}>
        <torusGeometry args={[0.62, 0.28, 16, 64]} />
      </mesh>
      <mesh material={rimMat} position={[0, 0, -0.49]}>
        <torusGeometry args={[0.62, 0.28, 16, 64]} />
      </mesh>
      {/* Spokes */}
      {spokes}
      {/* Hub */}
      <mesh material={rimMat} rotation={cylRot}>
        <cylinderGeometry args={[0.18, 0.18, 1.04, 32]} />
      </mesh>
      <mesh material={accentMat} position={[0, 0, 0.52]} rotation={cylRot}>
        <cylinderGeometry args={[0.16, 0.16, 0.02, 32]} />
      </mesh>
      <mesh material={accentMat} position={[0, 0, -0.52]} rotation={cylRot}>
        <cylinderGeometry args={[0.16, 0.16, 0.02, 32]} />
      </mesh>
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.55} color="#c8d4ff" />
      <directionalLight position={[4, 6, 5]} intensity={2.4} color="#f5f6ff" />
      <directionalLight position={[-5, -2, -4]} intensity={0.9} color="#2244cc" />
      <pointLight position={[0, 0, -4]} intensity={2.2} color="#CC0000" distance={10} />
      <pointLight position={[3, 1, 3]} intensity={1.6} color="#ffffff" distance={8} />
      <pointLight position={[-3, 0, 2.5]} intensity={1.0} color="#aabfff" distance={7} />
      <pointLight position={[-3.5, 0, -1.5]} intensity={3.0} color="#e8eeff" distance={10} />
      <pointLight position={[3.5, 0, -1.5]} intensity={2.4} color="#ddeeff" distance={10} />
    </>
  );
}

interface Props {
  accentColor: string;
  rimColor: string;
  rimRoughness: number;
}

export default function ConfiguratorScene({ accentColor, rimColor, rimRoughness }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.8], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      <Lights />
      <DraggableTyre accentColor={accentColor} rimColor={rimColor} rimRoughness={rimRoughness} />
    </Canvas>
  );
}
