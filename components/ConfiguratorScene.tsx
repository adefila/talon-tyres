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
    color: "#0c0c12",
    roughness: 0.92,
    metalness: 0.0,
    emissive: "#050508",
    emissiveIntensity: 0.05,
  }), []);

  const grooveMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#040406",
    roughness: 0.99,
    metalness: 0,
  }), []);

  // Dark painted rim body (barrel, hub, background)
  const rimBodyMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#18181f",
    roughness: 0.28,
    metalness: 0.82,
  }), []);

  // Machined/polished spoke faces (user-selectable finish)
  const spokeMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: rimColor,
    roughness: rimRoughness,
    metalness: rimRoughness < 0.4 ? 0.94 : 0.55,
    envMapIntensity: 1.2,
  }), [rimColor, rimRoughness]);

  const accentMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: accentColor,
    roughness: 0.40,
    metalness: 0.30,
    emissive: accentColor,
    emissiveIntensity: 0.50,
  }), [accentColor]);

  const lugMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#2a2a38",
    roughness: 0.45,
    metalness: 0.80,
  }), []);

  /* ── Tyre profile: realistic car tyre cross-section
     Revolves around Y; mesh is rotated [Math.PI/2,0,0] so axle = Z.
     Points: (radius, halfWidth)  ── */
  const tyreProfile = useMemo<THREE.Vector2[]>(() => [
    new THREE.Vector2(0.955, -0.495),  // bead seat inner lip
    new THREE.Vector2(0.970, -0.440),  // bead seat outer
    new THREE.Vector2(1.020, -0.430),  // sidewall base
    new THREE.Vector2(1.090, -0.460),  // lower sidewall subtle bulge
    new THREE.Vector2(1.200, -0.470),  // mid-lower sidewall
    new THREE.Vector2(1.330, -0.465),  // mid sidewall (max bulge)
    new THREE.Vector2(1.420, -0.430),  // upper sidewall taper
    new THREE.Vector2(1.460, -0.360),  // shoulder lead-in
    new THREE.Vector2(1.475, -0.260),  // shoulder
    new THREE.Vector2(1.482, -0.140),  // outer tread edge
    new THREE.Vector2(1.484, -0.040),  // tread flat
    new THREE.Vector2(1.484,  0.000),  // tread centre
    new THREE.Vector2(1.484,  0.040),  // tread flat
    new THREE.Vector2(1.482,  0.140),  // outer tread edge
    new THREE.Vector2(1.475,  0.260),  // shoulder
    new THREE.Vector2(1.460,  0.360),  // shoulder lead-in
    new THREE.Vector2(1.420,  0.430),  // upper sidewall taper
    new THREE.Vector2(1.330,  0.465),  // mid sidewall
    new THREE.Vector2(1.200,  0.470),  // mid-lower sidewall
    new THREE.Vector2(1.090,  0.460),  // lower sidewall bulge
    new THREE.Vector2(1.020,  0.430),  // sidewall base
    new THREE.Vector2(0.970,  0.440),  // bead seat outer
    new THREE.Vector2(0.955,  0.495),  // bead seat inner lip
  ], []);

  /* ── 5 circumferential tread grooves (matching reference image) ── */
  const treadGrooves = useMemo<ReactElement[]>(() => {
    const grooveZ = [-0.30, -0.14, 0.00, 0.14, 0.30];
    return grooveZ.map((z, i) => (
      <mesh key={i} position={[0, 0, z]} material={grooveMat}>
        <torusGeometry args={[1.473, 0.034, 10, 96]} />
      </mesh>
    ));
  }, [grooveMat]);

  /* ── 10 spokes in 5 Y-pairs — BMW/luxury multi-spoke style ──
     Each pair has two slim spokes ±offset from pair centre.
     Spokes are boxes in the XY plane of the group (which is the wheel face). */
  const spokes = useMemo<ReactElement[]>(() => {
    const out: ReactElement[] = [];
    const PAIRS = 5;
    const OFFSET = 0.105; // radians between twins in a pair

    for (let i = 0; i < PAIRS; i++) {
      const baseAngle = (i / PAIRS) * Math.PI * 2;

      for (const sideOffset of [-OFFSET, OFFSET]) {
        const a = baseAngle + sideOffset;
        out.push(
          <group key={`s-${i}-${sideOffset}`} rotation={[0, 0, a]}>
            {/* Slim inner spoke body */}
            <mesh position={[0, 0.50, 0]} material={spokeMat}>
              <boxGeometry args={[0.082, 0.68, 0.195]} />
            </mesh>
            {/* Wider outer connector near rim barrel */}
            <mesh position={[0, 0.865, 0]} material={spokeMat}>
              <boxGeometry args={[0.130, 0.185, 0.240]} />
            </mesh>
            {/* Tapered inner end near hub */}
            <mesh position={[0, 0.255, 0]} material={spokeMat}>
              <boxGeometry args={[0.068, 0.175, 0.160]} />
            </mesh>
          </group>
        );
      }
    }
    return out;
  }, [spokeMat]);

  /* ── 5 lug bolts per face ── */
  const lugBolts = useMemo<ReactElement[]>(() => {
    const bolts: ReactElement[] = [];
    const LUG_R = 0.660;
    const cylRot: [number, number, number] = [Math.PI / 2, 0, 0];
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      const x = Math.cos(a) * LUG_R;
      const y = Math.sin(a) * LUG_R;
      for (const z of [0.505, -0.505]) {
        bolts.push(
          <mesh key={`lug-${i}-${z}`} position={[x, y, z]} rotation={cylRot} material={lugMat}>
            <cylinderGeometry args={[0.058, 0.058, 0.06, 10]} />
          </mesh>
        );
      }
    }
    return bolts;
  }, [lugMat]);

  /* ── Drag interaction ── */
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

      {/* ── Tyre body ── */}
      <mesh material={rubber} rotation={cylRot}>
        <latheGeometry args={[tyreProfile, 96]} />
      </mesh>

      {/* Circumferential tread grooves (5 grooves = 4 central ribs + 2 shoulder) */}
      {treadGrooves}

      {/* Sidewall accent rings */}
      <mesh material={accentMat} position={[0, 0, 0.475]}>
        <torusGeometry args={[1.025, 0.022, 14, 96]} />
      </mesh>
      <mesh material={accentMat} position={[0, 0, -0.475]}>
        <torusGeometry args={[1.025, 0.022, 14, 96]} />
      </mesh>

      {/* ── Rim barrel (dark painted, open cylinder) ── */}
      <mesh material={rimBodyMat} rotation={cylRot}>
        <cylinderGeometry args={[0.948, 0.948, 0.945, 64, 1, true]} />
      </mesh>

      {/* Rim barrel inner lip (thickens the edge) */}
      <mesh material={rimBodyMat} position={[0, 0, 0.470]} rotation={cylRot}>
        <cylinderGeometry args={[0.960, 0.935, 0.025, 64]} />
      </mesh>
      <mesh material={rimBodyMat} position={[0, 0, -0.470]} rotation={cylRot}>
        <cylinderGeometry args={[0.960, 0.935, 0.025, 64]} />
      </mesh>

      {/* Dark rim face background disc (behind spokes) */}
      <mesh material={rimBodyMat} position={[0, 0, 0.460]} rotation={cylRot}>
        <cylinderGeometry args={[0.930, 0.180, 0.010, 64]} />
      </mesh>
      <mesh material={rimBodyMat} position={[0, 0, -0.460]} rotation={cylRot}>
        <cylinderGeometry args={[0.930, 0.180, 0.010, 64]} />
      </mesh>

      {/* ── 10 machined spokes (5 Y-pairs) ── */}
      {spokes}

      {/* ── Lug bolts (5 per face) ── */}
      {lugBolts}

      {/* Hub cylinder (dark) */}
      <mesh material={rimBodyMat} rotation={cylRot}>
        <cylinderGeometry args={[0.190, 0.190, 1.02, 36]} />
      </mesh>

      {/* Hub caps — flat discs (accent brand colour) */}
      <mesh material={accentMat} position={[0, 0, 0.515]} rotation={cylRot}>
        <cylinderGeometry args={[0.165, 0.165, 0.025, 32]} />
      </mesh>
      <mesh material={accentMat} position={[0, 0, -0.515]} rotation={cylRot}>
        <cylinderGeometry args={[0.165, 0.165, 0.025, 32]} />
      </mesh>
      {/* Small centre logo nub */}
      <mesh material={accentMat} position={[0, 0, 0.528]} rotation={cylRot}>
        <cylinderGeometry args={[0.065, 0.065, 0.012, 20]} />
      </mesh>
      <mesh material={accentMat} position={[0, 0, -0.528]} rotation={cylRot}>
        <cylinderGeometry args={[0.065, 0.065, 0.012, 20]} />
      </mesh>

    </group>
  );
}

function Lights({ accentColor }: { accentColor: string }) {
  return (
    <>
      <ambientLight intensity={0.30} color="#eef0ff" />
      {/* Main key light — top-right-front */}
      <directionalLight position={[5, 8, 6]} intensity={3.8} color="#ffffff" />
      {/* Fill light — left */}
      <directionalLight position={[-5, 2, 4]} intensity={0.75} color="#d0e0ff" />
      {/* Under fill */}
      <directionalLight position={[1, -4, 3]} intensity={0.40} color="#c8d8ff" />
      {/* Back accent glow — accent colour */}
      <pointLight position={[0, 0, -7]} intensity={4.0} color={accentColor} distance={16} />
      {/* Side rim highlights */}
      <pointLight position={[-7, 1, 0]} intensity={2.2} color="#b8ccff" distance={14} />
      <pointLight position={[7, 1, 0]} intensity={1.8} color="#ffffff" distance={14} />
      {/* Top overhead */}
      <pointLight position={[0, 6, 5]} intensity={1.4} color="#ffffff" distance={14} />
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
