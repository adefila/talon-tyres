"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface Props {
  rimColor: string;
  rimRoughness: number;
  accentColor: string;
  rotate?: boolean;
  scale?: number;
}

export default function WheelModel({
  rimColor, rimRoughness, accentColor, rotate = true, scale = 1,
}: Props) {
  const groupRef = useRef<THREE.Group>(null!);
  const { scene } = useGLTF("/models/wheel.glb");

  /* Apply runtime colors to the loaded materials */
  scene.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;
    const name: string = obj.name || "";
    const mat = obj.material as THREE.MeshStandardMaterial;
    if (!mat) return;

    if (name.startsWith("Spoke_Face") || name === "Rim_Lip") {
      (obj.material as THREE.MeshPhysicalMaterial).color.set(rimColor);
      (obj.material as THREE.MeshPhysicalMaterial).roughness = Math.max(rimRoughness, 0.06);
    }
    if (name.startsWith("Hub_Cap")) {
      mat.color.set(rimRoughness < 0.30 ? "#C8CCD8" : rimColor);
    }
    if (name.includes("sw") || name.includes("accent")) {
      mat.color.set(accentColor);
      mat.emissive = new THREE.Color(accentColor);
      mat.emissiveIntensity = 0.4;
    }
  });

  useFrame((_, delta) => {
    if (rotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      <primitive object={scene.clone(true)} />
    </group>
  );
}

useGLTF.preload("/models/wheel.glb");
