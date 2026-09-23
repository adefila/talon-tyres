"use client";

import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface TyreProps {
  accentColor: string;
  rimColor: string;
  rimRoughness: number;
  selectedSize?: string;
}

function parseSize(s: string) {
  const m = s.match(/(\d+)\/(\d+)\s*R(\d+)/);
  return m ? { aspect: parseInt(m[2]) } : { aspect: 45 };
}
function getSizeScale(s: string) {
  const { aspect } = parseSize(s);
  if (aspect <= 35) return 0.88;
  if (aspect <= 42) return 0.94;
  if (aspect <= 50) return 1.00;
  if (aspect <= 60) return 1.07;
  return 1.13;
}

function WheelGLB({ rimColor, rimRoughness, accentColor }: Omit<TyreProps, "selectedSize">) {
  const { scene } = useGLTF("/models/wheel.glb");

  const cloned = useMemo(() => scene.clone(true), [scene]);

  // Apply runtime colors whenever props change
  useEffect(() => {
    const rimCol   = new THREE.Color(rimColor);
    const accentCol = new THREE.Color(accentColor);
    const clearcoat = rimRoughness < 0.20 ? 1.0 : rimRoughness < 0.45 ? 0.55 : 0.10;
    const metallic  = rimRoughness < 0.45 ? 0.94 : 0.65;
    const roughness = Math.max(rimRoughness, 0.06);

    cloned.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      mats.forEach((mat) => {
        if (!mat) return;
        const m = mat as THREE.MeshStandardMaterial;
        const n = m.name || "";

        if (n === "Spoke_Polished" || n === "Lip_Chrome") {
          const pm = mat as THREE.MeshPhysicalMaterial;
          pm.color.copy(rimCol);
          pm.roughness  = roughness;
          pm.metalness  = metallic;
          pm.clearcoat  = clearcoat;
          pm.needsUpdate = true;
        }
        if (n === "Cap_Chrome") {
          const pm = mat as THREE.MeshPhysicalMaterial;
          pm.color.set(rimRoughness < 0.35 ? "#C8CCD8" : rimColor);
          pm.needsUpdate = true;
        }
      });
    });
  }, [cloned, rimColor, rimRoughness, accentColor]);

  return <primitive object={cloned} />;
}

function DraggableWheel({ accentColor, rimColor, rimRoughness, selectedSize = "245/45 R19" }: TyreProps) {
  const groupRef   = useRef<THREE.Group>(null!);
  const isDragging = useRef(false);
  const prevMouse  = useRef({ x: 0, y: 0 });
  const velocity   = useRef({ x: 0, y: 0 });
  const rot        = useRef({ x: 0.32, y: 0.55 });
  const { gl }     = useThree();
  const scale      = getSizeScale(selectedSize);

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
      velocity.current = { x: dy * 0.009, y: dx * 0.009 };
      rot.current.x += dy * 0.009;
      rot.current.y += dx * 0.009;
      prevMouse.current = { x: e.clientX, y: e.clientY };
    };
    const up = () => { isDragging.current = false; canvas.style.cursor = "grab"; };
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
      rot.current.y += delta * 0.26;
      velocity.current.x *= 0.92;
      velocity.current.y *= 0.92;
      rot.current.x += velocity.current.x;
      rot.current.y += velocity.current.y;
    }
    groupRef.current.rotation.x = rot.current.x;
    groupRef.current.rotation.y = rot.current.y;
    groupRef.current.rotation.z = 0;
  });

  return (
    <group ref={groupRef} scale={[scale, scale, scale]}>
      <WheelGLB rimColor={rimColor} rimRoughness={rimRoughness} accentColor={accentColor} />
    </group>
  );
}

export default function ConfiguratorScene({ accentColor, rimColor, rimRoughness, selectedSize }: TyreProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 1.8], fov: 34 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
      onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); }}
    >
      <ambientLight intensity={0.30} color="#eef0ff" />
      <directionalLight position={[3, 6, 4]}  intensity={3.5} color="#ffffff" />
      <directionalLight position={[-3, 2, 3]} intensity={0.60} color="#d4e0ff" />
      <directionalLight position={[0, -4, 2]} intensity={0.25} color="#c8d4ff" />
      <pointLight position={[0, 0, -5]}  intensity={2.5} color={accentColor} distance={12} />
      <pointLight position={[-5, 1, 0]}  intensity={1.5} color="#b8ccff"     distance={10} />
      <pointLight position={[5, 1, 0]}   intensity={1.2} color="#ffffff"     distance={10} />
      <pointLight position={[1, 3, 5]}   intensity={1.8} color="#ffffff"     distance={10} />
      <Environment preset="studio" background={false} />
      <DraggableWheel
        accentColor={accentColor}
        rimColor={rimColor}
        rimRoughness={rimRoughness}
        selectedSize={selectedSize}
      />
    </Canvas>
  );
}

useGLTF.preload("/models/wheel.glb");
