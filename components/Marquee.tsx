"use client";

import { motion } from "framer-motion";

const items = [
  "Performance Engineered",
  "50+ Countries",
  "Precision Grip",
  "Race-Proven Tech",
  "2M+ Tyres Sold",
  "All-Terrain Ready",
  "Nano-Grip Compound",
  "Zero Compromise",
];

export default function Marquee() {
  const repeated = [...items, ...items, ...items];

  return (
    <div className="bg-[#CC0000] py-4 overflow-hidden select-none">
      <motion.div
        className="flex gap-0 whitespace-nowrap"
        animate={{ x: ["0%", "-33.333%"] }}
        transition={{ duration: 22, ease: "linear", repeat: Infinity }}
      >
        {repeated.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-6 px-6 text-[11px] font-bold tracking-[0.28em] uppercase text-white"
          >
            {item}
            <span className="text-white/40 text-[8px]">●</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
