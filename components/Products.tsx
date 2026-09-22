"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const products = [
  {
    id: "01",
    name: "Talon Pro GT",
    category: "Performance",
    tagline: "Track-grade grip for the street.",
    specs: ["245/45 R18", "295/30 R20", "225/40 R19"],
    highlight: "Ultra-high performance summer tyre built for speed and precision handling.",
    badge: "Bestseller",
    color: "#CC0000",
  },
  {
    id: "02",
    name: "Talon AllRoad",
    category: "All-Season",
    tagline: "One tyre. Every season.",
    specs: ["205/55 R16", "215/60 R17", "235/65 R18"],
    highlight: "Engineered for year-round versatility without compromise on safety.",
    badge: "Most Popular",
    color: "#0D0F1C",
  },
  {
    id: "03",
    name: "Talon X-Terra",
    category: "Off-Road",
    tagline: "No road? No problem.",
    specs: ["265/70 R16", "285/75 R16", "305/55 R20"],
    highlight: "Aggressive tread pattern and reinforced sidewalls for extreme terrain.",
    badge: "New",
    color: "#374151",
  },
  {
    id: "04",
    name: "Talon Ice Shield",
    category: "Winter",
    tagline: "Confidence on ice and snow.",
    specs: ["195/65 R15", "205/55 R16", "225/45 R18"],
    highlight: "Siping technology delivers superior traction in sub-zero conditions.",
    badge: null,
    color: "#1D4ED8",
  },
];

export default function Products() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <section id="products" ref={ref} className="py-24 lg:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#CC0000] mb-4 block">
              Our Collection
            </span>
            <h2 className="text-[48px] lg:text-[60px] font-black uppercase leading-[0.9] text-[#0A0A14]">
              Built for
              <br />
              <span className="italic font-black">Every Road.</span>
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-[15px] text-[#6B7280] max-w-sm leading-relaxed"
          >
            Four specialized tyre lines engineered for your specific driving conditions—from city streets to remote trails.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#E5E7EB]">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="group bg-white hover:bg-[#0D0F1C] transition-colors duration-300 cursor-pointer"
            >
              {/* Tyre visual */}
              <div className="relative h-52 overflow-hidden bg-[#F5F5F5] group-hover:bg-[#151828] transition-colors duration-300">
                <svg viewBox="0 0 280 210" className="w-full h-full" fill="none">
                  <rect width="280" height="210" fill={`${p.color}10`} />
                  <circle cx="140" cy="105" r="80" fill={`${p.color}20`} stroke={`${p.color}40`} strokeWidth="2" />
                  <circle cx="140" cy="105" r="60" fill={`${p.color}15`} stroke={`${p.color}30`} strokeWidth="1.5" />
                  {Array.from({ length: 12 }).map((_, j) => (
                    <g key={j} transform={`rotate(${j * 30} 140 105)`}>
                      <rect x="132" y="24" width="16" height="22" rx="3" fill={p.color} opacity="0.6" />
                    </g>
                  ))}
                  <circle cx="140" cy="105" r="35" fill={`${p.color}25`} stroke={`${p.color}50`} strokeWidth="2" />
                  {Array.from({ length: 5 }).map((_, j) => (
                    <g key={j} transform={`rotate(${j * 72} 140 105)`}>
                      <rect x="136" y="70" width="8" height="35" rx="3" fill={p.color} opacity="0.7" />
                    </g>
                  ))}
                  <circle cx="140" cy="105" r="14" fill={p.color} opacity="0.5" />
                  <text x="140" y="109" fill="white" fontSize="7" textAnchor="middle" fontWeight="bold" fontFamily="Arial" letterSpacing="1">TALON</text>
                  {/* ID */}
                  <text x="24" y="196" fill={`${p.color}40`} fontSize="48" fontWeight="900" fontFamily="Arial">{p.id}</text>
                </svg>
                {p.badge && (
                  <div
                    className="absolute top-4 right-4 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1"
                    style={{ background: p.color, color: "white" }}
                  >
                    {p.badge}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-6">
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#CC0000] mb-2 block group-hover:text-[#ff4444] transition-colors">
                  {p.category}
                </span>
                <h3 className="text-[20px] font-black uppercase text-[#0A0A14] group-hover:text-white transition-colors mb-1">
                  {p.name}
                </h3>
                <p className="text-[13px] text-[#6B7280] group-hover:text-white/50 transition-colors mb-4">
                  {p.tagline}
                </p>
                <p className="text-[12px] text-[#6B7280] group-hover:text-white/40 transition-colors mb-5 leading-relaxed">
                  {p.highlight}
                </p>

                {/* Sizes */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {p.specs.map((s) => (
                    <span
                      key={s}
                      className="text-[10px] font-mono font-semibold px-2 py-1 border border-[#E5E7EB] group-hover:border-white/20 text-[#6B7280] group-hover:text-white/40 transition-colors"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <a
                  href="#contact"
                  className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-[#0A0A14] group-hover:text-white transition-colors"
                >
                  View Specs
                  <svg className="w-3.5 h-3.5 -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
