"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const products = [
  {
    id: "01",
    name: "Talon Pro GT",
    category: "Performance",
    tagline: "Track-grade grip, refined for the street.",
    description:
      "Ultra-high performance summer compound engineered in partnership with motorsport. Wet braking distances reduced by up to 18% vs. category average.",
    specs: ["245/45 R18", "295/30 R20", "225/40 R19"],
    stat: { val: "18%", label: "More Wet Grip" },
    badge: "Bestseller",
    accent: "#CC0000",
    featured: true,
  },
  {
    id: "02",
    name: "Talon AllRoad",
    category: "All-Season",
    tagline: "One tyre. Every season.",
    description:
      "Engineered for year-round versatility without compromise. All-weather certified. Backed by a 4-year tread warranty.",
    specs: ["205/55 R16", "215/60 R17", "235/65 R18"],
    stat: { val: "4yr", label: "Warranty" },
    badge: "Most Popular",
    accent: "#374151",
    featured: false,
  },
  {
    id: "03",
    name: "Talon X-Terra",
    category: "Off-Road",
    tagline: "No road? No problem.",
    description:
      "6-ply reinforced casing, aggressive lug tread, and self-cleaning shoulder blocks for any terrain you choose to challenge.",
    specs: ["265/70 R16", "285/75 R16", "305/55 R20"],
    stat: { val: "6-ply", label: "Casing" },
    badge: "New",
    accent: "#1C1C1C",
    featured: false,
  },
  {
    id: "04",
    name: "Talon Ice Shield",
    category: "Winter",
    tagline: "Confidence on ice and snow.",
    description:
      "3D siping technology and a specialized compound engineered to stay pliable and grip in temperatures as low as −40°C.",
    specs: ["195/65 R15", "205/55 R16", "225/45 R18"],
    stat: { val: "−40°C", label: "Rated" },
    badge: null,
    accent: "#1A3A6E",
    featured: false,
  },
];

function TyreGraphic({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 240 240" className="w-full h-full" fill="none">
      <circle cx="120" cy="120" r="115" fill={`${accent}18`} stroke={`${accent}30`} strokeWidth="1.5" />
      {Array.from({ length: 18 }).map((_, i) => (
        <g key={i} transform={`rotate(${i * 20} 120 120)`}>
          <rect x="113" y="5" width="14" height="28" rx="4" fill={accent} opacity="0.5" />
          <rect x="114" y="8" width="5" height="22" rx="2" fill={accent} opacity="0.3" />
          <rect x="121" y="8" width="5" height="22" rx="2" fill={accent} opacity="0.25" />
        </g>
      ))}
      <circle cx="120" cy="120" r="82" fill={`${accent}10`} stroke={`${accent}20`} strokeWidth="1" />
      {Array.from({ length: 5 }).map((_, i) => (
        <g key={i} transform={`rotate(${i * 72} 120 120)`}>
          <path d="M113 38 L117 120 L123 120 L127 38 Z" fill={accent} opacity="0.55" />
        </g>
      ))}
      <circle cx="120" cy="120" r="30" fill={`${accent}20`} stroke={`${accent}35`} strokeWidth="1.5" />
      <text x="120" y="124" fill={accent} opacity="0.7" fontSize="8" fontWeight="700" textAnchor="middle" letterSpacing="2.5" fontFamily="Space Grotesk, sans-serif">TALON</text>
    </svg>
  );
}

export default function Products() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });
  const [active, setActive] = useState(0);

  const featured = products[0];
  const rest = products.slice(1);

  return (
    <section id="products" ref={ref} className="bg-white py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-8 lg:px-16">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16 pb-10 border-b border-[#E5E7EB]"
        >
          <div>
            <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#CC0000] mb-3 block">
              Our Collection
            </span>
            <h2 className="text-[clamp(38px,4.5vw,64px)] font-bold uppercase leading-[0.95] tracking-[-0.025em] text-[#0A0A14]">
              Built for<br />Every Road.
            </h2>
          </div>
          <a
            href="#contact"
            className="group self-start lg:self-end inline-flex items-center gap-3 border border-[#0A0A14] text-[#0A0A14] text-[11px] font-semibold tracking-[0.16em] uppercase px-7 py-3.5 hover:bg-[#0A0A14] hover:text-white transition-all duration-200"
          >
            View Full Range
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>
        </motion.div>

        {/* Asymmetric grid */}
        <div className="grid lg:grid-cols-[1fr_1fr] gap-6">

          {/* Featured large card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease }}
            className="group relative bg-[#0A0A14] overflow-hidden flex flex-col lg:row-span-2 cursor-pointer"
          >
            {/* Badge */}
            <div className="absolute top-6 left-6 z-10 bg-[#CC0000] text-white text-[9px] font-semibold tracking-[0.2em] uppercase px-3 py-1.5">
              {featured.badge}
            </div>

            {/* Visual */}
            <div className="relative flex-1 min-h-[360px] flex items-center justify-center overflow-hidden">
              {/* Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#CC000018_0%,_transparent_65%)]" />
              <div className="w-[300px] h-[300px] lg:w-[360px] lg:h-[360px] relative z-10 transition-transform duration-700 group-hover:scale-105">
                <TyreGraphic accent={featured.accent} />
              </div>
              {/* ID watermark */}
              <span className="absolute bottom-4 right-6 text-[100px] font-black text-white/[0.03] leading-none select-none">
                {featured.id}
              </span>
            </div>

            {/* Info */}
            <div className="p-8 border-t border-white/[0.07]">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="text-[9px] font-semibold tracking-[0.25em] uppercase text-[#CC0000] block mb-1.5">{featured.category}</span>
                  <h3 className="text-[28px] font-bold text-white tracking-tight leading-tight">{featured.name}</h3>
                  <p className="text-[13px] text-white/40 mt-1">{featured.tagline}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[28px] font-bold text-white leading-none">{featured.stat.val}</div>
                  <div className="text-[9px] font-medium tracking-[0.18em] uppercase text-white/30 mt-1">{featured.stat.label}</div>
                </div>
              </div>
              <p className="text-[13px] text-white/30 leading-relaxed mb-6">{featured.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {featured.specs.map((s) => (
                    <span key={s} className="text-[9px] font-mono font-medium px-2 py-1 bg-white/[0.06] text-white/40 tracking-wide">{s}</span>
                  ))}
                </div>
                <a href="#contact" className="group/cta flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors">
                  Specs <span className="group-hover/cta:translate-x-0.5 transition-transform">→</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Three smaller cards */}
          <div className="flex flex-col gap-6">
            {rest.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.6, ease }}
                className="group flex bg-[#F7F7F7] hover:bg-[#0A0A14] transition-colors duration-500 cursor-pointer overflow-hidden"
              >
                {/* Accent strip */}
                <div className="w-1 shrink-0" style={{ background: p.accent }} />

                {/* Tyre */}
                <div className="relative w-[130px] shrink-0 flex items-center justify-center p-4 bg-[#F0F0F0] group-hover:bg-[#0D0D1A] transition-colors duration-500">
                  <div className="w-[90px] h-[90px] transition-transform duration-500 group-hover:scale-110">
                    <TyreGraphic accent={p.accent === "#1C1C1C" ? "#888" : p.accent} />
                  </div>
                  {p.badge && (
                    <div className="absolute top-2 left-2 text-[8px] font-bold tracking-widest uppercase px-1.5 py-0.5 text-white" style={{ background: p.accent }}>
                      {p.badge}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-semibold tracking-[0.22em] uppercase text-[#CC0000] block mb-1">{p.category}</span>
                    <h3 className="text-[17px] font-bold text-[#0A0A14] group-hover:text-white transition-colors tracking-tight leading-tight">{p.name}</h3>
                    <p className="text-[12px] text-[#9CA3AF] group-hover:text-white/40 transition-colors mt-1">{p.tagline}</p>
                  </div>
                  <div className="flex items-end justify-between mt-3 pt-3 border-t border-[#E5E7EB] group-hover:border-white/[0.07] transition-colors">
                    <div>
                      <span className="text-[20px] font-bold text-[#0A0A14] group-hover:text-white transition-colors leading-none">{p.stat.val}</span>
                      <span className="text-[9px] font-medium tracking-[0.15em] uppercase text-[#9CA3AF] group-hover:text-white/30 transition-colors ml-2">{p.stat.label}</span>
                    </div>
                    <a href="#contact" className="text-[9px] font-semibold tracking-[0.2em] uppercase text-[#6B7280] group-hover:text-white/50 transition-colors">
                      View →
                    </a>
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
