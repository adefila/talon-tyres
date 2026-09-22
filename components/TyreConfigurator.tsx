"use client";

import dynamic from "next/dynamic";
import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const ConfiguratorScene = dynamic(() => import("./ConfiguratorScene"), { ssr: false });

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

const rimOptions = [
  { id: "chrome", label: "Chrome", color: "#C0C8D8", roughness: 0.12 },
  { id: "matte", label: "Matte Black", color: "#1A1A1E", roughness: 0.82 },
  { id: "gunmetal", label: "Gunmetal", color: "#3A3A4A", roughness: 0.35 },
  { id: "bronze", label: "Bronze", color: "#7C5C2C", roughness: 0.28 },
];

function RatingBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-white/40 w-16 shrink-0">
        {label}
      </span>
      <div className="flex-1 h-[3px] bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
      <span className="text-[10px] font-bold text-white/60 w-6 text-right">{value}</span>
    </div>
  );
}

export default function TyreConfigurator() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });
  const [activeType, setActiveType] = useState(0);
  const [activeRim, setActiveRim] = useState(0);
  const [activeSize, setActiveSize] = useState(0);

  const tyre = tyreTypes[activeType];
  const rim = rimOptions[activeRim];

  return (
    <section id="configure" ref={ref} className="bg-[#080810] py-24 lg:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="mb-16"
        >
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#CC0000] mb-4 block">
            Interactive Configurator
          </span>
          <h2 className="text-[44px] lg:text-[60px] font-bold uppercase leading-[1] tracking-[-0.025em] text-white mb-4">
            Build Your
            <br />
            <span className="text-[#CC0000]">Perfect Set.</span>
          </h2>
          <p className="text-[14px] text-white/40 max-w-md leading-relaxed">
            Select your tyre type, pick a rim finish, choose a size — then drag to inspect every angle in 3D before you enquire.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_520px] gap-12 lg:gap-16 items-start">

          {/* ── Left: controls ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.7, ease }}
            className="flex flex-col gap-8"
          >
            {/* Tyre Type */}
            <div>
              <p className="text-[10px] font-bold tracking-[0.28em] uppercase text-white/30 mb-4">
                Tyre Type
              </p>
              <div className="grid grid-cols-2 gap-2">
                {tyreTypes.map((t, i) => (
                  <button
                    key={t.id}
                    onClick={() => { setActiveType(i); setActiveSize(0); }}
                    className={`text-left p-4 border transition-all duration-200 ${
                      activeType === i
                        ? "border-white/30 bg-white/[0.06]"
                        : "border-white/10 hover:border-white/20 hover:bg-white/[0.03]"
                    }`}
                  >
                    <div
                      className="w-2 h-2 rounded-full mb-3"
                      style={{ background: t.accentColor }}
                    />
                    <div className="text-[12px] font-bold text-white tracking-tight">{t.label}</div>
                    <div className="text-[10px] text-white/40 mt-0.5">{t.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Rim Finish */}
            <div>
              <p className="text-[10px] font-bold tracking-[0.28em] uppercase text-white/30 mb-4">
                Rim Finish
              </p>
              <div className="flex gap-2 flex-wrap">
                {rimOptions.map((r, i) => (
                  <button
                    key={r.id}
                    onClick={() => setActiveRim(i)}
                    title={r.label}
                    className={`flex items-center gap-2 px-4 py-2.5 border text-[11px] font-semibold tracking-[0.12em] uppercase transition-all ${
                      activeRim === i
                        ? "border-white/40 text-white"
                        : "border-white/10 text-white/40 hover:border-white/20 hover:text-white/70"
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ background: r.color, border: "1px solid rgba(255,255,255,0.15)" }}
                    />
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tyre Size */}
            <div>
              <p className="text-[10px] font-bold tracking-[0.28em] uppercase text-white/30 mb-4">
                Size
              </p>
              <div className="flex gap-2 flex-wrap">
                {tyre.sizes.map((s, i) => (
                  <button
                    key={s}
                    onClick={() => setActiveSize(i)}
                    className={`px-4 py-2.5 border font-mono text-[11px] transition-all ${
                      activeSize === i
                        ? "border-white/40 text-white bg-white/[0.06]"
                        : "border-white/10 text-white/40 hover:border-white/20 hover:text-white/70"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Performance Ratings */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeType}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="border border-white/10 p-5 flex flex-col gap-4"
              >
                <p className="text-[10px] font-bold tracking-[0.28em] uppercase text-white/30 mb-1">
                  Performance Ratings
                </p>
                <RatingBar label="Grip" value={tyre.rating.grip} color={tyre.accentColor} />
                <RatingBar label="Comfort" value={tyre.rating.comfort} color={tyre.accentColor} />
                <RatingBar label="Wear" value={tyre.rating.wear} color={tyre.accentColor} />
                <RatingBar label="Wet" value={tyre.rating.wet} color={tyre.accentColor} />
              </motion.div>
            </AnimatePresence>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="group inline-flex items-center gap-2.5 bg-[#CC0000] text-white text-[11px] font-bold tracking-[0.15em] uppercase px-7 py-4 hover:bg-white hover:text-[#CC0000] transition-colors duration-200"
              >
                Request a Quote
                <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
              </motion.a>
              <span className="text-[11px] text-white/25 tracking-wide">
                {tyre.sizes[activeSize]} · {rim.label}
              </span>
            </div>
          </motion.div>

          {/* ── Right: 3D canvas ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8, ease }}
            className="relative"
          >
            {/* Canvas */}
            <div className="relative aspect-square w-full">
              {/* Radial glow — makes dark rubber visible on dark bg */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`glow-${activeType}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 pointer-events-none z-0"
                  style={{
                    background: `radial-gradient(ellipse 62% 62% at 50% 50%, ${tyre.accentColor}30 0%, ${tyre.accentColor}10 45%, transparent 70%)`,
                  }}
                />
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeType}-${activeRim}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 z-10"
                >
                  <ConfiguratorScene
                    accentColor={tyre.accentColor}
                    rimColor={rim.color}
                    rimRoughness={rim.roughness}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Drag hint */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none">
                <svg className="w-3.5 h-3.5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                <span className="text-[10px] text-white/30 tracking-[0.2em] uppercase">Drag to rotate</span>
              </div>
            </div>

            {/* Tyre tag */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeType}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="mt-6 flex items-start gap-4"
              >
                <div
                  className="w-px h-10 shrink-0 mt-0.5"
                  style={{ background: tyre.accentColor }}
                />
                <div>
                  <div className="text-[16px] font-bold text-white tracking-tight">{tyre.sub}</div>
                  <div className="text-[13px] text-white/45 leading-snug mt-0.5">{tyre.tag}</div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
