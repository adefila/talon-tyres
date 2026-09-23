"use client";

import dynamic from "next/dynamic";
import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowUpRight, RotateCcw, Car, Sliders } from "lucide-react";

const ConfiguratorScene = dynamic(() => import("./ConfiguratorScene"), { ssr: false });
const CarScene = dynamic(() => import("./CarScene"), { ssr: false });

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
  { id: "chrome",   label: "Chrome",      color: "#C0C8D8", roughness: 0.12 },
  { id: "matte",    label: "Matte Black", color: "#1A1A1E", roughness: 0.82 },
  { id: "gunmetal", label: "Gunmetal",    color: "#3A3A4A", roughness: 0.35 },
  { id: "bronze",   label: "Bronze",      color: "#7C5C2C", roughness: 0.28 },
];

function RatingBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#6B7280] w-14 shrink-0">
        {label}
      </span>
      <div className="flex-1 h-[3px] bg-[#E5E7EB] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
      <span className="text-[10px] font-bold text-[#374151] w-6 text-right">{value}</span>
    </div>
  );
}

export default function TyreConfigurator() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });
  const [activeType, setActiveType] = useState(0);
  const [activeRim, setActiveRim] = useState(0);
  const [activeSize, setActiveSize] = useState(0);
  const [viewMode, setViewMode] = useState<"tyre" | "car">("tyre");

  const tyre = tyreTypes[activeType];
  const rim = rimOptions[activeRim];
  const selectedSize = tyre.sizes[activeSize];

  return (
    <section id="configure" ref={ref} className="bg-white py-24 lg:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="mb-12"
        >
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#CC0000] mb-4 block">
            Interactive Configurator
          </span>
          <h2 className="text-[44px] lg:text-[60px] font-bold uppercase leading-[1] tracking-[-0.025em] text-[#0A0A14]">
            Build Your
            <br />
            <span className="text-[#CC0000]">Perfect Set.</span>
          </h2>
        </motion.div>

        {/* Two-pane layout */}
        <div className="grid lg:grid-cols-[380px_1fr] border border-[#E5E7EB]">

          {/* LEFT: Controls */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.7, ease }}
            className="border-r border-[#E5E7EB] flex flex-col"
          >

            {/* Step 01 — Tyre Type */}
            <div className="p-6 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[11px] font-black tracking-[0.1em] text-[#CC0000]">01</span>
                <span className="text-[9px] font-bold tracking-[0.28em] uppercase text-[#374151]">Tyre Type</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {tyreTypes.map((t, i) => (
                  <button
                    key={t.id}
                    onClick={() => { setActiveType(i); setActiveSize(0); }}
                    className={`text-left p-3.5 border transition-all duration-200 ${
                      activeType === i
                        ? "border-[#0A0A14] bg-[#0A0A14]/[0.04]"
                        : "border-[#E5E7EB] hover:border-[#D1D5DB] hover:bg-[#F9F9F9]"
                    }`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full mb-2.5" style={{ background: t.accentColor }} />
                    <div className="text-[13px] font-bold text-[#0A0A14] tracking-tight">{t.label}</div>
                    <div className="text-[11px] text-[#6B7280] mt-0.5">{t.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 02 — Rim Finish */}
            <div className="p-6 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[11px] font-black tracking-[0.1em] text-[#CC0000]">02</span>
                <span className="text-[9px] font-bold tracking-[0.28em] uppercase text-[#374151]">Rim Finish</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {rimOptions.map((r, i) => (
                  <button
                    key={r.id}
                    onClick={() => setActiveRim(i)}
                    title={r.label}
                    className={`flex items-center gap-2 px-3.5 py-2.5 border text-[10px] font-semibold tracking-[0.12em] uppercase transition-all ${
                      activeRim === i
                        ? "border-[#0A0A14] text-[#0A0A14]"
                        : "border-[#E5E7EB] text-[#6B7280] hover:border-[#D1D5DB] hover:text-[#374151]"
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: r.color, border: "1px solid rgba(0,0,0,0.15)" }}
                    />
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 03 — Size */}
            <div className="p-6 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[11px] font-black tracking-[0.1em] text-[#CC0000]">03</span>
                <span className="text-[9px] font-bold tracking-[0.28em] uppercase text-[#374151]">Size</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {tyre.sizes.map((s, i) => (
                  <button
                    key={s}
                    onClick={() => setActiveSize(i)}
                    className={`px-3.5 py-2.5 border font-mono text-[11px] transition-all ${
                      activeSize === i
                        ? "border-[#0A0A14] text-[#0A0A14] bg-[#0A0A14]/[0.04]"
                        : "border-[#E5E7EB] text-[#6B7280] hover:border-[#D1D5DB] hover:text-[#374151]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="p-6 mt-auto">
              <AnimatePresence mode="wait">
                <motion.p
                  key={`${activeType}-${activeRim}-${activeSize}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[12px] text-[#6B7280] mb-4"
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
                  className="inline-flex items-center bg-[#CC0000] text-white text-[11px] font-bold tracking-[0.15em] uppercase px-7 py-4 hover:bg-[#0A0A14] transition-colors duration-200"
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", transform: "skewX(6deg)" }}>
                    Request a Quote
                    <ArrowUpRight size={13} />
                  </span>
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: 3D canvas + view toggle */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8, ease }}
            className="flex flex-col"
          >
            {/* View toggle bar */}
            <div className="flex items-center border-b border-[#E5E7EB] px-5 py-3 gap-2">
              <button
                onClick={() => setViewMode("tyre")}
                className={`flex items-center gap-2 px-3.5 py-2 text-[10px] font-bold tracking-[0.16em] uppercase transition-all ${
                  viewMode === "tyre"
                    ? "bg-[#0A0A14] text-white"
                    : "text-[#6B7280] hover:text-[#374151]"
                }`}
              >
                <Sliders size={11} />
                Tyre View
              </button>
              <button
                onClick={() => setViewMode("car")}
                className={`flex items-center gap-2 px-3.5 py-2 text-[10px] font-bold tracking-[0.16em] uppercase transition-all ${
                  viewMode === "car"
                    ? "bg-[#0A0A14] text-white"
                    : "text-[#6B7280] hover:text-[#374151]"
                }`}
              >
                <Car size={11} />
                On Car
              </button>
              <div className="ml-auto text-[9px] text-[#9CA3AF] tracking-[0.18em] uppercase">
                {selectedSize}
              </div>
            </div>

            {/* 3D Canvas / Car Preview */}
            <div className="relative flex-1 min-h-[380px]">
              <AnimatePresence mode="wait">
                {viewMode === "tyre" ? (
                  <motion.div
                    key={`tyre-${activeType}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="absolute inset-0 z-10 bg-white"
                  >
                    {/* Canvas stays mounted across rim changes — materials update imperatively */}
                    <ConfiguratorScene
                      accentColor={tyre.accentColor}
                      rimColor={rim.color}
                      rimRoughness={rim.roughness}
                      selectedSize={selectedSize}
                    />
                    {/* Drag hint */}
                    <div className="absolute bottom-4 right-4 flex items-center gap-2 pointer-events-none z-20">
                      <RotateCcw size={13} className="text-[#9CA3AF]" />
                      <span className="text-[10px] text-[#9CA3AF] tracking-[0.2em] uppercase">Drag to rotate</span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="car"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="absolute inset-0 z-10"
                  >
                    <CarScene
                      accentColor={tyre.accentColor}
                      rimColor={rim.color}
                      rimRoughness={rim.roughness}
                      rimLabel={rim.label}
                      size={selectedSize}
                      tyreName={tyre.sub}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Performance data */}
            <div className="border-t border-[#E5E7EB] p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeType}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-px h-10 shrink-0" style={{ background: tyre.accentColor }} />
                    <div>
                      <div className="text-[18px] font-bold text-[#0A0A14] tracking-tight">{tyre.sub}</div>
                      <div className="text-[13px] text-[#6B7280] mt-0.5">{tyre.tag}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-10 gap-y-3">
                    <RatingBar label="Grip"    value={tyre.rating.grip}    color={tyre.accentColor} />
                    <RatingBar label="Wet"     value={tyre.rating.wet}     color={tyre.accentColor} />
                    <RatingBar label="Comfort" value={tyre.rating.comfort} color={tyre.accentColor} />
                    <RatingBar label="Wear"    value={tyre.rating.wear}    color={tyre.accentColor} />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
