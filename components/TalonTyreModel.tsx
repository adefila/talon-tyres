"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = "/models/talon-tyre.glb";

export interface TalonTyreModelProps {
  rimColor: string;
  rimRoughness: number;
  accentColor: string;
  spinning: boolean;
  exploded: boolean;
}

/*
  talon-tyre.glb (built in Blender — source: scripts/talon-tyre.blend)
  TalonWheel
  ├─ Tyre  : Tyre_Body, Tyre_Tread, Sidewall_Text, Sidewall_Accent
  ├─ Rim   : Rim_Barrel, Rim_Lip, Spoke_Face, Hub, Hub_Cap, Lug_Nuts
  └─ Brake : Brake_Disc, Caliper_accent
  The wheel face points toward +Z and the axle runs along Z.
*/
export default function TalonTyreModel({
  rimColor,
  rimRoughness,
  accentColor,
  spinning,
  exploded,
}: TalonTyreModelProps) {
  const { scene } = useGLTF(MODEL_URL);

  /* Clone so each instance owns its materials (safe to recolour) */
  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.material = (obj.material as THREE.Material).clone();
        obj.castShadow = true;
        obj.receiveShadow = true;
        /* Keep rubber deep black under the bright studio environment */
        const m = obj.material as THREE.MeshStandardMaterial;
        if (m.name.startsWith("Tyre_")) m.envMapIntensity = 0.45;
      }
    });
    return clone;
  }, [scene]);

  const parts = useMemo(
    () => ({
      wheel: model.getObjectByName("TalonWheel") ?? model,
      rim: model.getObjectByName("Rim"),
      brake: model.getObjectByName("Brake"),
    }),
    [model]
  );

  /* Live colours */
  useEffect(() => {
    model.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      const mat = obj.material as THREE.MeshStandardMaterial;
      if (mat.name === "Rim_Alloy") {
        mat.color.set(rimColor);
        mat.roughness = Math.max(rimRoughness, 0.06);
        mat.metalness = 1;
      }
      if (mat.name === "Accent") {
        mat.color.set(accentColor);
        mat.emissive.set(accentColor);
        mat.emissiveIntensity = 0.25;
      }
      mat.needsUpdate = true;
    });
  }, [model, rimColor, rimRoughness, accentColor]);

  const explode = useRef(0);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    if (spinning) parts.wheel.rotation.z -= dt * 1.6;

    /* Ease the exploded view in/out */
    explode.current = THREE.MathUtils.damp(explode.current, exploded ? 1 : 0, 6, dt);
    if (parts.rim) parts.rim.position.z = explode.current * 0.22;
    if (parts.brake) parts.brake.position.z = explode.current * -0.2;
  });

  return <primitive object={model} />;
}

useGLTF.preload(MODEL_URL);
