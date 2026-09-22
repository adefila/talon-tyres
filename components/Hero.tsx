"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const tyreRotate = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const tyreScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <section ref={ref} className="relative h-screen min-h-[700px] max-h-[1100px] overflow-hidden bg-[#080808]">

      {/* ─── Background: grain texture overlay ─── */}
      <div
        className="absolute inset-0 z-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* ─── Tyre: full-bleed right panel ─── */}
      <motion.div
        style={{ rotate: tyreRotate, scale: tyreScale }}
        className="absolute right-[-8vw] top-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] z-10"
      >
        {/* Red ambient glow */}
        <div className="absolute inset-[10%] rounded-full bg-[#CC0000] blur-[120px] opacity-[0.18]" />
        <div className="absolute inset-[20%] rounded-full bg-[#CC0000] blur-[60px] opacity-[0.12]" />

        <svg viewBox="0 0 800 800" className="w-full h-full" fill="none">
          {/* Outer tyre body */}
          <circle cx="400" cy="400" r="390" fill="#0F0F0F" stroke="#1A1A1A" strokeWidth="1" />

          {/* Tread pattern — outer ring */}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 360) / 24;
            return (
              <g key={i} transform={`rotate(${angle} 400 400)`}>
                <rect x="383" y="10" width="34" height="52" rx="6" fill="#161616" stroke="#222" strokeWidth="1" />
                <rect x="385" y="14" width="13" height="44" rx="3" fill="#1C1C1C" />
                <rect x="401" y="14" width="13" height="44" rx="3" fill="#181818" />
                {/* Sipe lines */}
                <line x1="388" y1="22" x2="388" y2="52" stroke="#252525" strokeWidth="0.8" />
                <line x1="392" y1="22" x2="392" y2="52" stroke="#252525" strokeWidth="0.8" />
                <line x1="396" y1="22" x2="396" y2="52" stroke="#252525" strokeWidth="0.8" />
                <line x1="403" y1="22" x2="403" y2="52" stroke="#252525" strokeWidth="0.8" />
                <line x1="408" y1="22" x2="408" y2="52" stroke="#252525" strokeWidth="0.8" />
                <line x1="412" y1="22" x2="412" y2="52" stroke="#252525" strokeWidth="0.8" />
              </g>
            );
          })}

          {/* Inner tread shoulder blocks */}
          {Array.from({ length: 32 }).map((_, i) => {
            const angle = (i * 360) / 32;
            return (
              <g key={i} transform={`rotate(${angle} 400 400)`}>
                <rect x="388" y="68" width="24" height="16" rx="3" fill="#141414" stroke="#202020" strokeWidth="0.5" />
              </g>
            );
          })}

          {/* Sidewall */}
          <circle cx="400" cy="400" r="305" fill="#0A0A0A" />

          {/* Brand text on sidewall arc */}
          <defs>
            <path id="arcTop" d="M 120,400 A 280,280 0 0,1 680,400" />
            <path id="arcBot" d="M 155,400 A 245,245 0 0,0 645,400" />
          </defs>
          <text fill="#1E1E1E" fontSize="18" fontWeight="700" letterSpacing="14" fontFamily="Space Grotesk, sans-serif">
            <textPath href="#arcTop" startOffset="12%">TALON · ENGINEERED FOR EVERY TURN ·</textPath>
          </text>
          <text fill="#1A1A1A" fontSize="12" fontWeight="500" letterSpacing="8" fontFamily="Space Grotesk, sans-serif">
            <textPath href="#arcBot" startOffset="14%">PERFORMANCE · ALL-SEASON · OFF-ROAD · WINTER</textPath>
          </text>

          {/* Rim outer ring */}
          <circle cx="400" cy="400" r="240" fill="#111" stroke="#222" strokeWidth="2" />

          {/* Rim spoke shadows */}
          {Array.from({ length: 5 }).map((_, i) => (
            <g key={i} transform={`rotate(${i * 72} 400 400)`}>
              <ellipse cx="400" cy="220" rx="28" ry="90" fill="#080808" opacity="0.6" />
            </g>
          ))}

          {/* Spokes — 5 double-spoke */}
          {Array.from({ length: 5 }).map((_, i) => (
            <g key={i} transform={`rotate(${i * 72} 400 400)`}>
              {/* Left spoke */}
              <path
                d="M 388 160 L 380 400 L 390 400 L 395 160 Z"
                fill="#1C1C1C"
                stroke="#2A2A2A"
                strokeWidth="0.5"
              />
              {/* Right spoke */}
              <path
                d="M 412 160 L 420 400 L 410 400 L 405 160 Z"
                fill="#1A1A1A"
                stroke="#282828"
                strokeWidth="0.5"
              />
              {/* Spoke highlight */}
              <path
                d="M 393 160 L 391 400 L 393 400 L 395 160 Z"
                fill="white"
                opacity="0.025"
              />
            </g>
          ))}

          {/* Center hub cap */}
          <circle cx="400" cy="400" r="80" fill="#0D0D0D" stroke="#222" strokeWidth="2" />
          <circle cx="400" cy="400" r="65" fill="#111" stroke="#1E1E1E" strokeWidth="1" />
          <circle cx="400" cy="400" r="50" fill="#0A0A0A" stroke="#181818" strokeWidth="1.5" />

          {/* Hub bolts */}
          {Array.from({ length: 5 }).map((_, i) => (
            <g key={i} transform={`rotate(${i * 72} 400 400)`}>
              <circle cx="400" cy="360" r="7" fill="#141414" stroke="#222" strokeWidth="1" />
              <circle cx="400" cy="360" r="3" fill="#1A1A1A" />
            </g>
          ))}

          {/* TALON wordmark on hub */}
          <text
            x="400"
            y="405"
            fill="#303030"
            fontSize="14"
            fontWeight="700"
            textAnchor="middle"
            letterSpacing="5"
            fontFamily="Space Grotesk, sans-serif"
          >
            TALON
          </text>

          {/* Rim reflection highlight */}
          <ellipse cx="310" cy="260" rx="60" ry="25" fill="white" opacity="0.025" transform="rotate(-30 310 260)" />
          <ellipse cx="490" cy="540" rx="40" ry="18" fill="white" opacity="0.015" transform="rotate(-30 490 540)" />
        </svg>
      </motion.div>

      {/* ─── Left gradient fade over tyre ─── */}
      <div className="absolute inset-y-0 left-0 w-[55%] z-20 bg-gradient-to-r from-[#080808] via-[#080808]/90 to-transparent pointer-events-none" />
      {/* Top/bottom vignette */}
      <div className="absolute inset-x-0 top-0 h-32 z-20 bg-gradient-to-b from-[#080808] to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-40 z-20 bg-gradient-to-t from-[#080808] to-transparent pointer-events-none" />

      {/* ─── Content ─── */}
      <motion.div
        style={{ y: textY }}
        className="relative z-30 h-full max-w-[1400px] mx-auto px-8 lg:px-16 flex flex-col justify-center"
      >
        <div className="max-w-[600px]">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="w-8 h-px bg-[#CC0000]" />
            <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-white/40">
              New Season Collection
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(52px,6vw,96px)] font-bold text-white leading-[0.95] tracking-[-0.03em] mb-8"
          >
            Tires Built<br />
            for Every<br />
            <span className="text-[#CC0000]">Turn.</span>
          </motion.h1>

          {/* Body */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-[15px] text-white/40 leading-relaxed max-w-[380px] mb-10"
          >
            Power, control, and safety with every mile — crafted for the daily commute and the rugged expedition alike.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.62, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center gap-4"
          >
            <a
              href="#products"
              className="group relative overflow-hidden inline-flex items-center gap-3 bg-[#CC0000] text-white text-[11px] font-semibold tracking-[0.18em] uppercase px-8 py-4"
            >
              <span className="relative z-10">Explore Products</span>
              <span className="relative z-10 text-[10px] transition-transform duration-300 group-hover:translate-x-1">→</span>
              <span className="absolute inset-0 bg-white translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
              <span className="absolute inset-0 text-[#CC0000] group-hover:text-[#CC0000] flex items-center justify-center gap-3 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-out text-[11px] font-semibold tracking-[0.18em] uppercase">
                Explore Products <span className="text-[10px]">→</span>
              </span>
            </a>
            <a
              href="#reviews"
              className="inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.18em] uppercase text-white/40 border border-white/10 px-8 py-4 hover:border-white/30 hover:text-white/70 transition-all duration-200"
            >
              Our Reviews
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* ─── Bottom info bar ─── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-0 inset-x-0 z-30 border-t border-white/[0.06]"
      >
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16 grid grid-cols-3 lg:grid-cols-6 divide-x divide-white/[0.06]">
          {[
            { val: "35+", label: "Years" },
            { val: "2M+", label: "Tyres" },
            { val: "50+", label: "Countries" },
            { val: "4.9", label: "Rating" },
            { val: "4", label: "Collections" },
            { val: "99%", label: "Satisfaction" },
          ].map((s) => (
            <div key={s.label} className="py-5 px-6 flex flex-col gap-0.5">
              <span className="text-[18px] font-bold text-white leading-none tracking-tight">{s.val}</span>
              <span className="text-[9px] font-medium tracking-[0.2em] uppercase text-white/25">{s.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
