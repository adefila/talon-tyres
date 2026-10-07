"use client";

import { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import TalonTyreModel from "./TalonTyreModel";

interface TyreProps {
  accentColor: string;
  rimColor: string;
  rimRoughness: number;
  selectedSize?: string;
}

/* The Blender-built Talon tyre (0.3175 m radius) is scaled up to the
   0.45 radius this camera framing was designed around. */
const MODEL_SCALE = 0.45 / 0.3175;

// ── Size scale ───────────────────────────────────────────────────
function getSizeScale(s = "245/45 R19") {
  const m = s.match(/(\d+)\/(\d+)/);
  if (!m) return 1.0;
  const asp = parseInt(m[2]);
  if (asp <= 35) return 0.88;
  if (asp <= 42) return 0.94;
  if (asp <= 50) return 1.00;
  if (asp <= 60) return 1.07;
  return 1.13;
}

// ── Draggable + auto-rotating wrapper ───────────────────────────
function DraggableWheel({ rimColor, rimRoughness, accentColor, selectedSize = "245/45 R19" }: TyreProps) {
  const groupRef   = useRef<THREE.Group>(null!);
  const isDragging = useRef(false);
  const prevMouse  = useRef({ x: 0, y: 0 });
  const velocity   = useRef({ x: 0, y: 0 });
  const rot        = useRef({ x: 0.30, y: 0.52 });
  const { gl }     = useThree();
  const scale      = getSizeScale(selectedSize);

  useEffect(() => {
    const canvas = gl.domElement;
    const down = (e: PointerEvent) => {
      isDragging.current = true;
      prevMouse.current  = { x: e.clientX, y: e.clientY };
      velocity.current   = { x: 0, y: 0 };
      canvas.style.cursor = "grabbing";
    };
    const move = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - prevMouse.current.x;
      const dy = e.clientY - prevMouse.current.y;
      velocity.current  = { x: dy * 0.009, y: dx * 0.009 };
      rot.current.x    += dy * 0.009;
      rot.current.y    += dx * 0.009;
      prevMouse.current = { x: e.clientX, y: e.clientY };
    };
    const up = () => { isDragging.current = false; canvas.style.cursor = "grab"; };
    canvas.style.cursor = "grab";
    canvas.addEventListener("pointerdown", down);
    window.addEventListener("pointermove",  move);
    window.addEventListener("pointerup",    up);
    return () => {
      canvas.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove",  move);
      window.removeEventListener("pointerup",    up);
    };
  }, [gl]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (!isDragging.current) {
      rot.current.y    += delta * 0.20;
      velocity.current.x *= 0.92;
      velocity.current.y *= 0.92;
      rot.current.x    += velocity.current.x;
      rot.current.y    += velocity.current.y;
    }
    groupRef.current.rotation.x = rot.current.x;
    groupRef.current.rotation.y = rot.current.y;
    groupRef.current.rotation.z = 0;
  });

  return (
    <group ref={groupRef} scale={[scale, scale, scale]}>
      <group scale={MODEL_SCALE}>
        <TalonTyreModel
          rimColor={rimColor}
          rimRoughness={rimRoughness}
          accentColor={accentColor}
          spinning={false}
          exploded={false}
        />
      </group>
    </group>
  );
}

// ── Exported scene ───────────────────────────────────────────────
export default function ConfiguratorScene({ accentColor, rimColor, rimRoughness, selectedSize }: TyreProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 1.80], fov: 34 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <ambientLight intensity={0.22} color="#eef0ff" />
      <directionalLight position={[3, 6, 4]}   intensity={3.4} color="#ffffff" />
      <directionalLight position={[-3, -2, 3]}  intensity={0.55} color="#d4e0ff" />
      <pointLight position={[-5, 1, -1]}  intensity={2.4} color="#c8d8ff" distance={12} />
      <pointLight position={[ 5, 1, -1]}  intensity={2.0} color="#ffffff"  distance={12} />
      <pointLight position={[0, 0, -5]}   intensity={3.2} color={accentColor} distance={14} />
      <pointLight position={[1, 4, 4]}    intensity={1.8} color="#ffffff"  distance={11} />
      <Environment preset="studio" background={false} />
      <Suspense fallback={null}>
        <DraggableWheel
          accentColor={accentColor}
          rimColor={rimColor}
          rimRoughness={rimRoughness}
          selectedSize={selectedSize}
        />
      </Suspense>
    </Canvas>
  );
}
