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
  const rot = useRef({ x: 0.42, y: 0.0 });
  const { gl } = useThree();

  /* ── Materials ── */
  const rubber = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#1e1e2e", roughness: 0.88, metalness: 0.04,
    emissive: "#090910", emissiveIntensity: 0.10,
  }), []);

  const grooveMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#05050c", roughness: 0.99, metalness: 0,
  }), []);

  const rimMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: rimColor, roughness: rimRoughness,
    metalness: rimRoughness < 0.4 ? 0.94 : 0.52, envMapIntensity: 1.2,
  }), [rimColor, rimRoughness]);

  const spokeMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: rimColor,
    roughness: Math.max(rimRoughness - 0.05, 0.08),
    metalness: rimRoughness < 0.4 ? 0.92 : 0.48,
  }), [rimColor, rimRoughness]);

  const accentMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: accentColor, roughness: 0.35, metalness: 0.35,
    emissive: accentColor, emissiveIntensity: 0.55,
  }), [accentColor]);

  const lugMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#040408", roughness: 0.97, metalness: 0.05,
  }), []);

  /* ── Realistic car tyre profile (LatheGeometry, revolves around Y) ──
     Points: (radius, height) — rotated 90° around X so axle points in Z  */
  const tyreProfile = useMemo<THREE.Vector2[]>(() => [
    new THREE.Vector2(0.97, -0.48),  // bead seat
    new THREE.Vector2(0.98, -0.43),  // bead lip
    new THREE.Vector2(1.04, -0.43),  // sidewall base
    new THREE.Vector2(1.10, -0.46),  // sidewall slight bulge
    new THREE.Vector2(1.32, -0.45),  // mid sidewall sweeping outward
    new THREE.Vector2(1.43, -0.40),  // shoulder
    new THREE.Vector2(1.47, -0.32),  // tread edge
    new THREE.Vector2(1.48, -0.16),  // tread inner
    new THREE.Vector2(1.48,  0.00),  // tread center
    new THREE.Vector2(1.48,  0.16),  // tread inner
    new THREE.Vector2(1.47,  0.32),  // tread edge
    new THREE.Vector2(1.43,  0.40),  // shoulder
    new THREE.Vector2(1.32,  0.45),  // mid sidewall
    new THREE.Vector2(1.10,  0.46),  // sidewall slight bulge
    new THREE.Vector2(1.04,  0.43),  // sidewall base
    new THREE.Vector2(0.98,  0.43),  // bead lip
    new THREE.Vector2(0.97,  0.48),  // bead seat
  ], []);

  /* ── 4 circumferential tread grooves on flat tread ── */
  const treadGrooves = useMemo<ReactElement[]>(() => {
    const grooveZ = [-0.24, -0.08, 0.08, 0.24];
    return grooveZ.map((z, i) => (
      <mesh key={i} position={[0, 0, z]} material={grooveMat}>
        <torusGeometry args={[1.472, 0.032, 8, 96]} />
      </mesh>
    ));
  }, [grooveMat]);

  /* ── 5 Spokes ── */
  const spokes = useMemo<ReactElement[]>(() =>
    Array.from({ length: 5 }).map((_, i) => {
      const angle = (i / 5) * Math.PI * 2;
      return (
        <group key={i} rotation={[0, 0, angle]}>
          <mesh position={[0, 0.52, 0]} material={spokeMat}>
            <boxGeometry args={[0.11, 0.82, 0.22]} />
          </mesh>
          <mesh position={[0, 0.88, 0]} material={rimMat}>
            <boxGeometry args={[0.17, 0.24, 0.28]} />
          </mesh>
          <mesh position={[0, 0.25, 0]} material={spokeMat}>
            <boxGeometry args={[0.08, 0.22, 0.18]} />
          </mesh>
        </group>
      );
    }), [spokeMat, rimMat]);

  /* ── Lug bolt holes (5 per face) ── */
  const lugHoles = useMemo<ReactElement[]>(() => {
    const holes: ReactElement[] = [];
    const lugR = 0.68;
    const cylRot: [number, number, number] = [Math.PI / 2, 0, 0];
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      const x = Math.cos(a) * lugR;
      const y = Math.sin(a) * lugR;
      holes.push(
        <mesh key={`lf${i}`} position={[x, y, 0.525]} rotation={cylRot} material={lugMat}>
          <cylinderGeometry args={[0.062, 0.062, 0.05, 12]} />
        </mesh>,
        <mesh key={`lb${i}`} position={[x, y, -0.525]} rotation={cylRot} material={lugMat}>
          <cylinderGeometry args={[0.062, 0.062, 0.05, 12]} />
        </mesh>
      );
    }
    return holes;
  }, [lugMat]);

  /* ── Drag handlers ── */
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
      rot.current.y += delta * 0.28;
      velocity.current.x *= 0.92;
      velocity.current.y *= 0.92;
      rot.current.x += velocity.current.x;
      rot.current.y += velocity.current.y;
    }
    groupRef.current.rotation.x = rot.current.x;
    groupRef.current.rotation.y = rot.current.y;
    groupRef.current.rotation.z = 0;
  });

  const cylRot: [number, number, number] = [Math.PI / 2, 0, 0];

  return (
    <group ref={groupRef} scale={[0.80, 0.80, 0.80]}>

      {/* ── Tyre body: LatheGeometry for realistic car tyre profile ── */}
      <mesh material={rubber} rotation={cylRot}>
        <latheGeometry args={[tyreProfile, 96]} />
      </mesh>

      {/* Circumferential tread grooves */}
      {treadGrooves}

      {/* Accent stripe on sidewall (colour ring near bead) */}
      <mesh material={accentMat} position={[0, 0, 0.46]}>
        <torusGeometry args={[1.02, 0.028, 16, 96]} />
      </mesh>
      <mesh material={accentMat} position={[0, 0, -0.46]}>
        <torusGeometry args={[1.02, 0.028, 16, 96]} />
      </mesh>
      {/* Thin inner accent ring */}
      <mesh material={accentMat} position={[0, 0, 0.46]}>
        <torusGeometry args={[0.72, 0.012, 12, 96]} />
      </mesh>
      <mesh material={accentMat} position={[0, 0, -0.46]}>
        <torusGeometry args={[0.72, 0.012, 12, 96]} />
      </mesh>

      {/* Rim barrel */}
      <mesh material={rimMat} rotation={cylRot}>
        <cylinderGeometry args={[0.93, 0.93, 0.94, 64, 1, false]} />
      </mesh>
      {/* Rim face rings */}
      <mesh material={rimMat} position={[0, 0, 0.47]}>
        <torusGeometry args={[0.62, 0.28, 16, 64]} />
      </mesh>
      <mesh material={rimMat} position={[0, 0, -0.47]}>
        <torusGeometry args={[0.62, 0.28, 16, 64]} />
      </mesh>

      {/* Spokes */}
      {spokes}

      {/* Lug bolt holes */}
      {lugHoles}

      {/* Hub cylinder */}
      <mesh material={rimMat} rotation={cylRot}>
        <cylinderGeometry args={[0.18, 0.18, 1.00, 32]} />
      </mesh>
      {/* Hub caps */}
      <mesh material={accentMat} position={[0, 0, 0.50]} rotation={cylRot}>
        <cylinderGeometry args={[0.17, 0.17, 0.02, 32]} />
      </mesh>
      <mesh material={accentMat} position={[0, 0, -0.50]} rotation={cylRot}>
        <cylinderGeometry args={[0.17, 0.17, 0.02, 32]} />
      </mesh>
      <mesh material={accentMat} position={[0, 0, 0.515]} rotation={cylRot}>
        <cylinderGeometry args={[0.07, 0.07, 0.01, 16]} />
      </mesh>
      <mesh material={accentMat} position={[0, 0, -0.515]} rotation={cylRot}>
        <cylinderGeometry args={[0.07, 0.07, 0.01, 16]} />
      </mesh>
    </group>
  );
}

function Lights({ accentColor }: { accentColor: string }) {
  return (
    <>
      <ambientLight intensity={0.28} color="#eef0ff" />
      <directionalLight position={[5, 8, 6]} intensity={3.5} color="#ffffff" />
      <directionalLight position={[-5, 2, 4]} intensity={0.8} color="#d0e0ff" />
      <directionalLight position={[1, -4, 3]} intensity={0.45} color="#c8d8ff" />
      <pointLight position={[0, 0, -7]} intensity={3.5} color={accentColor} distance={16} />
      <pointLight position={[-7, 1, 0]} intensity={2.0} color="#b8ccff" distance={14} />
      <pointLight position={[7, 1, 0]} intensity={1.5} color="#ffffff" distance={14} />
      <pointLight position={[0, 6, 5]} intensity={1.2} color="#ffffff" distance={14} />
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
      camera={{ position: [0, 0, 6.5], fov: 34 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
      onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); }}
    >
      <Lights accentColor={accentColor} />
      <DraggableTyre accentColor={accentColor} rimColor={rimColor} rimRoughness={rimRoughness} />
    </Canvas>
  );
}
