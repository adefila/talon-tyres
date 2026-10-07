"use client";

import { useEffect, useRef } from "react";

/**
 * Lightweight spinning tyre — a face-on render of the Blender-built Talon
 * tyre (public/models/talon-tyre.glb) rotated with CSS. No WebGL canvas,
 * so product cards never hit the browser's WebGL context limit.
 */
const RENDERS: Record<string, string> = {
  "#cc0000": "/images/tyres/talon-tyre-red.webp",
  "#1e40af": "/images/tyres/talon-tyre-blue.webp",
  "#15803d": "/images/tyres/talon-tyre-green.webp",
  "#0ea5e9": "/images/tyres/talon-tyre-sky.webp",
};

function tyreRenderFor(accentColor: string) {
  return RENDERS[accentColor.toLowerCase()] ?? RENDERS["#cc0000"];
}

export default function MiniTyre({ accentColor }: { accentColor: string }) {
  const spinRef = useRef<HTMLImageElement>(null);

  // Slow continuous rotation (skipped for users who prefer reduced motion)
  useEffect(() => {
    const el = spinRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let angle = 0;
    let raf: number;
    const spin = () => {
      angle += 0.4;
      el.style.transform = `rotate(${angle}deg)`;
      raf = requestAnimationFrame(spin);
    };
    raf = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={spinRef}
        src={tyreRenderFor(accentColor)}
        alt=""
        aria-hidden="true"
        draggable={false}
        width={720}
        height={720}
        className="select-none drop-shadow-[0_12px_18px_rgba(0,0,0,0.18)]"
        style={{ width: "80%", height: "80%", maxWidth: 190, maxHeight: 190, objectFit: "contain" }}
      />
    </div>
  );
}
