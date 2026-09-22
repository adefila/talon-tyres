"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface TyreProps {
  accentColor: string;
  rimColor: string;
  rimRoughness: number;
}

/* ─────────────────────────────────────────
   Realistic car-tyre cross-section profile
   Revolves around Y; mesh rotated [PI/2,0,0]
   so the axle points along World Z.
───────────────────────────────────────── */
function buildTyreProfile(): THREE.Vector2[] {
  return [
    new THREE.Vector2(0.952, -0.495),
    new THREE.Vector2(0.968, -0.442),
    new THREE.Vector2(1.018, -0.432),
    new THREE.Vector2(1.085, -0.458),
    new THREE.Vector2(1.195, -0.468),
    new THREE.Vector2(1.328, -0.464),
    new THREE.Vector2(1.418, -0.428),
    new THREE.Vector2(1.458, -0.356),
    new THREE.Vector2(1.473, -0.254),
    new THREE.Vector2(1.480, -0.136),
    new THREE.Vector2(1.482, -0.038),
    new THREE.Vector2(1.482,  0.000),
    new THREE.Vector2(1.482,  0.038),
    new THREE.Vector2(1.480,  0.136),
    new THREE.Vector2(1.473,  0.254),
    new THREE.Vector2(1.458,  0.356),
    new THREE.Vector2(1.418,  0.428),
    new THREE.Vector2(1.328,  0.464),
    new THREE.Vector2(1.195,  0.468),
    new THREE.Vector2(1.085,  0.458),
    new THREE.Vector2(1.018,  0.432),
    new THREE.Vector2(0.968,  0.442),
    new THREE.Vector2(0.952,  0.495),
  ];
}

/* ─────────────────────────────────────────
   Trapezoidal spoke shape (wide at rim,
   narrow at hub) for ExtrudeGeometry.
   Shape lives in XY plane; extrude along Z.
───────────────────────────────────────── */
function buildSpokeShape(): THREE.Shape {
  const s = new THREE.Shape();
  const hubY = 0.200, hubX = 0.036;
  const rimY = 0.918, rimX = 0.092;
  const cp1X = 0.058, cp1Y = 0.520; // control point for left curve
  const cp2X = 0.058, cp2Y = 0.520; // control point for right curve

  s.moveTo(-hubX, hubY);
  s.quadraticCurveTo(-cp1X, cp1Y, -rimX, rimY);
  s.lineTo(rimX, rimY);
  s.quadraticCurveTo(cp2X, cp2Y, hubX, hubY);
  s.closePath();
  return s;
}

function DraggableTyre({ accentColor, rimColor, rimRoughness }: TyreProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const isDragging = useRef(false);
  const prevMouse = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const rot = useRef({ x: 0.40, y: 0.0 });
  const { gl } = useThree();

  /* ── Materials ── */
  const rubber = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#0a0a10", roughness: 0.93, metalness: 0.0,
    emissive: "#040408", emissiveIntensity: 0.06,
  }), []);

  const grooveMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#030305", roughness: 1.0, metalness: 0,
  }), []);

  // Dark painted rim body — barrel, hub background, between-spoke fill
  const rimDark = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#141418", roughness: 0.22, metalness: 0.88,
  }), []);

  // Machined/polished spoke face — driven by rimColor prop
  const spokeMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: rimColor,
    roughness: rimRoughness,
    metalness: rimRoughness < 0.45 ? 0.96 : 0.58,
    envMapIntensity: 1.4,
  }), [rimColor, rimRoughness]);

  const accentMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: accentColor, roughness: 0.42, metalness: 0.28,
    emissive: accentColor, emissiveIntensity: 0.52,
  }), [accentColor]);

  const lugMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#28282e", roughness: 0.42, metalness: 0.82,
  }), []);

  /* ── Geometry (memoised) ── */
  const tyreProfile = useMemo(buildTyreProfile, []);

  // ExtrudeGeometry spoke — proper tapered shape
  const spokeGeo = useMemo(() => {
    const shape = buildSpokeShape();
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.210,
      bevelEnabled: true,
      bevelSize: 0.007,
      bevelThickness: 0.007,
      bevelSegments: 3,
    });
  }, []);

  // 10 spoke angles: 5 Y-pairs at ±0.098 rad offset per pair
  const spokeAngles = useMemo(() => {
    const angles: number[] = [];
    for (let i = 0; i < 5; i++) {
      const base = (i / 5) * Math.PI * 2;
      angles.push(base - 0.098, base + 0.098);
    }
    return angles;
  }, []);

  // Lug bolt angles (5-bolt pattern)
  const lugAngles = useMemo(() =>
    Array.from({ length: 5 }, (_, i) => (i / 5) * Math.PI * 2), []);

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
  const WHEEL_DEPTH = 0.210; // extrusion depth of spoke
  const HALF_DEPTH = WHEEL_DEPTH / 2;

  return (
    <group ref={groupRef} scale={[0.80, 0.80, 0.80]}>

      {/* ── Tyre body ── */}
      <mesh material={rubber} rotation={cylRot}>
        <latheGeometry args={[tyreProfile, 96]} />
      </mesh>

      {/* ── 5 circumferential tread grooves ── */}
      {([-0.30, -0.14, 0.00, 0.14, 0.30] as number[]).map((z, i) => (
        <mesh key={`groove-${i}`} position={[0, 0, z]} material={grooveMat}>
          <torusGeometry args={[1.471, 0.033, 10, 96]} />
        </mesh>
      ))}

      {/* ── Sidewall accent colour rings ── */}
      {([0.472, -0.472] as number[]).map((z, i) => (
        <mesh key={`sw-${i}`} position={[0, 0, z]} material={accentMat}>
          <torusGeometry args={[1.022, 0.020, 14, 96]} />
        </mesh>
      ))}

      {/* ── Rim outer barrel (dark painted open cylinder) ── */}
      <mesh material={rimDark} rotation={cylRot}>
        <cylinderGeometry args={[0.945, 0.945, 0.940, 64, 1, true]} />
      </mesh>

      {/* ── Rim barrel lip flanges (tyre bead ledge) ── */}
      {([0.470, -0.470] as number[]).map((z, i) => (
        <mesh key={`lip-${i}`} material={rimDark} position={[0, 0, z]} rotation={cylRot}>
          <cylinderGeometry args={[0.958, 0.958, 0.022, 64]} />
        </mesh>
      ))}

      {/* ── Dark face background discs (flat cylinders, same radius top/bottom) ── */}
      {([0.460, -0.460] as number[]).map((z, i) => (
        <mesh key={`face-${i}`} material={rimDark} position={[0, 0, z]} rotation={cylRot}>
          <cylinderGeometry args={[0.930, 0.930, 0.008, 64]} />
        </mesh>
      ))}

      {/* ── 10 tapered Y-spokes (ExtrudeGeometry) ── */}
      {spokeAngles.map((angle, i) => (
        <mesh
          key={`spoke-${i}`}
          rotation={[0, 0, angle]}
          position={[0, 0, -HALF_DEPTH]}
          material={spokeMat}
          geometry={spokeGeo}
        />
      ))}

      {/* ── Hub cylinder (dark painted) ── */}
      <mesh material={rimDark} rotation={cylRot}>
        <cylinderGeometry args={[0.195, 0.195, 1.005, 36]} />
      </mesh>

      {/* ── Hub face caps (accent colour disc each side) ── */}
      {([0.508, -0.508] as number[]).map((z, i) => (
        <mesh key={`cap-${i}`} material={accentMat} position={[0, 0, z]} rotation={cylRot}>
          <cylinderGeometry args={[0.162, 0.162, 0.024, 32]} />
        </mesh>
      ))}
      {/* Centre nub */}
      {([0.520, -0.520] as number[]).map((z, i) => (
        <mesh key={`nub-${i}`} material={accentMat} position={[0, 0, z]} rotation={cylRot}>
          <cylinderGeometry args={[0.062, 0.062, 0.014, 20]} />
        </mesh>
      ))}

      {/* ── 5 lug bolts per face ── */}
      {lugAngles.map((a, i) => {
        const lx = Math.cos(a) * 0.645;
        const ly = Math.sin(a) * 0.645;
        return (
          [0.505, -0.505] as number[]
        ).map((z, j) => (
          <mesh key={`lug-${i}-${j}`} position={[lx, ly, z]} rotation={cylRot} material={lugMat}>
            <cylinderGeometry args={[0.056, 0.056, 0.058, 10]} />
          </mesh>
        ));
      })}

    </group>
  );
}

function Lights({ accentColor }: { accentColor: string }) {
  return (
    <>
      <ambientLight intensity={0.28} color="#eef0ff" />
      <directionalLight position={[5, 8, 6]}    intensity={3.8} color="#ffffff" />
      <directionalLight position={[-5, 2, 4]}   intensity={0.78} color="#d0e0ff" />
      <directionalLight position={[1, -4, 3]}   intensity={0.42} color="#c8d8ff" />
      <pointLight position={[0, 0, -7]}   intensity={4.0} color={accentColor} distance={16} />
      <pointLight position={[-7, 1, 0]}   intensity={2.4} color="#b8ccff"    distance={14} />
      <pointLight position={[7, 1, 0]}    intensity={1.9} color="#ffffff"    distance={14} />
      <pointLight position={[0, 6, 5]}    intensity={1.5} color="#ffffff"    distance={14} />
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
