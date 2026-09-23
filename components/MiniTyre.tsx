"use client";

import React, { useRef, useEffect } from "react";

/**
 * CSS-only animated wheel — no WebGL canvas.
 * Eliminates the "Context Lost" problem caused by too many simultaneous
 * Three.js canvases on the same page (browser limit is 8–16 contexts).
 */
export default function MiniTyre({ accentColor }: { accentColor: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Slow continuous rotation
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let frame = 0;
    let raf: number;
    const spin = () => {
      frame += 0.4;
      el.style.transform = `rotate(${frame}deg)`;
      raf = requestAnimationFrame(spin);
    };
    raf = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(raf);
  }, []);

  const SPOKES = 5;
  const R_RIM  = 46; // rim outer radius (in SVG units of 100-unit viewBox)
  const R_HUB  = 8;
  const R_TYRE = 50;

  // Twin-spoke pair per group
  const spokes: React.ReactElement[] = [];
  for (let g = 0; g < SPOKES; g++) {
    const baseAngle = (g / SPOKES) * 360;
    for (const offset of [-10, 10]) {
      const angle = baseAngle + offset;
      const rad   = (angle - 90) * (Math.PI / 180);
      // Arm from hub edge to rim, tapered
      const x1 = Math.cos(rad) * (R_HUB + 2);
      const y1 = Math.sin(rad) * (R_HUB + 2);
      const x2 = Math.cos(rad) * (R_RIM - 4);
      const y2 = Math.sin(rad) * (R_RIM - 4);
      spokes.push(
        <line
          key={`s-${g}-${offset}`}
          x1={50 + x1} y1={50 + y1}
          x2={50 + x2} y2={50 + y2}
          stroke="url(#spokeGrad)"
          strokeWidth={3.4}
          strokeLinecap="round"
        />
      );
    }
    // Lug bolt
    const lugRad = (baseAngle - 90) * (Math.PI / 180);
    spokes.push(
      <circle
        key={`lug-${g}`}
        cx={50 + Math.cos(lugRad) * 22}
        cy={50 + Math.sin(lugRad) * 22}
        r={1.8}
        fill="#B0B4C0"
      />
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div ref={containerRef} style={{ width: "80%", height: "80%", maxWidth: 160, maxHeight: 160 }}>
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
          <defs>
            {/* Tyre radial gradient */}
            <radialGradient id="tyreGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#1A1A20" />
              <stop offset="72%"  stopColor="#0D0D12" />
              <stop offset="100%" stopColor="#050508" />
            </radialGradient>
            {/* Rim face gradient */}
            <radialGradient id="rimGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#D8DCE8" />
              <stop offset="60%"  stopColor="#B0B8CC" />
              <stop offset="100%" stopColor="#8890A4" />
            </radialGradient>
            {/* Spoke gradient */}
            <linearGradient id="spokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"  stopColor="#D2D8E8" />
              <stop offset="50%" stopColor="#C0C8D8" />
              <stop offset="100%" stopColor="#9098AC" />
            </linearGradient>
            {/* Lip chrome */}
            <radialGradient id="lipGrad" cx="50%" cy="50%" r="50%">
              <stop offset="82%"  stopColor="transparent" />
              <stop offset="86%"  stopColor="#E0E4EE" />
              <stop offset="90%"  stopColor="#C8CCD8" />
              <stop offset="94%"  stopColor="#101014" />
              <stop offset="100%" stopColor="#050508" />
            </radialGradient>
            {/* Tread groove mask */}
            <mask id="tyreMask">
              <circle cx="50" cy="50" r={R_TYRE} fill="white" />
              <circle cx="50" cy="50" r={R_RIM + 1} fill="black" />
            </mask>
          </defs>

          {/* Tyre */}
          <circle cx="50" cy="50" r={R_TYRE} fill="url(#tyreGrad)" />

          {/* Tread groove rings */}
          {[44, 40, 36, 32, 28].map((r, i) => (
            <circle key={i} cx="50" cy="50" r={r + R_RIM - 40}
              fill="none" stroke="#050508" strokeWidth={0.9}
              mask="url(#tyreMask)"
            />
          ))}

          {/* Sidewall accent ring */}
          <circle cx="50" cy="50" r={R_RIM + 3.5}
            fill="none" stroke={accentColor} strokeWidth={1.2} opacity={0.85}
          />

          {/* Rim face */}
          <circle cx="50" cy="50" r={R_RIM} fill="url(#rimGrad)" />

          {/* Spokes */}
          {spokes}

          {/* Hub */}
          <circle cx="50" cy="50" r={R_HUB}     fill="#0C0C14" />
          <circle cx="50" cy="50" r={R_HUB - 1} fill="#18182A" />
          <circle cx="50" cy="50" r={R_HUB - 2} fill="#D2D6E2" />
          <circle cx="50" cy="50" r={R_HUB - 3.5} fill="#1A1A24" />

          {/* Hub accent ring */}
          <circle cx="50" cy="50" r={R_HUB - 1.2}
            fill="none" stroke={accentColor} strokeWidth={0.8} opacity={0.9}
          />

          {/* Chrome lip overlay */}
          <circle cx="50" cy="50" r={R_TYRE} fill="url(#lipGrad)" />
        </svg>
      </div>
    </div>
  );
}
