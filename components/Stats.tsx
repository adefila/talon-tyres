"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: "35+", label: "Years of Engineering Excellence" },
  { value: "2M+", label: "Tyres Delivered Worldwide" },
  { value: "50+", label: "Countries & Growing" },
  { value: "99.4%", label: "Customer Satisfaction Rate" },
];

export default function Stats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section ref={ref} className="bg-[#0D0F1C] py-16 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="bg-[#0D0F1C] px-8 py-10 group hover:bg-[#CC0000] transition-colors duration-300"
            >
              <div className="text-[42px] lg:text-[52px] font-black text-white leading-none mb-2">
                {s.value}
              </div>
              <div className="text-[11px] tracking-widest uppercase text-white/50 font-medium group-hover:text-white/80 transition-colors">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
