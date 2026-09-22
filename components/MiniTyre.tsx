"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function buildSpokeShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-0.034, 0.195);
  s.quadraticCurveTo(-0.055, 0.50, -0.088, 0.912);
  s.lineTo(0.088, 0.912);
  s.quadraticCurveTo(0.055, 0.50, 0.034, 0.195);
  s.closePath();
  return s;
}

function TyreMesh({ accentColor }: { accentColor: string }) {
  const groupRef = useRef<THREE.Group>(null!);
  const rot = useRef({ x: 0.42, y: 0.0 });

  const rubber = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#0a0a10", roughness: 0.92, metalness: 0.0,
    emissive: "#040408", emissiveIntensity: 0.05,
  }), []);

  const grooveMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#030305", roughness: 1.0, metalness: 0,
  }), []);

  const rimDark = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#141418", roughness: 0.22, metalness: 0.88,
  }), []);

  const spokeMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#C0C8D8", roughness: 0.12, metalness: 0.96, envMapIntensity: 1.4,
  }), []);

  const accentMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: accentColor, roughness: 0.40, metalness: 0.30,
    emissive: accentColor, emissiveIntensity: 0.50,
  }), [accentColor]);

  const lugMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#28282e", roughness: 0.45, metalness: 0.80,
  }), []);

  const tyreProfile = useMemo<THREE.Vector2[]>(() => [
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
  ], []);

  const spokeGeo = useMemo(() => {
    const shape = buildSpokeShape();
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.200,
      bevelEnabled: true,
      bevelSize: 0.006,
      bevelThickness: 0.006,
      bevelSegments: 2,
    });
  }, []);

  const spokeAngles = useMemo(() => {
    const angles: number[] = [];
    for (let i = 0; i < 5; i++) {
      const base = (i / 5) * Math.PI * 2;
      angles.push(base - 0.098, base + 0.098);
    }
    return angles;
  }, []);

  const lugAngles = useMemo(() =>
    Array.from({ length: 5 }, (_, i) => (i / 5) * Math.PI * 2), []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    rot.current.y += delta * 0.30;
    groupRef.current.rotation.x = rot.current.x;
    groupRef.current.rotation.y = rot.current.y;
  });

  const cylRot: [number, number, number] = [Math.PI / 2, 0, 0];
  const HALF_DEPTH = 0.100;

  return (
    <group ref={groupRef} scale={[0.70, 0.70, 0.70]}>

      {/* Tyre body */}
      <mesh material={rubber} rotation={cylRot}>
        <latheGeometry args={[tyreProfile, 80]} />
      </mesh>

      {/* Tread grooves */}
      {([-0.30, -0.14, 0.00, 0.14, 0.30] as number[]).map((z, i) => (
        <mesh key={`g-${i}`} position={[0, 0, z]} material={grooveMat}>
          <torusGeometry args={[1.471, 0.033, 9, 80]} />
        </mesh>
      ))}

      {/* Sidewall accent rings */}
      {([0.472, -0.472] as number[]).map((z, i) => (
        <mesh key={`sw-${i}`} position={[0, 0, z]} material={accentMat}>
          <torusGeometry args={[1.022, 0.020, 12, 80]} />
        </mesh>
      ))}

      {/* Rim barrel */}
      <mesh material={rimDark} rotation={cylRot}>
        <cylinderGeometry args={[0.945, 0.945, 0.940, 48, 1, true]} />
      </mesh>

      {/* Barrel lip flanges */}
      {([0.470, -0.470] as number[]).map((z, i) => (
        <mesh key={`lip-${i}`} material={rimDark} position={[0, 0, z]} rotation={cylRot}>
          <cylinderGeometry args={[0.958, 0.958, 0.022, 48]} />
        </mesh>
      ))}

      {/* Face background discs (flat — same radius top/bottom) */}
      {([0.460, -0.460] as number[]).map((z, i) => (
        <mesh key={`face-${i}`} material={rimDark} position={[0, 0, z]} rotation={cylRot}>
          <cylinderGeometry args={[0.930, 0.930, 0.008, 48]} />
        </mesh>
      ))}

      {/* 10 tapered Y-spokes */}
      {spokeAngles.map((angle, i) => (
        <mesh
          key={`spoke-${i}`}
          rotation={[0, 0, angle]}
          position={[0, 0, -HALF_DEPTH]}
          material={spokeMat}
          geometry={spokeGeo}
        />
      ))}

      {/* Hub */}
      <mesh material={rimDark} rotation={cylRot}>
        <cylinderGeometry args={[0.195, 0.195, 1.005, 28]} />
      </mesh>

      {/* Hub caps */}
      {([0.508, -0.508] as number[]).map((z, i) => (
        <mesh key={`cap-${i}`} material={accentMat} position={[0, 0, z]} rotation={cylRot}>
          <cylinderGeometry args={[0.162, 0.162, 0.024, 24]} />
        </mesh>
      ))}

      {/* Lug bolts */}
      {lugAngles.map((a, i) => {
        const lx = Math.cos(a) * 0.645;
        const ly = Math.sin(a) * 0.645;
        return ([0.505, -0.505] as number[]).map((z, j) => (
          <mesh key={`lug-${i}-${j}`} position={[lx, ly, z]} rotation={cylRot} material={lugMat}>
            <cylinderGeometry args={[0.056, 0.056, 0.055, 8]} />
          </mesh>
        ));
      })}

    </group>
  );
}

export default function MiniTyre({ accentColor }: { accentColor: string }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.0], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
      onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); }}
    >
      <ambientLight intensity={0.28} color="#eef0ff" />
      <directionalLight position={[5, 8, 6]}  intensity={3.8} color="#ffffff" />
      <directionalLight position={[-4, -2, -3]} intensity={0.60} color="#3344cc" />
      <pointLight position={[0, 0, -5]}  intensity={2.4} color={accentColor} distance={12} />
      <pointLight position={[-6, 1, 0]}  intensity={2.4} color="#b8ccff"    distance={12} />
      <pointLight position={[6, 1, 0]}   intensity={2.0} color="#ffffff"    distance={12} />
      <pointLight position={[0, 5, 4]}   intensity={1.4} color="#ffffff"    distance={10} />
      <TyreMesh accentColor={accentColor} />
    </Canvas>
  );
}
