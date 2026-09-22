"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Settings2, ArrowUpRight } from "lucide-react";

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
    makes: ["BMW 3 Series", "Audi A4", "Mercedes C-Class"],
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
    makes: ["Toyota Camry", "Honda Accord", "Mazda 6"],
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
    makes: ["Ford Ranger", "Land Rover Defender", "Toyota Hilux"],
  },
  {
    id: "04",
    name: "Talon Ice Shield",
    category: "Winter",
    tagline: "Biting-edge sipes engineered for confidence on ice and snow.",
    specs: ["195/65 R15", "205/55 R16", "225/45 R18"],
    stat: { val: "-40°C", label: "Operating Range" },
    badge: null,
    accentColor: "#0EA5E9",
    makes: ["Volvo XC90", "BMW X5", "Audi Q7"],
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
              style={{ transform: "skewX(-6deg)" }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", transform: "skewX(6deg)" }}>
                View Full Range
                <ArrowUpRight size={13} />
              </span>
            </a>
          </motion.div>
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.6, ease }}
              className="group relative cursor-pointer overflow-hidden"
              style={{ height: "390px" }}
            >
              {/* Left accent bar */}
              <div
                className="absolute left-0 top-0 bottom-0 w-[3px] z-20"
                style={{ background: p.accentColor }}
              />

              {/* 3D Tyre on white background */}
              <div className="relative bg-white flex items-center justify-center overflow-hidden pl-[3px]" style={{ height: "210px" }}>
                {p.badge && (
                  <div
                    className="absolute top-3 right-3 text-[9px] font-bold tracking-[0.18em] uppercase px-2.5 py-1 text-white z-20"
                    style={{ background: p.accentColor }}
                  >
                    {p.badge}
                  </div>
                )}
                <div className="w-[185px] h-[185px] relative z-10">
                  <MiniTyre accentColor={p.accentColor} />
                </div>
              </div>

              {/* Always-visible info */}
              <div className="px-5 pt-4 pb-3 pl-6">
                <div className="flex items-center gap-2 mb-2.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: p.accentColor }}
                  />
                  <span
                    className="text-[9px] font-bold tracking-[0.24em] uppercase"
                    style={{ color: p.accentColor }}
                  >
                    {p.category}
                  </span>
                </div>
                <h3 className="text-[20px] font-bold text-[#0A0A14] leading-tight tracking-tight mb-1.5">
                  {p.name}
                </h3>
                <p className="text-[11px] text-[#6B7280] leading-snug">
                  <span className="font-semibold text-[#9CA3AF] uppercase tracking-[0.1em] text-[9px]">Fits </span>
                  {p.makes.join(" · ")}
                </p>
              </div>

              {/* Sliding overlay — slides up from bottom, fixed height */}
              <div
                className="absolute inset-x-0 bottom-0 bg-white border-t border-[#E5E7EB] px-5 pb-5 pl-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-10"
                style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
              >
                <div className="pt-4 mb-3">
                  <p className="text-[13px] text-[#374151] leading-relaxed">{p.tagline}</p>
                </div>

                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-[24px] font-black text-[#0A0A14] tracking-tight leading-none">
                    {p.stat.val}
                  </span>
                  <span className="text-[9px] font-semibold text-[#6B7280] uppercase tracking-[0.12em] leading-tight">
                    {p.stat.label}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.specs.map((s) => (
                    <span
                      key={s}
                      className="text-[9px] font-mono px-2 py-1 border border-[#E5E7EB] text-[#374151] tracking-wide"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <a
                  href="#configure"
                  className="inline-flex items-center text-white text-[10px] font-bold tracking-[0.18em] uppercase px-5 py-3 transition-opacity duration-200 hover:opacity-85"
                  style={{ background: p.accentColor, transform: "skewX(-6deg)" }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "7px", transform: "skewX(6deg)" }}>
                    <Settings2 size={12} />
                    Configure
                    <ArrowUpRight size={12} />
                  </span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
