"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const features = [
  {
    num: "01",
    title: "Nano-Grip Compound",
    description: "Silica-rich tread compound bonds to micro-surface irregularities, delivering 18% more wet grip than the category average. Validated on track and road.",
    metric: "+18%",
    metricLabel: "Wet Grip",
  },
  {
    num: "02",
    title: "StressTech Casing",
    description: "Multi-ply high-tensile steel belt structure absorbs lateral forces at high speed while maintaining a compliant ride character on road.",
    metric: "5-ply",
    metricLabel: "Belt Construction",
  },
  {
    num: "03",
    title: "ThermalGuard Sidewall",
    description: "Heat-dissipating sidewall compound prevents thermal runaway under sustained load, extending service life by up to 23% in high-heat applications.",
    metric: "+23%",
    metricLabel: "Tyre Longevity",
  },
  {
    num: "04",
    title: "AquaChannel Tread",
    description: "Asymmetric circumferential groove architecture evacuates 8 litres of water per second at highway speeds, eliminating aquaplaning risk.",
    metric: "8L/s",
    metricLabel: "Water Evacuation",
  },
];

export default function Technology() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <section id="about" ref={ref} className="bg-[#0A0A0A] py-24 lg:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-8 lg:px-16">

        {/* Header row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 pb-12 border-b border-white/[0.06]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
          >
            <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#CC0000] mb-3 block">
              Engineering
            </span>
            <h2 className="text-[clamp(38px,4.5vw,64px)] font-bold uppercase leading-[0.95] tracking-[-0.025em] text-white">
              Science Behind<br />Every Grip.
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.12, duration: 0.6, ease }}
            className="flex flex-col gap-4 lg:items-end"
          >
            <p className="text-[14px] text-white/30 leading-relaxed max-w-sm">
              Every TALON tyre begins in our R&D facility, where material scientists and racing engineers push the limits of what rubber and physics can achieve.
            </p>
            <a
              href="#contact"
              className="group inline-flex items-center gap-3 border border-white/20 text-white text-[11px] font-semibold tracking-[0.16em] uppercase px-7 py-3.5 hover:bg-white hover:text-[#0A0A0A] transition-all duration-200"
            >
              Our Technology
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </a>
          </motion.div>
        </div>

        {/* Features — 2-column grid */}
        <div className="grid md:grid-cols-2 gap-px bg-white/[0.05]">
          {features.map((f, i) => (
            <motion.div
              key={f.num}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.09, duration: 0.6, ease }}
              className="group bg-[#0A0A0A] hover:bg-[#111] transition-colors duration-300 p-10"
            >
              <div className="flex items-start justify-between mb-6">
                <span className="text-[10px] font-semibold tracking-[0.25em] text-[#CC0000]">{f.num}</span>
                <div className="text-right">
                  <div className="text-[28px] font-bold text-white leading-none">{f.metric}</div>
                  <div className="text-[9px] font-medium tracking-[0.18em] uppercase text-white/25 mt-1">{f.metricLabel}</div>
                </div>
              </div>
              <h3 className="text-[18px] font-semibold text-white mb-3 tracking-tight">{f.title}</h3>
              <div className="w-8 h-px bg-[#CC0000] mb-4 group-hover:w-14 transition-all duration-300" />
              <p className="text-[13px] text-white/35 leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
