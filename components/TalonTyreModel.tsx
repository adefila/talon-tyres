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
  └─ Rim   : Rim_Barrel, Rim_Lip, Spoke_Face, Hub, Hub_Cap, Lug_Nuts
  The rim is open at the back like a real alloy (no brake hardware).
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

  /* Named groups we animate (kept in refs so useFrame can move them) */
  const wheelRef = useRef<THREE.Object3D | null>(null);
  const rimRef = useRef<THREE.Object3D | null>(null);
  const tyreRef = useRef<THREE.Object3D | null>(null);
  useEffect(() => {
    wheelRef.current = model.getObjectByName("TalonWheel") ?? model;
    rimRef.current = model.getObjectByName("Rim") ?? null;
    tyreRef.current = model.getObjectByName("Tyre") ?? null;
  }, [model]);

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
    if (spinning && wheelRef.current) wheelRef.current.rotation.z -= dt * 1.6;

    /* Ease the exploded view in/out */
    explode.current = THREE.MathUtils.damp(explode.current, exploded ? 1 : 0, 6, dt);
    if (rimRef.current) rimRef.current.position.z = explode.current * 0.16;
    if (tyreRef.current) tyreRef.current.position.z = explode.current * -0.1;
  });

  return <primitive object={model} />;
}

useGLTF.preload(MODEL_URL);
