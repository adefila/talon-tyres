"use client";

import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const FRONT_X = 1.24;
const REAR_X  = -1.18;
const AXLE_Y  = 0.50;

/* ── Wheel (from Blender GLB) ── */
function WheelGLB({
  rimColor, rimRoughness, accentColor,
}: {
  rimColor: string; rimRoughness: number; accentColor: string;
}) {
  const { scene } = useGLTF("/models/wheel.glb");
  const cloned = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    const rimCol    = new THREE.Color(rimColor);
    const clearcoat = rimRoughness < 0.20 ? 1.0 : rimRoughness < 0.45 ? 0.55 : 0.10;
    const metallic  = rimRoughness < 0.45 ? 0.94 : 0.65;
    const roughness = Math.max(rimRoughness, 0.06);

    cloned.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      mats.forEach((mat) => {
        if (!mat) return;
        const n = (mat as THREE.MeshStandardMaterial).name || "";
        if (n === "Spoke_Polished" || n === "Lip_Chrome") {
          const pm = mat as THREE.MeshPhysicalMaterial;
          pm.color.copy(rimCol);
          pm.roughness = roughness;
          pm.metalness = metallic;
          pm.clearcoat = clearcoat;
          pm.needsUpdate = true;
        }
      });
    });
  }, [cloned, rimColor, rimRoughness]);

  return <primitive object={cloned} />;
}

function RotatingWheel({
  rimColor, rimRoughness, accentColor, scale = 1,
}: {
  rimColor: string; rimRoughness: number; accentColor: string; scale?: number;
}) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z -= delta * 1.2;
  });
  return (
    <group ref={ref} scale={[scale, scale, scale]}>
      <WheelGLB rimColor={rimColor} rimRoughness={rimRoughness} accentColor={accentColor} />
    </group>
  );
}

/* ── Car body (from Blender GLB) ── */
function CarGLB({ accentColor }: { accentColor: string }) {
  const { scene } = useGLTF("/models/car.glb");
  const cloned = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    const accentCol = new THREE.Color(accentColor);
    cloned.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      mats.forEach((mat) => {
        const m = mat as THREE.MeshStandardMaterial;
        const n = m?.name || "";
        if (n === "Taillight") {
          m.color.copy(accentCol);
          (m as THREE.MeshPhysicalMaterial).emissiveFactor = accentCol.toArray() as unknown as THREE.Color;
          m.needsUpdate = true;
        }
      });
    });
  }, [cloned, accentColor]);

  return <primitive object={cloned} />;
}

/* ── Full scene ── */
function Scene({
  accentColor, rimColor, rimRoughness,
}: {
  accentColor: string; rimColor: string; rimRoughness: number;
}) {
  // Wheel scale: the Blender wheel radius is ~0.481 world units
  // We need it to sit at AXLE_Y = 0.50 with a real-world radius ~0.37
  const wScale = 0.37 / 0.481;

  return (
    <>
      {/* Car body (Blender Y=up, Three.js Y=up — should align) */}
      <CarGLB accentColor={accentColor} />

      {/* Right-side wheels */}
      {([FRONT_X, REAR_X] as number[]).map((x, i) => (
        <group key={`rw-${i}`} position={[x, AXLE_Y, 0.91]}>
          <RotatingWheel
            rimColor={rimColor} rimRoughness={rimRoughness}
            accentColor={accentColor} scale={wScale}
          />
        </group>
      ))}

      {/* Left-side wheels (flipped) */}
      {([FRONT_X, REAR_X] as number[]).map((x, i) => (
        <group key={`lw-${i}`} position={[x, AXLE_Y, -0.91]} rotation={[0, Math.PI, 0]}>
          <RotatingWheel
            rimColor={rimColor} rimRoughness={rimRoughness}
            accentColor={accentColor} scale={wScale}
          />
        </group>
      ))}

      <ContactShadows position={[0, 0.001, 0]} opacity={0.55} width={12} height={6} blur={2.2} far={2.0} />
    </>
  );
}

interface Props {
  accentColor: string;
  rimColor: string;
  rimRoughness: number;
  tyreName?: string;
  rimLabel?: string;
  size?: string;
}

export default function CarScene({ accentColor, rimColor, rimRoughness }: Props) {
  return (
    <div className="relative w-full h-full" style={{ background: "#ECEDF4" }}>
      <Canvas
        shadows
        camera={{ position: [4.2, 2.2, 5.5], fov: 38 }}
        gl={{ antialias: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <color attach="background" args={["#ECEDF4"]} />
        <ambientLight intensity={0.55} color="#eef0ff" />
        <directionalLight
          position={[8, 14, 8]} intensity={2.8} color="#ffffff"
          castShadow shadow-mapSize={[1024, 1024]}
          shadow-camera-left={-8} shadow-camera-right={8}
          shadow-camera-top={5} shadow-camera-bottom={-1}
        />
        <directionalLight position={[-6, 6, 5]} intensity={0.70} color="#d4e0ff" />
        <directionalLight position={[0, 3, -7]} intensity={0.28} color="#c8d8ff" />
        <pointLight position={[0, 6, 0]} intensity={1.2} color="#ffffff" distance={18} />
        <Environment preset="studio" background={false} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[30, 20]} />
          <meshStandardMaterial color="#E8E9F0" roughness={0.96} metalness={0.0} />
        </mesh>
        <Scene accentColor={accentColor} rimColor={rimColor} rimRoughness={rimRoughness} />
        <OrbitControls
          target={[0, 0.8, 0]}
          autoRotate autoRotateSpeed={0.32}
          enableDamping dampingFactor={0.06}
          minPolarAngle={Math.PI / 10} maxPolarAngle={Math.PI / 2.3}
          minDistance={4.0} maxDistance={12}
        />
      </Canvas>
      <div className="absolute top-4 left-4 text-[9px] font-bold tracking-[0.22em] uppercase text-[#9CA3AF] flex items-center gap-2 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        3D Preview · Drag to Rotate
      </div>
    </div>
  );
}

useGLTF.preload("/models/wheel.glb");
useGLTF.preload("/models/car.glb");
