"use client";

import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function TyreMesh({ accentColor }: { accentColor: string }) {
  const groupRef = useRef<THREE.Group>(null!);
  const rot = useRef({ x: 0.32, y: 0.55 });
  const { scene } = useGLTF("/models/wheel.glb");
  const cloned = useMemo(() => scene.clone(true), [scene]);

  // Always show chrome on product cards
  useEffect(() => {
    cloned.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      mats.forEach((mat) => {
        if (!mat) return;
        const n = (mat as THREE.MeshStandardMaterial).name || "";
        if (n === "Spoke_Polished" || n === "Lip_Chrome" || n === "Cap_Chrome") {
          const pm = mat as THREE.MeshPhysicalMaterial;
          pm.color.set("#C8D2E2");
          pm.roughness  = 0.10;
          pm.metalness  = 0.95;
          pm.clearcoat  = 1.0;
          pm.needsUpdate = true;
        }
      });
    });
  }, [cloned, accentColor]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    rot.current.y += delta * 0.30;
    groupRef.current.rotation.x = rot.current.x;
    groupRef.current.rotation.y = rot.current.y;
  });

  return (
    <group ref={groupRef} scale={[0.70, 0.70, 0.70]}>
      <primitive object={cloned} />
    </group>
  );
}

export default function MiniTyre({ accentColor }: { accentColor: string }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 1.6], fov: 32 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
      onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); }}
    >
      <ambientLight intensity={0.55} color="#e8eeff" />
      <directionalLight position={[3, 6, 4]}  intensity={4.0} color="#ffffff" />
      <directionalLight position={[-3, 2, 3]} intensity={0.80} color="#ccd8ff" />
      <directionalLight position={[1, -4, 2]} intensity={0.45} color="#d0d8ff" />
      <pointLight position={[0, 0, -4]}  intensity={1.6} color={accentColor} distance={10} />
      <pointLight position={[-4, 2, 1]}  intensity={2.0} color="#c8d8ff"    distance={12} />
      <pointLight position={[4, 2, 1]}   intensity={1.6} color="#ffffff"    distance={12} />
      <pointLight position={[0, 0, 4]}   intensity={1.8} color="#ffffff"    distance={8} />
      <Environment preset="studio" background={false} />
      <TyreMesh accentColor={accentColor} />
    </Canvas>
  );
}

useGLTF.preload("/models/wheel.glb");
