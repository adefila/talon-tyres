"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const outlets = [
  { name: "Motor Trend",   tagline: "\"Best Performance Tyre of the Year\"" },
  { name: "Top Gear",      tagline: "\"Phenomenal grip, brutal honesty\"" },
  { name: "Auto Express",  tagline: "\"5-Star Award — Outstanding Value\"" },
  { name: "Car & Driver",  tagline: "\"Sets the new benchmark for wet grip\"" },
  { name: "Evo",           tagline: "\"Sharpest dynamics in its class\"" },
  { name: "What Car?",     tagline: "\"Recommended for all-season drivers\"" },
];

export default function PressLogos() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <section ref={ref} className="py-16 bg-white border-t border-b border-[#E5E7EB]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease }}
          className="text-center mb-10"
        >
          <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-[#9CA3AF]">
            As Seen In
          </span>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-[#E5E7EB]">
          {outlets.map((outlet, i) => (
            <motion.div
              key={outlet.name}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.06, duration: 0.5, ease }}
              className="group bg-white px-5 py-7 flex flex-col items-center justify-center gap-2 hover:bg-[#F8F8FA] transition-colors cursor-default"
            >
              <span className="text-[16px] font-black text-[#0A0A14] tracking-tight leading-tight text-center group-hover:text-[#CC0000] transition-colors">
                {outlet.name}
              </span>
              <span className="text-[10px] text-[#9CA3AF] leading-snug text-center font-medium italic hidden sm:block">
                {outlet.tagline}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.45, duration: 0.6, ease }}
          className="mt-8 flex justify-center"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-[#E5E7EB]" />
            <span className="text-[11px] text-[#9CA3AF] tracking-[0.15em] uppercase font-medium">
              Trusted by 2 million+ drivers
            </span>
            <div className="w-8 h-px bg-[#E5E7EB]" />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
