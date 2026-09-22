"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const products = [
  {
    id: "01",
    name: "Talon Pro GT",
    category: "Performance",
    tagline: "Track-grade grip for the street.",
    specs: ["245/45 R18", "295/30 R20", "225/40 R19"],
    stat: { val: "18%", label: "More Wet Grip" },
    badge: "Bestseller",
    color: "#CC0000",
    dark: true,
  },
  {
    id: "02",
    name: "Talon AllRoad",
    category: "All-Season",
    tagline: "One tyre. Every season.",
    specs: ["205/55 R16", "215/60 R17", "235/65 R18"],
    stat: { val: "4 yr", label: "Tread Warranty" },
    badge: "Most Popular",
    color: "#0D0F1C",
    dark: false,
  },
  {
    id: "03",
    name: "Talon X-Terra",
    category: "Off-Road",
    tagline: "No road? No problem.",
    specs: ["265/70 R16", "285/75 R16", "305/55 R20"],
    stat: { val: "6-ply", label: "Reinforced Casing" },
    badge: "New",
    color: "#1C1C1C",
    dark: true,
  },
  {
    id: "04",
    name: "Talon Ice Shield",
    category: "Winter",
    tagline: "Confidence on ice and snow.",
    specs: ["195/65 R15", "205/55 R16", "225/45 R18"],
    stat: { val: "−40°C", label: "Operating Range" },
    badge: null,
    color: "#1A2F5E",
    dark: true,
  },
];

function TyreIcon({ color, id }: { color: string; id: string }) {
  return (
    <svg viewBox="0 0 160 160" className="w-full h-full" fill="none">
      <circle cx="80" cy="80" r="74" fill={`${color}12`} stroke={`${color}25`} strokeWidth="1.5" />
      {Array.from({ length: 16 }).map((_, i) => (
        <g key={i} transform={`rotate(${i * 22.5} 80 80)`}>
          <rect x="74" y="6" width="12" height="20" rx="3" fill={color} opacity="0.55" />
        </g>
      ))}
      <circle cx="80" cy="80" r="52" fill={`${color}10`} stroke={`${color}20`} strokeWidth="1" />
      {Array.from({ length: 5 }).map((_, i) => (
        <g key={i} transform={`rotate(${i * 72} 80 80)`}>
          <rect x="76.5" y="28" width="7" height="52" rx="3" fill={color} opacity="0.6" />
        </g>
      ))}
      <circle cx="80" cy="80" r="20" fill={`${color}18`} stroke={`${color}30`} strokeWidth="1.5" />
      <text
        x="80"
        y="83.5"
        fill={color}
        opacity="0.6"
        fontSize="6"
        fontWeight="700"
        textAnchor="middle"
        letterSpacing="2"
        fontFamily="Space Grotesk, sans-serif"
      >
        TALON
      </text>
      {/* Large faded ID */}
      <text
        x="10"
        y="152"
        fill={color}
        opacity="0.08"
        fontSize="72"
        fontWeight="900"
        fontFamily="Space Grotesk, sans-serif"
      >
        {id}
      </text>
    </svg>
  );
}

export default function Products() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <section id="products" ref={ref} className="py-24 lg:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

        {/* Section header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14 pb-14 border-b border-[#E5E7EB]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
          >
            <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-[#CC0000] mb-3 block">
              Our Collection
            </span>
            <h2 className="text-[44px] lg:text-[56px] font-bold uppercase leading-[1] tracking-[-0.02em] text-[#0A0A14]">
              Built for
              <br />
              Every Road.
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.6, ease }}
            className="flex flex-col items-start lg:items-end gap-4"
          >
            <p className="text-[14px] text-[#6B7280] max-w-sm leading-relaxed">
              Four specialized tyre lines — from city streets to remote trails.
            </p>
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 border border-[#0D0F1C] text-[#0D0F1C] text-[11px] font-semibold tracking-[0.15em] uppercase px-6 py-3 hover:bg-[#0D0F1C] hover:text-white transition-colors duration-200"
            >
              View Full Range
              <span className="text-[10px] transition-transform group-hover:translate-x-0.5">→</span>
            </a>
          </motion.div>
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.6, ease }}
              className="group relative flex flex-col border border-[#E5E7EB] hover:border-[#0D0F1C] transition-colors duration-300 cursor-pointer overflow-hidden"
            >
              {/* Card top strip */}
              <div className="h-1 w-full" style={{ background: p.color }} />

              {/* Tyre visual area */}
              <div className="relative bg-[#F8F8F8] group-hover:bg-[#0D0F1C] transition-colors duration-500 p-8 flex items-center justify-center h-[200px] overflow-hidden">
                {/* Background number */}
                <span className="absolute bottom-2 right-4 text-[80px] font-black leading-none text-[#0A0A14]/[0.04] group-hover:text-white/[0.04] transition-colors select-none">
                  {p.id}
                </span>
                <div className="w-[140px] h-[140px] relative z-10">
                  <TyreIcon color={p.color} id={p.id} />
                </div>
                {p.badge && (
                  <div
                    className="absolute top-4 left-4 text-[9px] font-bold tracking-[0.18em] uppercase px-2.5 py-1 text-white"
                    style={{ background: p.color }}
                  >
                    {p.badge}
                  </div>
                )}
              </div>

              {/* Card body */}
              <div className="flex flex-col flex-1 p-5 gap-4">
                <div>
                  <span className="text-[9px] font-semibold tracking-[0.22em] uppercase text-[#CC0000] block mb-1.5">
                    {p.category}
                  </span>
                  <h3 className="text-[18px] font-bold text-[#0A0A14] leading-tight tracking-tight">
                    {p.name}
                  </h3>
                  <p className="text-[12px] text-[#9CA3AF] mt-1">{p.tagline}</p>
                </div>

                {/* Key stat */}
                <div className="flex items-baseline gap-2 py-3 border-y border-[#F0F0F0]">
                  <span className="text-[22px] font-bold text-[#0A0A14] tracking-tight leading-none">
                    {p.stat.val}
                  </span>
                  <span className="text-[10px] font-medium text-[#9CA3AF] uppercase tracking-wide leading-tight">
                    {p.stat.label}
                  </span>
                </div>

                {/* Sizes */}
                <div className="flex flex-wrap gap-1.5">
                  {p.specs.map((s) => (
                    <span
                      key={s}
                      className="text-[9px] font-mono font-medium px-2 py-1 bg-[#F5F5F5] text-[#6B7280] tracking-wide"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* CTA — clean rectangle */}
                <a
                  href="#contact"
                  className="group/btn mt-auto flex items-center justify-between border border-[#E5E7EB] px-4 py-3 hover:border-[#0D0F1C] hover:bg-[#0D0F1C] transition-all duration-200"
                >
                  <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#0A0A14] group-hover/btn:text-white transition-colors">
                    View Specs
                  </span>
                  <span className="text-[11px] text-[#9CA3AF] group-hover/btn:text-white transition-colors">→</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
