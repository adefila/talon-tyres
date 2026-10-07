"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import TalonTyreModel, { type TalonTyreModelProps } from "./TalonTyreModel";

interface Props extends TalonTyreModelProps {
  /** Increment to snap the camera back to the default angle */
  resetKey: number;
}

const DEFAULT_CAMERA: [number, number, number] = [0.74, 0.17, 1.22];

export default function TyreViewerScene({ resetKey, ...model }: Props) {
  const controls = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    if (resetKey > 0) controls.current?.reset();
  }, [resetKey]);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: DEFAULT_CAMERA, fov: 34, near: 0.05, far: 20 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%", background: "transparent", touchAction: "none" }}
    >
      <ambientLight intensity={0.25} />
      <directionalLight position={[2, 3, 2.5]} intensity={1.6} castShadow />
      <directionalLight position={[-2.5, 1, -2]} intensity={0.8} color="#c8d4ff" />

      <Suspense fallback={null}>
        <TalonTyreModel {...model} />
        <Environment preset="studio" background={false} />
      </Suspense>

      <ContactShadows position={[0, -0.33, 0]} opacity={0.55} scale={2} blur={2.4} far={0.8} />

      <OrbitControls
        ref={controls}
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={0.7}
        maxDistance={2.2}
        minPolarAngle={Math.PI * 0.15}
        maxPolarAngle={Math.PI * 0.6}
      />
    </Canvas>
  );
}
