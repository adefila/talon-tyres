"use client";

import { motion } from "framer-motion";

const items = [
  "Performance Tyres",
  "All-Season Grip",
  "Off-Road Dominance",
  "Winter Safety",
  "35 Years of Engineering",
  "2 Million Tyres Sold",
  "50+ Countries",
  "Track Tested",
];

export default function Marquee() {
  return (
    <div className="bg-[#CC0000] py-4 overflow-hidden border-y border-[#A30000]">
      <div className="flex">
        {[0, 1].map((n) => (
          <motion.div
            key={n}
            animate={{ x: [0, "-100%"] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            className="flex shrink-0 items-center gap-0"
          >
            {items.map((item, i) => (
              <div key={i} className="flex items-center shrink-0">
                <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-white/90 whitespace-nowrap px-8">
                  {item}
                </span>
                <span className="text-white/40 text-[8px]">◆</span>
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
