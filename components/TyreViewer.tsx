"use client";

import dynamic from "next/dynamic";
import { useRef, useState, type ReactNode } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Layers, Pause, Play, RotateCcw } from "lucide-react";

const TyreViewerScene = dynamic(() => import("./TyreViewerScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-10 w-10 rounded-full border-2 border-white/10 border-t-[#CC0000] animate-spin" />
    </div>
  ),
});

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const tyreTypes = [
  {
    id: "performance",
    label: "Performance",
    sub: "Talon Pro GT",
    accentColor: "#CC0000",
    tag: "Track-grade wet grip. Precision cornering at speed.",
    sizes: ["225/40 R18", "245/45 R19", "295/30 R20"],
    rating: { grip: 97, comfort: 72, wear: 68, wet: 94 },
  },
  {
    id: "allseason",
    label: "All-Season",
    sub: "Talon AllRoad",
    accentColor: "#1E40AF",
    tag: "One tyre for every season, every surface.",
    sizes: ["205/55 R16", "215/60 R17", "235/65 R18"],
    rating: { grip: 84, comfort: 91, wear: 93, wet: 87 },
  },
  {
    id: "offroad",
    label: "Off-Road",
    sub: "Talon X-Terra",
    accentColor: "#15803D",
    tag: "Reinforced 6-ply casing. Built for no roads.",
    sizes: ["265/70 R16", "285/75 R16", "305/55 R20"],
    rating: { grip: 89, comfort: 63, wear: 82, wet: 78 },
  },
  {
    id: "winter",
    label: "Winter",
    sub: "Talon Ice Shield",
    accentColor: "#0EA5E9",
    tag: "Biting-edge sipes rated to −40°C.",
    sizes: ["195/65 R15", "205/55 R16", "225/45 R18"],
    rating: { grip: 92, comfort: 85, wear: 75, wet: 90 },
  },
];

const rimFinishes = [
  { id: "chrome", label: "Chrome", color: "#C0C8D8", roughness: 0.12 },
  { id: "matte", label: "Matte Black", color: "#1A1A1E", roughness: 0.82 },
  { id: "gunmetal", label: "Gunmetal", color: "#3A3A4A", roughness: 0.35 },
  { id: "bronze", label: "Bronze", color: "#7C5C2C", roughness: 0.28 },
];

/* Taller sidewalls (higher aspect ratio) render a slightly bigger tyre */
function sizeScale(size: string) {
  const m = size.match(/\/(\d+)/);
  const aspect = m ? parseInt(m[1], 10) : 45;
  if (aspect <= 35) return 0.94;
  if (aspect <= 42) return 0.97;
  if (aspect <= 50) return 1.0;
  if (aspect <= 60) return 1.04;
  return 1.08;
}

export default function TyreViewer() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  const [activeType, setActiveType] = useState(0);
  const [activeRim, setActiveRim] = useState(0);
  const [activeSize, setActiveSize] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [exploded, setExploded] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const tyre = tyreTypes[activeType];
  const rim = rimFinishes[activeRim];
  const selectedSize = tyre.sizes[activeSize];
  const accent = tyre.accentColor;

  return (
    <section id="configure" ref={ref} className="relative bg-[#0A0A14] py-24 lg:py-32 overflow-hidden">
      {/* Soft accent glow behind the wheel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[38%] top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px] opacity-20 transition-colors duration-700"
        style={{ background: accent }}
      />

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="mb-10 lg:mb-6 max-w-[560px]"
        >
          <span
            className="text-[10px] font-bold tracking-[0.3em] uppercase mb-4 block transition-colors duration-500"
            style={{ color: accent }}
          >
            360° Configurator
          </span>
          <h2 className="text-[44px] lg:text-[60px] font-bold uppercase leading-[1] tracking-[-0.025em] text-white">
            Build Your
            <br />
            <span className="transition-colors duration-500" style={{ color: accent }}>
              Perfect Set.
            </span>
          </h2>
          <p className="mt-5 text-[14px] leading-relaxed text-white/50">
            Pick a tyre, finish and size, then drag to inspect every angle. Open the exploded view
            to see how the tyre and alloy fit together.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8 lg:gap-12 items-start">
          {/* 3D viewport */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1, duration: 0.9, ease }}
            className="relative h-[400px] sm:h-[520px] lg:h-[680px] lg:sticky lg:top-24 cursor-grab active:cursor-grabbing"
          >
            <TyreViewerScene
              rimColor={rim.color}
              rimRoughness={rim.roughness}
              accentColor={accent}
              spinning={spinning}
              exploded={exploded}
              scale={sizeScale(selectedSize)}
              resetKey={resetKey}
            />

            {/* Current build */}
            <div className="absolute top-3 left-3 sm:left-0 pointer-events-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeType}-${activeSize}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="text-[9px] font-bold tracking-[0.28em] uppercase text-white/40"
                >
                  {tyre.sub} · <span className="font-mono tracking-normal text-white/60">{selectedSize}</span>
                </motion.div>
              </AnimatePresence>
            </div>

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
            {/* 01 — Tyre type */}
            <ControlGroup step="01" title="Tyre Type" value={tyre.sub} accent={accent}>
              <div className="grid grid-cols-2 gap-2">
                {tyreTypes.map((t, i) => (
                  <button
                    key={t.id}
                    type="button"
                    aria-pressed={activeType === i}
                    onClick={() => {
                      setActiveType(i);
                      setActiveSize(0);
                    }}
                    className={`text-left p-3.5 border transition-all duration-200 ${
                      activeType === i
                        ? "border-white/70 bg-white/[0.06]"
                        : "border-white/10 hover:border-white/25 hover:bg-white/[0.03]"
                    }`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full mb-2.5" style={{ background: t.accentColor }} />
                    <div className="text-[13px] font-bold text-white tracking-tight">{t.label}</div>
                    <div className="text-[11px] text-white/40 mt-0.5">{t.sub}</div>
                  </button>
                ))}
              </div>
            </ControlGroup>

            {/* 02 — Rim finish */}
            <ControlGroup step="02" title="Rim Finish" value={rim.label} accent={accent}>
              <div className="flex gap-2.5">
                {rimFinishes.map((r, i) => (
                  <Swatch key={r.id} color={r.color} label={r.label} active={activeRim === i} onClick={() => setActiveRim(i)} />
                ))}
              </div>
            </ControlGroup>

            {/* 03 — Size */}
            <ControlGroup step="03" title="Size" value={selectedSize} accent={accent}>
              <div className="flex gap-2 flex-wrap">
                {tyre.sizes.map((s, i) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={activeSize === i}
                    onClick={() => setActiveSize(i)}
                    className={`px-3.5 py-2.5 border font-mono text-[11px] transition-all ${
                      activeSize === i
                        ? "border-white/70 text-white bg-white/[0.06]"
                        : "border-white/10 text-white/50 hover:border-white/25 hover:text-white/80"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </ControlGroup>

            {/* Performance data */}
            <div className="border-t border-white/10 pt-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeType}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-px h-10 shrink-0" style={{ background: accent }} />
                    <div>
                      <div className="text-[18px] font-bold text-white tracking-tight">{tyre.sub}</div>
                      <div className="text-[13px] text-white/50 mt-0.5">{tyre.tag}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                    <RatingBar label="Grip" value={tyre.rating.grip} color={accent} />
                    <RatingBar label="Wet" value={tyre.rating.wet} color={accent} />
                    <RatingBar label="Comfort" value={tyre.rating.comfort} color={accent} />
                    <RatingBar label="Wear" value={tyre.rating.wear} color={accent} />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* CTA */}
            <div className="border-t border-white/10 pt-6">
              <AnimatePresence mode="wait">
                <motion.p
                  key={`${activeType}-${activeRim}-${activeSize}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[12px] text-white/45 mb-4"
                >
                  {tyre.sub} · {selectedSize} · {rim.label}
                </motion.p>
              </AnimatePresence>
              <div style={{ display: "inline-block", transform: "skewX(-6deg)" }}>
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="inline-flex items-center bg-[#CC0000] text-white text-[11px] font-bold tracking-[0.15em] uppercase px-7 py-4 hover:bg-white hover:text-[#0A0A14] transition-colors duration-200"
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", transform: "skewX(6deg)" }}>
                    Request a Quote
                    <ArrowUpRight size={13} />
                  </span>
                </motion.a>
              </div>
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
  accent,
  children,
}: {
  step: string;
  title: string;
  value: string;
  accent: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-black tracking-[0.1em] transition-colors duration-500" style={{ color: accent }}>
            {step}
          </span>
          <span className="text-[9px] font-bold tracking-[0.28em] uppercase text-white/60">{title}</span>
        </div>
        <span className="text-[12px] text-white/40">{value}</span>
      </div>
      {children}
    </div>
  );
}

function RatingBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-white/40 w-14 shrink-0">{label}</span>
      <div className="flex-1 h-[3px] bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
      <span className="text-[10px] font-bold text-white/70 w-6 text-right">{value}</span>
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
