"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

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
    <section id="about" ref={ref} className="py-24 lg:py-32 bg-[#F5F5F5] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#CC0000] mb-4 block">
              Engineering
            </span>
            <h2 className="text-[48px] lg:text-[58px] font-black uppercase leading-[0.9] text-[#0A0A14] mb-8">
              Science
              <br />
              Behind
              <br />
              <span className="italic">Every Grip.</span>
            </h2>
            <p className="text-[15px] text-[#6B7280] leading-relaxed max-w-md mb-10">
              Every TALON tyre starts in our R&D facility where material scientists and racing engineers collaborate to push the boundaries of what rubber, steel, and physics can achieve.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-3 bg-[#0D0F1C] text-white text-[12px] font-bold tracking-widest uppercase px-8 py-4 hover:bg-[#CC0000] transition-colors duration-200 group"
            >
              Our Technology
              <svg className="w-3.5 h-3.5 -rotate-45 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </motion.div>

          {/* Right: Feature list */}
          <div className="space-y-px bg-[#E5E7EB]">
            {features.map((f, i) => (
              <motion.div
                key={f.num}
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white hover:bg-[#0D0F1C] group transition-colors duration-300 p-8 cursor-default"
              >
                <div className="flex items-start gap-6">
                  <span className="text-[11px] font-bold tracking-widest text-[#CC0000] group-hover:text-[#ff4444] transition-colors pt-1 shrink-0">
                    {f.num}
                  </span>
                  <div>
                    <h3 className="text-[17px] font-black uppercase text-[#0A0A14] group-hover:text-white transition-colors mb-2">
                      {f.title}
                    </h3>
                    <p className="text-[13px] text-[#6B7280] group-hover:text-white/50 transition-colors leading-relaxed">
                      {f.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
