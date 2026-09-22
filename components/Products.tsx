"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const MiniTyre = dynamic(() => import("./MiniTyre"), { ssr: false });

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const products = [
  {
    id: "01",
    name: "Talon Pro GT",
    category: "Performance",
    tagline: "Track-grade grip. Built for the street, proven on the circuit.",
    specs: ["245/45 R18", "295/30 R20", "225/40 R19"],
    stat: { val: "18%", label: "More Wet Grip" },
    badge: "Bestseller",
    accentColor: "#CC0000",
  },
  {
    id: "02",
    name: "Talon AllRoad",
    category: "All-Season",
    tagline: "One tyre. Every season, every surface, every condition.",
    specs: ["205/55 R16", "215/60 R17", "235/65 R18"],
    stat: { val: "4 yr", label: "Tread Warranty" },
    badge: "Most Popular",
    accentColor: "#1E40AF",
  },
  {
    id: "03",
    name: "Talon X-Terra",
    category: "Off-Road",
    tagline: "Reinforced 6-ply casing. Built where roads end.",
    specs: ["265/70 R16", "285/75 R16", "305/55 R20"],
    stat: { val: "6-ply", label: "Reinforced Casing" },
    badge: "New",
    accentColor: "#15803D",
  },
  {
    id: "04",
    name: "Talon Ice Shield",
    category: "Winter",
    tagline: "Biting-edge sipes engineered for confidence on ice and snow.",
    specs: ["195/65 R15", "205/55 R16", "225/45 R18"],
    stat: { val: "−40°C", label: "Operating Range" },
    badge: null,
    accentColor: "#0EA5E9",
  },
];

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
            <p className="text-[16px] text-[#6B7280] max-w-sm leading-relaxed">
              Four precision-engineered tyre lines — from city circuits to remote trails.
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
              {/* Accent strip */}
              <div className="h-1 w-full" style={{ background: p.accentColor }} />

              {/* 3D Tyre canvas area */}
              <div className="relative bg-[#0D0F1C] group-hover:bg-[#080810] transition-colors duration-500 flex items-center justify-center h-[200px] overflow-hidden">
                {/* Radial glow for tyre visibility */}
                <div
                  className="absolute inset-0 pointer-events-none z-0"
                  style={{
                    background: `radial-gradient(ellipse 65% 65% at 50% 50%, ${p.accentColor}22 0%, ${p.accentColor}0a 50%, transparent 72%)`,
                  }}
                />
                {/* Background number watermark */}
                <span className="absolute bottom-2 right-3 text-[80px] font-black leading-none text-white/[0.03] select-none">
                  {p.id}
                </span>
                <div className="w-[170px] h-[170px] relative z-10">
                  <MiniTyre accentColor={p.accentColor} />
                </div>
                {p.badge && (
                  <div
                    className="absolute top-4 left-4 text-[9px] font-bold tracking-[0.18em] uppercase px-2.5 py-1 text-white z-20"
                    style={{ background: p.accentColor }}
                  >
                    {p.badge}
                  </div>
                )}
              </div>

              {/* Card body */}
              <div className="flex flex-col flex-1 p-5 gap-4">
                <div>
                  <span className="text-[9px] font-semibold tracking-[0.22em] uppercase block mb-1.5" style={{ color: p.accentColor }}>
                    {p.category}
                  </span>
                  <h3 className="text-[20px] font-bold text-[#0A0A14] leading-tight tracking-tight">
                    {p.name}
                  </h3>
                  <p className="text-[14px] text-[#9CA3AF] mt-1 leading-relaxed">{p.tagline}</p>
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

                {/* CTA */}
                <a
                  href="#configure"
                  className="group/btn mt-auto flex items-center justify-between border border-[#E5E7EB] px-4 py-3 hover:border-[#0D0F1C] hover:bg-[#0D0F1C] transition-all duration-200"
                >
                  <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#0A0A14] group-hover/btn:text-white transition-colors">
                    Configure
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
