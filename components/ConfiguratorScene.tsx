"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

interface TyreProps {
  accentColor: string;
  rimColor: string;
  rimRoughness: number;
  selectedSize?: string;
}

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

function buildSpokeShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-0.048, 0.200);
  s.bezierCurveTo(-0.076, 0.400, -0.138, 0.660, -0.170, 0.908);
  s.lineTo(0.170, 0.908);
  s.bezierCurveTo(0.138, 0.660, 0.076, 0.400, 0.048, 0.200);
  s.closePath();
  return s;
}

function parseSize(sizeStr: string): { width: number; aspect: number; rim: number } {
  const m = sizeStr.match(/(\d+)\/(\d+)\s*R(\d+)/);
  return m
    ? { width: parseInt(m[1]), aspect: parseInt(m[2]), rim: parseInt(m[3]) }
    : { width: 245, aspect: 45, rim: 18 };
}

function getSizeScale(sizeStr: string) {
  const { aspect } = parseSize(sizeStr);
  if (aspect <= 35) return { xy: 0.90, z: 1.06 };
  if (aspect <= 42) return { xy: 0.95, z: 1.02 };
  if (aspect <= 50) return { xy: 1.00, z: 1.00 };
  if (aspect <= 60) return { xy: 1.08, z: 0.98 };
  return { xy: 1.14, z: 0.95 };
}

function DraggableTyre({ accentColor, rimColor, rimRoughness, selectedSize = "245/45 R19" }: TyreProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const isDragging = useRef(false);
  const prevMouse = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const rot = useRef({ x: 0.32, y: 0.55 });
  const { gl } = useThree();

  const tyreProfile = useMemo(buildTyreProfile, []);

  const spokeGeo = useMemo(() => {
    const shape = buildSpokeShape();
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.920,
      bevelEnabled: true,
      bevelSize: 0.008,
      bevelThickness: 0.008,
      bevelSegments: 3,
    });
  }, []);

  const spokeAngles = useMemo(() =>
    Array.from({ length: 5 }, (_, i) => (i / 5) * Math.PI * 2), []);

  const lugAngles = useMemo(() =>
    Array.from({ length: 5 }, (_, i) => (i / 5) * Math.PI * 2), []);

  /* clearcoat and metalness derived from roughness so each rim preset looks distinct */
  const spokeClearcoat  = rimRoughness < 0.20 ? 0.90 : rimRoughness < 0.45 ? 0.40 : 0.05;
  const spokeMetalness  = rimRoughness < 0.45 ? 0.92 : 0.58;
  const spokeRoughness  = Math.max(rimRoughness, 0.12);

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

  const sz = getSizeScale(selectedSize);
  const cylRot: [number, number, number] = [Math.PI / 2, 0, 0];
  const HALF_DEPTH = 0.460;

  return (
    <group ref={groupRef} scale={[sz.xy * 0.80, sz.xy * 0.80, sz.z * 0.80]}>

      {/* Tyre body */}
      <mesh rotation={cylRot}>
        <latheGeometry args={[tyreProfile, 96]} />
        <meshStandardMaterial color="#0a0a10" roughness={0.93} metalness={0.0} emissive="#040408" emissiveIntensity={0.06} />
      </mesh>

      {/* Tread grooves */}
      {([-0.34, -0.17, 0.00, 0.17, 0.34] as number[]).map((z, i) => (
        <mesh key={`groove-${i}`} position={[0, 0, z]}>
          <torusGeometry args={[1.468, 0.040, 10, 96]} />
          <meshStandardMaterial color="#030305" roughness={1.0} metalness={0} />
        </mesh>
      ))}

      {/* Shoulder grooves */}
      {([-0.42, 0.42] as number[]).map((z, i) => (
        <mesh key={`sg-${i}`} position={[0, 0, z]}>
          <torusGeometry args={[1.410, 0.028, 8, 80]} />
          <meshStandardMaterial color="#030305" roughness={1.0} metalness={0} />
        </mesh>
      ))}

      {/* Sidewall accent rings */}
      {([0.478, -0.478] as number[]).map((z, i) => (
        <mesh key={`sw-${i}`} position={[0, 0, z]}>
          <torusGeometry args={[1.022, 0.020, 14, 96]} />
          <meshStandardMaterial color={accentColor} roughness={0.40} metalness={0.30} emissive={accentColor} emissiveIntensity={0.50} />
        </mesh>
      ))}

      {/* Rim barrel — DoubleSide so interior visible between spokes */}
      <mesh rotation={cylRot}>
        <cylinderGeometry args={[0.945, 0.945, 0.940, 64, 1, true]} />
        <meshStandardMaterial color="#141418" roughness={0.24} metalness={0.85} side={THREE.DoubleSide} />
      </mesh>

      {/* Barrel lip flanges */}
      {([0.470, -0.470] as number[]).map((z, i) => (
        <mesh key={`lip-${i}`} position={[0, 0, z]} rotation={cylRot}>
          <cylinderGeometry args={[0.962, 0.962, 0.024, 64]} />
          <meshStandardMaterial color="#141418" roughness={0.24} metalness={0.85} />
        </mesh>
      ))}

      {/* Inner back disc */}
      <mesh position={[0, 0, -0.430]} rotation={cylRot}>
        <cylinderGeometry args={[0.920, 0.920, 0.010, 48]} />
        <meshStandardMaterial color="#141418" roughness={0.24} metalness={0.85} />
      </mesh>

      {/* 5 wide blade spokes — JSX material is reactive: re-renders when rimColor/rimRoughness change */}
      {spokeAngles.map((angle, i) => (
        <mesh key={`spoke-${i}`} rotation={[0, 0, angle]} position={[0, 0, -HALF_DEPTH]} geometry={spokeGeo}>
          <meshPhysicalMaterial
            color={rimColor}
            roughness={spokeRoughness}
            metalness={spokeMetalness}
            clearcoat={spokeClearcoat}
            clearcoatRoughness={0.12}
            reflectivity={0.85}
          />
        </mesh>
      ))}

      {/* Hub cylinder */}
      <mesh rotation={cylRot}>
        <cylinderGeometry args={[0.195, 0.195, 1.005, 36]} />
        <meshStandardMaterial color="#141418" roughness={0.24} metalness={0.85} />
      </mesh>

      {/* Hub face caps */}
      {([0.508, -0.508] as number[]).map((z, i) => (
        <mesh key={`cap-${i}`} position={[0, 0, z]} rotation={cylRot}>
          <cylinderGeometry args={[0.162, 0.162, 0.026, 32]} />
          <meshStandardMaterial color={accentColor} roughness={0.35} metalness={0.40} emissive={accentColor} emissiveIntensity={0.45} />
        </mesh>
      ))}

      {/* Centre nub */}
      {([0.520, -0.520] as number[]).map((z, i) => (
        <mesh key={`nub-${i}`} position={[0, 0, z]} rotation={cylRot}>
          <cylinderGeometry args={[0.060, 0.060, 0.014, 20]} />
          <meshStandardMaterial color={accentColor} roughness={0.35} metalness={0.40} emissive={accentColor} emissiveIntensity={0.45} />
        </mesh>
      ))}

      {/* Lug bolts */}
      {lugAngles.map((a, i) => {
        const lx = Math.cos(a) * 0.645;
        const ly = Math.sin(a) * 0.645;
        return ([0.505, -0.505] as number[]).map((z, j) => (
          <mesh key={`lug-${i}-${j}`} position={[lx, ly, z]} rotation={cylRot}>
            <cylinderGeometry args={[0.056, 0.056, 0.058, 10]} />
            <meshStandardMaterial color="#28282e" roughness={0.42} metalness={0.82} />
          </mesh>
        ));
      })}

      {/* Ground shadow */}
      <mesh position={[0, -1.65, -0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.2, 1.8]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.09} />
      </mesh>

    </group>
  );
}

interface Props {
  accentColor: string;
  rimColor: string;
  rimRoughness: number;
  selectedSize?: string;
}

export default function ConfiguratorScene({ accentColor, rimColor, rimRoughness, selectedSize }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.5], fov: 34 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
      onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); }}
    >
      <ambientLight intensity={0.28} color="#eef0ff" />
      <directionalLight position={[4.5, 7, 5.5]}  intensity={3.8} color="#ffffff" />
      <directionalLight position={[-4, 2, 3.5]}   intensity={0.70} color="#d4e0ff" />
      <directionalLight position={[1, -5, 2.5]}   intensity={0.30} color="#c8d4ff" />
      <pointLight position={[0, 0, -7]}   intensity={3.2} color={accentColor} distance={16} />
      <pointLight position={[-6, 1, 0.5]} intensity={1.8} color="#b8ccff" distance={14} />
      <pointLight position={[6, 1, 0.5]}  intensity={1.5} color="#ffffff"  distance={14} />
      <pointLight position={[2, 3, 6]}    intensity={1.6} color="#ffffff"  distance={14} />

      {/* IBL environment for realistic metal reflections — no background change */}
      <Environment preset="studio" background={false} />

      <DraggableTyre
        accentColor={accentColor}
        rimColor={rimColor}
        rimRoughness={rimRoughness}
        selectedSize={selectedSize}
      />
    </Canvas>
  );
}
