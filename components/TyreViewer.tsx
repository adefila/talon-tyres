"use client";

import dynamic from "next/dynamic";
import { useRef, useState, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { Layers, Pause, Play, RotateCcw } from "lucide-react";

const TyreViewerScene = dynamic(() => import("./TyreViewerScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-10 w-10 rounded-full border-2 border-white/10 border-t-[#CC0000] animate-spin" />
    </div>
  ),
});

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const rimFinishes = [
  { id: "chrome", label: "Chrome", color: "#C0C8D8", roughness: 0.12 },
  { id: "matte", label: "Matte Black", color: "#1A1A1E", roughness: 0.82 },
  { id: "gunmetal", label: "Gunmetal", color: "#3A3A4A", roughness: 0.35 },
  { id: "bronze", label: "Bronze", color: "#7C5C2C", roughness: 0.28 },
];

const accents = [
  { id: "red", label: "Talon Red", color: "#CC0000" },
  { id: "blue", label: "Cobalt", color: "#1E40AF" },
  { id: "green", label: "Racing Green", color: "#15803D" },
  { id: "sky", label: "Glacier", color: "#0EA5E9" },
];

const specs = [
  { label: "Size", value: "225/45 R17" },
  { label: "Load / Speed", value: "94V" },
  { label: "Tread", value: "Directional V" },
  { label: "Season", value: "All-Season" },
];

export default function TyreViewer() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  const [rim, setRim] = useState(0);
  const [accent, setAccent] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [exploded, setExploded] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const finish = rimFinishes[rim];
  const accentColor = accents[accent].color;

  return (
    <section id="viewer" ref={ref} className="relative bg-[#0A0A14] py-24 lg:py-32 overflow-hidden">
      {/* Soft accent glow behind the wheel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px] opacity-20 transition-colors duration-700"
        style={{ background: accentColor }}
      />

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="mb-10 lg:mb-4 max-w-[520px]"
        >
          <span
            className="text-[10px] font-bold tracking-[0.3em] uppercase mb-4 block transition-colors duration-500"
            style={{ color: accentColor }}
          >
            360° Inspection
          </span>
          <h2 className="text-[44px] lg:text-[60px] font-bold uppercase leading-[1] tracking-[-0.025em] text-white">
            Every Detail.
            <br />
            <span className="text-white/35">Every Angle.</span>
          </h2>
          <p className="mt-5 text-[14px] leading-relaxed text-white/50">
            Drag to rotate, scroll or pinch to zoom. Open the exploded view to see how the
            Talon AllRoad, alloy and brake assembly fit together.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-center">
          {/* 3D viewport */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1, duration: 0.9, ease }}
            className="relative h-[420px] sm:h-[520px] lg:h-[640px] cursor-grab active:cursor-grabbing"
          >
            <TyreViewerScene
              rimColor={finish.color}
              rimRoughness={finish.roughness}
              accentColor={accentColor}
              spinning={spinning}
              exploded={exploded}
              resetKey={resetKey}
            />

            {/* Viewport toolbar */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 backdrop-blur-md">
              <ToolbarButton active={spinning} onClick={() => setSpinning((s) => !s)} label={spinning ? "Pause" : "Spin"}>
                {spinning ? <Pause size={14} /> : <Play size={14} />}
              </ToolbarButton>
              <ToolbarButton active={exploded} onClick={() => setExploded((e) => !e)} label="Exploded">
                <Layers size={14} />
              </ToolbarButton>
              <ToolbarButton active={false} onClick={() => setResetKey((k) => k + 1)} label="Reset">
                <RotateCcw size={14} />
              </ToolbarButton>
            </div>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7, ease }}
            className="flex flex-col gap-8"
          >
            <ControlGroup step="01" title="Rim Finish" value={finish.label}>
              <div className="flex gap-2.5">
                {rimFinishes.map((r, i) => (
                  <Swatch key={r.id} color={r.color} label={r.label} active={rim === i} onClick={() => setRim(i)} />
                ))}
              </div>
            </ControlGroup>

            <ControlGroup step="02" title="Accent" value={accents[accent].label}>
              <div className="flex gap-2.5">
                {accents.map((a, i) => (
                  <Swatch key={a.id} color={a.color} label={a.label} active={accent === i} onClick={() => setAccent(i)} />
                ))}
              </div>
            </ControlGroup>

            <div className="grid grid-cols-2 border-t border-l border-white/10">
              {specs.map((s) => (
                <div key={s.label} className="border-r border-b border-white/10 p-4">
                  <div className="text-[9px] font-bold tracking-[0.25em] uppercase text-white/35">{s.label}</div>
                  <div className="mt-1.5 text-[15px] font-bold text-white tracking-tight">{s.value}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ControlGroup({
  step,
  title,
  value,
  children,
}: {
  step: string;
  title: string;
  value: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-black tracking-[0.1em] text-[#CC0000]">{step}</span>
          <span className="text-[9px] font-bold tracking-[0.28em] uppercase text-white/60">{title}</span>
        </div>
        <span className="text-[12px] text-white/40">{value}</span>
      </div>
      {children}
    </div>
  );
}

function Swatch({
  color,
  label,
  active,
  onClick,
}: {
  color: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={`h-11 w-11 rounded-full p-[3px] transition-all duration-200 ${
        active ? "ring-2 ring-white ring-offset-2 ring-offset-[#0A0A14]" : "ring-1 ring-white/15 hover:ring-white/40"
      }`}
    >
      <span
        className="block h-full w-full rounded-full"
        style={{ background: `radial-gradient(circle at 35% 30%, #ffffff55, transparent 55%), ${color}` }}
      />
    </button>
  );
}

function ToolbarButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.14em] transition-colors ${
        active ? "bg-white text-[#0A0A14]" : "text-white/70 hover:text-white hover:bg-white/10"
      }`}
    >
      {children}
      {label}
    </button>
  );
}
