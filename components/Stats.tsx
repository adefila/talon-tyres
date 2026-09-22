"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const stats = [
  { val: "35+", label: "Years of\nEngineering Excellence", desc: "Founded 1989 in Stuttgart, Germany." },
  { val: "2M+", label: "Tyres\nDelivered Worldwide", desc: "Across passenger, commercial and motorsport." },
  { val: "50+", label: "Countries\n& Growing", desc: "A global distribution network." },
  { val: "99.4%", label: "Customer\nSatisfaction Rate", desc: "Based on 12,000+ verified reviews." },
];

export default function Stats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <section ref={ref} className="bg-[#0A0A0A] overflow-hidden">
      {/* Top label row */}
      <div className="max-w-[1400px] mx-auto px-8 lg:px-16 pt-20 pb-10 flex items-end justify-between gap-6 border-b border-white/[0.06]">
        <motion.span
          initial={{ opacity: 0, x: -16 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          className="text-[10px] font-semibold tracking-[0.3em] uppercase text-white/25"
        >
          By the Numbers
        </motion.span>
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.6, ease }}
          className="flex items-center gap-3"
        >
          <div className="w-8 h-px bg-white/10" />
          <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-white/20">
            Talon Performance Report 2024
          </span>
        </motion.div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/[0.06]">
        {stats.map((s, i) => (
          <motion.div
            key={s.val}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.7, ease }}
            className="group px-10 py-14 relative overflow-hidden hover:bg-white/[0.02] transition-colors duration-500"
          >
            {/* Background number watermark */}
            <span className="absolute -bottom-4 -right-2 text-[120px] font-black text-white/[0.02] leading-none select-none pointer-events-none">
              {i + 1}
            </span>

            <div className="text-[clamp(48px,4vw,72px)] font-bold text-white leading-none tracking-[-0.03em] mb-4">
              {s.val}
            </div>
            <div className="text-[12px] font-medium text-white/40 leading-snug mb-3 whitespace-pre-line tracking-wide">
              {s.label}
            </div>
            <div className="w-6 h-px bg-[#CC0000] mb-3 group-hover:w-12 transition-all duration-300" />
            <div className="text-[11px] text-white/20 leading-relaxed">{s.desc}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
