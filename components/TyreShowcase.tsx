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
    headline: "18% More Wet Grip.",
    body: "Proprietary silica-rich tread bonds to micro-surface irregularities. Stops shorter, corners harder — rain or shine.",
    stat: { val: "18%", label: "More Wet Grip vs. Category Average" },
    accentColor: "#CC0000",
  },
  {
    num: "02",
    title: "StressTech Casing",
    headline: "Built for the Long Haul.",
    body: "Multi-ply high-tensile steel belt structure absorbs lateral forces at high speed without compromising ride quality.",
    stat: { val: "6-ply", label: "High-Tensile Belt Construction" },
    accentColor: "#1E40AF",
  },
  {
    num: "03",
    title: "ThermalGuard Sidewall",
    headline: "30% Longer Service Life.",
    body: "Heat-dissipating sidewall compound prevents thermal runaway in high-load applications. Engineered for the long haul.",
    stat: { val: "30%", label: "Extended Service Life" },
    accentColor: "#15803D",
  },
  {
    num: "04",
    title: "AquaChannel Tread",
    headline: "8L Water Cleared Per Second.",
    body: "Asymmetric circumferential grooves evacuate water at highway speed. Aquaplaning risk eliminated — not just reduced.",
    stat: { val: "8L/s", label: "Water Evacuation at 100km/h" },
    accentColor: "#0EA5E9",
  },
];

export default function TyreShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  /* Map scroll progress to feature index */
  const handleScroll = () => {
    const p = scrollYProgress.get();
    const idx = Math.min(Math.floor(p * features.length), features.length - 1);
    if (idx !== activeIndex) setActiveIndex(idx);
  };

  scrollYProgress.on("change", (p) => {
    const idx = Math.min(Math.floor(p * features.length), features.length - 1);
    setActiveIndex(idx);
  });

  /* Tyre horizontal position: slides left→right across features */
  const tyreX = useTransform(scrollYProgress, [0, 1], ["0%", "5%"]);

  const active = features[activeIndex];

  return (
    <section ref={containerRef} className="relative bg-[#0A0A14]" style={{ height: `${features.length * 100}vh` }}>

      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">

        {/* Background accent glow */}
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 50% at 65% 50%, ${active.accentColor}18, transparent 70%)`,
          }}
        />

        {/* Progress bar (left edge) */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-white/5">
          <motion.div
            className="w-full bg-[#CC0000]"
            style={{ height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
          />
        </div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-16 w-full grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT: Text panel */}
          <div className="relative z-10">

            {/* Step dots */}
            <div className="flex items-center gap-2 mb-8">
              {features.map((_, i) => (
                <div
                  key={i}
                  className="h-[3px] transition-all duration-500"
                  style={{
                    width: i === activeIndex ? "28px" : "8px",
                    background: i === activeIndex ? active.accentColor : "rgba(255,255,255,0.2)",
                  }}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.55, ease }}
              >
                <span
                  className="text-[11px] font-black tracking-[0.2em] uppercase mb-3 block"
                  style={{ color: active.accentColor }}
                >
                  {active.num} / {active.title}
                </span>
                <h2 className="text-[48px] lg:text-[64px] font-bold uppercase leading-[1] tracking-[-0.03em] text-white mb-6">
                  {active.headline}
                </h2>
                <div className="flex items-start gap-4 mb-8 max-w-[460px]">
                  <div className="w-px h-14 shrink-0 mt-1" style={{ background: active.accentColor }} />
                  <p className="text-[16px] text-white/60 leading-relaxed">
                    {active.body}
                  </p>
                </div>
                <div className="inline-flex items-baseline gap-3">
                  <span className="text-[52px] font-black leading-none tracking-tight" style={{ color: active.accentColor }}>
                    {active.stat.val}
                  </span>
                  <span className="text-[12px] text-white/40 uppercase tracking-[0.15em] font-medium leading-tight max-w-[140px]">
                    {active.stat.label}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT: 3D Tyre */}
          <motion.div
            className="relative h-[420px] lg:h-[520px]"
            style={{ x: tyreX }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.04 }}
                transition={{ duration: 0.5, ease }}
                className="absolute inset-0"
              >
                <ConfiguratorScene
                  accentColor={active.accentColor}
                  rimColor="#C0C8D8"
                  rimRoughness={0.12}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>

        </div>

        {/* Bottom: scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            className="w-px h-8 bg-gradient-to-b from-transparent via-white/20 to-transparent"
          />
          <span className="text-[9px] tracking-[0.3em] uppercase text-white/25 font-medium">
            Scroll to explore
          </span>
        </div>

      </div>
    </section>
  );
}
