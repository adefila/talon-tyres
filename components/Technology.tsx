"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const features = [
  {
    num: "01",
    title: "Nano-Grip Compound",
    description:
      "Proprietary silica-rich tread compound bonds to micro-surface irregularities, delivering 18% more wet grip than industry standard.",
  },
  {
    num: "02",
    title: "StressTech Casing",
    description:
      "Multi-ply high-tensile steel belt structure withstands lateral forces at high speed while maintaining ride comfort.",
  },
  {
    num: "03",
    title: "ThermalGuard Sidewall",
    description:
      "Heat-dissipating sidewall compound prevents thermal runaway, extending tyre life in high-performance and heavy-load applications.",
  },
  {
    num: "04",
    title: "AquaChannel Tread",
    description:
      "Asymmetric circumferential grooves evacuate 8 liters of water per second, eliminating aquaplaning at highway speeds.",
  },
];

export default function Technology() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <section id="about" ref={ref} className="py-24 lg:py-32 bg-[#F7F7F7] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease }}
            className="lg:sticky lg:top-28"
          >
            <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-[#CC0000] mb-4 block">
              Engineering
            </span>
            <h2 className="text-[44px] lg:text-[54px] font-bold uppercase leading-[1] tracking-[-0.02em] text-[#0A0A14] mb-6">
              Science Behind
              <br />
              Every Grip.
            </h2>
            <div className="flex items-start gap-4 mb-10">
              <div className="w-px h-14 bg-[#CC0000] shrink-0 mt-1" />
              <p className="text-[14px] text-[#6B7280] leading-relaxed">
                Every TALON tyre starts in our R&amp;D facility where material
                scientists and racing engineers collaborate to push the
                boundaries of what rubber, steel, and physics can achieve.
              </p>
            </div>
            <a
              href="#contact"
              className="group inline-flex items-center gap-2.5 bg-[#0D0F1C] text-white text-[11px] font-semibold tracking-[0.15em] uppercase px-7 py-3.5 hover:bg-[#CC0000] transition-colors duration-200"
            >
              Our Technology
              <span className="text-[10px] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
            </a>
          </motion.div>

          {/* Right: numbered features */}
          <div className="flex flex-col divide-y divide-[#E5E7EB] border border-[#E5E7EB]">
            {features.map((f, i) => (
              <motion.div
                key={f.num}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.6, ease }}
                className="group flex gap-5 p-6 hover:bg-[#0D0F1C] transition-colors duration-300 cursor-default"
              >
                <span className="text-[10px] font-semibold tracking-[0.2em] text-[#CC0000] group-hover:text-[#ff5555] transition-colors pt-1 shrink-0 w-6">
                  {f.num}
                </span>
                <div>
                  <h3 className="text-[15px] font-semibold text-[#0A0A14] group-hover:text-white transition-colors mb-2 tracking-tight">
                    {f.title}
                  </h3>
                  <p className="text-[13px] text-[#6B7280] group-hover:text-white/50 transition-colors leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
