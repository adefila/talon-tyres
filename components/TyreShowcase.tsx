"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

const ConfiguratorScene = dynamic(() => import("./ConfiguratorScene"), { ssr: false });

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const features = [
  {
    num: "01",
    title: "Nano-Grip Compound",
    headline: ["18% More", "Wet Grip."],
    body: "Proprietary silica-rich tread bonds to micro-surface irregularities. Stops shorter, corners harder — rain or shine.",
    stat: { val: "18%", label: "More Wet Grip vs. Category Average" },
    accentColor: "#CC0000",
    textSide: "right" as const,
  },
  {
    num: "02",
    title: "StressTech Casing",
    headline: ["Built for", "the Long Haul."],
    body: "Multi-ply high-tensile steel belt absorbs lateral forces at high speed without compromising ride quality.",
    stat: { val: "6-ply", label: "High-Tensile Belt Construction" },
    accentColor: "#1E40AF",
    textSide: "left" as const,
  },
  {
    num: "03",
    title: "ThermalGuard Sidewall",
    headline: ["30% Longer", "Service Life."],
    body: "Heat-dissipating sidewall compound prevents thermal runaway in high-load applications. Engineered for endurance.",
    stat: { val: "30%", label: "Extended Service Life" },
    accentColor: "#15803D",
    textSide: "right" as const,
  },
  {
    num: "04",
    title: "AquaChannel Tread",
    headline: ["8L/s Water", "Evacuated."],
    body: "Asymmetric circumferential grooves clear water at highway speed. Aquaplaning risk eliminated — not just reduced.",
    stat: { val: "8L/s", label: "Water Evacuation at 100 km/h" },
    accentColor: "#0EA5E9",
    textSide: "left" as const,
  },
];

export default function TyreShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  scrollYProgress.on("change", (p) => {
    const idx = Math.min(Math.floor(p * features.length), features.length - 1);
    setActiveIndex(idx);
  });

  /* ── Tyre: moves from far LEFT to far RIGHT across the full scroll ── */
  const tyreX = useTransform(scrollYProgress, [0, 1], ["-42%", "42%"]);
  /* Subtle vertical parallax — floats up as it travels */
  const tyreY = useTransform(scrollYProgress, [0, 0.5, 1], ["4%", "-3%", "4%"]);
  /* Slight scale pulse: larger when centred */
  const tyreScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.88, 1.05, 0.88]);

  /* ── Background ghost number: moves OPPOSITE direction at ~30% speed (parallax) ── */
  const bgNumX = useTransform(scrollYProgress, [0, 1], ["12%", "-12%"]);
  const bgNumOpacity = useTransform(scrollYProgress, [0, 0.08, 0.92, 1], [0, 1, 1, 0]);

  /* ── Background accent line: different parallax layer ── */
  const lineX = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  const active = features[activeIndex];

  return (
    <section
      ref={containerRef}
      className="relative bg-[#07070f]"
      style={{ height: `${features.length * 100}vh` }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* ── Layer 1: Parallax background ghost number ── */}
        <motion.div
          style={{ x: bgNumX, opacity: bgNumOpacity }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
          aria-hidden="true"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-[32vw] font-black leading-none tracking-tighter"
              style={{ color: active.accentColor, opacity: 0.055 }}
            >
              {active.num}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        {/* ── Layer 2: Parallax accent horizontal line (moves opposite) ── */}
        <motion.div
          style={{ x: lineX }}
          className="absolute top-1/2 left-0 right-0 pointer-events-none z-0"
          aria-hidden="true"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0, opacity: 0 }}
              transition={{ duration: 0.55, ease }}
              style={{ background: active.accentColor, transformOrigin: "left center" }}
              className="h-[1px] w-full opacity-[0.12]"
            />
          </AnimatePresence>
        </motion.div>

        {/* ── Layer 3: 3D Tyre — the main moving element ── */}
        <motion.div
          style={{ x: tyreX, y: tyreY, scale: tyreScale }}
          className="absolute inset-0 z-10 pointer-events-none"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="w-full h-full"
            >
              <ConfiguratorScene
                accentColor={active.accentColor}
                rimColor="#C0C8D8"
                rimRoughness={0.12}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* ── Layer 4: Feature text — opposite side from tyre ── */}
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center">
          <div className="max-w-[1400px] mx-auto px-8 lg:px-16 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.55, ease }}
                className={`max-w-[420px] ${
                  active.textSide === "right" ? "ml-auto" : "mr-auto"
                }`}
              >
                {/* Step indicator */}
                <div className="flex items-center gap-2 mb-6">
                  {features.map((_, i) => (
                    <div
                      key={i}
                      className="h-[2px] transition-all duration-500"
                      style={{
                        width: i === activeIndex ? "32px" : "8px",
                        background: i === activeIndex ? active.accentColor : "rgba(255,255,255,0.18)",
                      }}
                    />
                  ))}
                </div>

                <span
                  className="text-[10px] font-black tracking-[0.28em] uppercase mb-3 block"
                  style={{ color: active.accentColor }}
                >
                  {active.num} / {active.title}
                </span>

                <h2 className="text-[44px] lg:text-[58px] font-bold uppercase leading-[1.0] tracking-[-0.03em] text-white mb-5">
                  {active.headline.map((line, i) => (
                    <span key={i} className="block">{line}</span>
                  ))}
                </h2>

                <div className="flex items-start gap-3 mb-6">
                  <div
                    className="w-px h-12 shrink-0 mt-1"
                    style={{ background: active.accentColor }}
                  />
                  <p className="text-[14px] text-white/55 leading-relaxed">
                    {active.body}
                  </p>
                </div>

                <div className="flex items-baseline gap-3">
                  <span
                    className="text-[48px] font-black leading-none tracking-tight"
                    style={{ color: active.accentColor }}
                  >
                    {active.stat.val}
                  </span>
                  <span className="text-[11px] text-white/35 uppercase tracking-[0.15em] font-medium leading-tight max-w-[130px]">
                    {active.stat.label}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Progress bar (bottom) ── */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 z-30">
          <motion.div
            className="h-full"
            style={{
              width: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]),
              background: active.accentColor,
            }}
          />
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 right-8 lg:right-16 z-30 flex flex-col items-center gap-2 pointer-events-none">
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="w-px h-8 bg-gradient-to-b from-transparent via-white/20 to-transparent"
          />
          <span
            className="text-[9px] tracking-[0.3em] uppercase text-white/25 font-medium"
            style={{ writingMode: "vertical-rl" }}
          >
            Scroll
          </span>
        </div>

      </div>
    </section>
  );
}
