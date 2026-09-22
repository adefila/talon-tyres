"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease } },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-[#0A0A14] overflow-hidden pt-[72px]">

      {/* ── Background tyre — fills the right half ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease }}
        className="absolute inset-0 flex items-center justify-end pointer-events-none select-none"
        aria-hidden="true"
      >
        {/* Tyre SVG — oversized so it bleeds off screen */}
        <svg
          viewBox="0 0 500 500"
          className="w-[700px] h-[700px] lg:w-[820px] lg:h-[820px] translate-x-[20%] lg:translate-x-[15%]"
          fill="none"
        >
          {/* Subtle outer glow ring */}
          <circle cx="250" cy="250" r="245" fill="none" stroke="#CC0000" strokeWidth="0.5" opacity="0.15" />

          {/* Outer tyre body */}
          <circle cx="250" cy="250" r="238" fill="#111215" stroke="#1C1C22" strokeWidth="2" />

          {/* Tread blocks — 24 blocks around the circumference */}
          {Array.from({ length: 24 }).map((_, i) => (
            <g key={i} transform={`rotate(${i * 15} 250 250)`}>
              <rect x="238" y="12" width="24" height="38" rx="5" fill="#191920" stroke="#242430" strokeWidth="1" />
              <rect x="240" y="15" width="9" height="30" rx="2.5" fill="#202028" />
              <rect x="251" y="15" width="8" height="30" rx="2.5" fill="#1C1C24" />
            </g>
          ))}

          {/* Sidewall ring */}
          <circle cx="250" cy="250" r="188" fill="#0E0E15" stroke="#1A1A22" strokeWidth="1.5" />

          {/* Rim outer */}
          <circle cx="250" cy="250" r="168" fill="#161620" stroke="#222230" strokeWidth="2" />

          {/* 5 spokes */}
          {Array.from({ length: 5 }).map((_, i) => (
            <g key={i} transform={`rotate(${i * 72} 250 250)`}>
              <path
                d="M242 82 L250 68 L258 82 L266 210 L250 218 L234 210 Z"
                fill="#1E1E28"
                stroke="#2A2A38"
                strokeWidth="1"
              />
              {/* Spoke highlight line */}
              <line x1="250" y1="72" x2="250" y2="208" stroke="#CC0000" strokeWidth="0.6" opacity="0.3" />
            </g>
          ))}

          {/* Between-spoke fill */}
          {Array.from({ length: 5 }).map((_, i) => (
            <path
              key={`fill-${i}`}
              transform={`rotate(${i * 72} 250 250)`}
              d="M258 82 L266 210 A168 168 0 0 1 234 210 L242 82 Z"
              fill="#141418"
              opacity="0.7"
            />
          ))}

          {/* Center hub */}
          <circle cx="250" cy="250" r="52" fill="#131318" stroke="#1E1E28" strokeWidth="2" />
          <circle cx="250" cy="250" r="40" fill="#181820" stroke="#282835" strokeWidth="1" />

          {/* TALON text on hub */}
          <text
            x="250"
            y="255"
            fill="#CC0000"
            opacity="0.7"
            fontSize="11"
            fontWeight="800"
            textAnchor="middle"
            letterSpacing="4"
            fontFamily="Space Grotesk, sans-serif"
          >
            TALON
          </text>

          {/* Subtle ambient reflection */}
          <ellipse cx="180" cy="150" rx="55" ry="28" fill="white" opacity="0.025" />

          {/* Sidewall text arc — decorative */}
          <defs>
            <path id="arc-top" d="M 250,250 m -145,0 a 145,145 0 1,1 290,0" />
          </defs>
          <text fontSize="7" fill="#ffffff" opacity="0.12" letterSpacing="6" fontFamily="Space Grotesk, sans-serif" fontWeight="600">
            <textPath href="#arc-top" startOffset="5%">
              PRO GT · PERFORMANCE SERIES · 245/45 R18 · ALL TERRAIN ·
            </textPath>
          </text>
        </svg>
      </motion.div>

      {/* ── Gradient overlay — left readability, bottom fade ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(105deg, #0A0A14 38%, #0A0A1488 60%, transparent 78%), linear-gradient(to top, #0A0A14 0%, transparent 30%)",
        }}
        aria-hidden="true"
      />

      {/* ── Red accent vertical line — left edge ── */}
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.3, ease }}
        style={{ transformOrigin: "top" }}
        className="absolute left-0 top-[72px] bottom-0 w-[3px] bg-gradient-to-b from-[#CC0000] via-[#CC0000] to-transparent"
        aria-hidden="true"
      />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-8 lg:px-16 min-h-[calc(100vh-72px)] flex flex-col justify-center">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="max-w-[620px]"
        >
          {/* Badge row */}
          <motion.div variants={fadeUp} className="flex items-center gap-4 mb-10">
            <span className="bg-[#CC0000] text-white text-[10px] font-bold tracking-[0.22em] uppercase px-3.5 py-1.5">
              New Arrival
            </span>
            <span className="w-px h-4 bg-white/20" />
            <a
              href="#products"
              className="group flex items-center gap-2 text-[11px] font-medium text-white/40 hover:text-white/70 transition-colors tracking-[0.1em]"
            >
              20% off in store near you
              <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
            </a>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-[56px] sm:text-[68px] lg:text-[82px] font-bold uppercase leading-[0.95] tracking-[-0.025em] text-white mb-8"
          >
            Tires Built
            <br />
            <span className="text-[#CC0000]">for Every</span>
            <br />
            Turn.
          </motion.h1>

          {/* Divider + sub */}
          <motion.div variants={fadeUp} className="flex items-start gap-5 mb-12 max-w-[480px]">
            <div className="w-px h-16 bg-[#CC0000] shrink-0 mt-0.5" />
            <p className="text-[15px] text-white/50 leading-relaxed">
              Experience power, control, and safety with every mile. TALON tyres
              are crafted for the road ahead — whether it&apos;s a daily
              commute or a rugged expedition.
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3 mb-16">
            <a
              href="#products"
              className="group inline-flex items-center gap-2.5 bg-[#CC0000] text-white text-[11px] font-bold tracking-[0.15em] uppercase px-8 py-4 hover:bg-white hover:text-[#CC0000] transition-colors duration-200"
            >
              Explore Products
              <span className="text-[10px] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
            </a>
            <a
              href="#reviews"
              className="inline-flex items-center gap-2.5 border border-white/20 text-white text-[11px] font-semibold tracking-[0.15em] uppercase px-8 py-4 hover:border-white hover:bg-white/5 transition-colors duration-200"
            >
              Read Reviews
            </a>
          </motion.div>

          {/* Trust strip */}
          <motion.div variants={fadeUp} className="flex items-center gap-10">
            {[
              { val: "50+", label: "Countries" },
              { val: "2M+", label: "Tyres Sold" },
              { val: "4.9★", label: "Avg Rating" },
            ].map((s, i) => (
              <div key={s.label} className="flex items-center gap-10">
                {i > 0 && <div className="w-px h-8 bg-white/15" />}
                <div>
                  <div className="text-[28px] font-bold text-white leading-none tracking-tight">{s.val}</div>
                  <div className="text-[10px] font-medium tracking-[0.2em] uppercase text-white/30 mt-1">{s.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ── Bottom info strip ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6, ease }}
        className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/10"
      >
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16 flex items-stretch divide-x divide-white/10">
          {["Performance", "All-Season", "Off-Road"].map((t) => (
            <a
              key={t}
              href="#products"
              className="flex-1 text-center py-4 text-[10px] font-semibold tracking-[0.2em] uppercase text-white/25 hover:text-white/60 hover:bg-white/[0.03] transition-colors"
            >
              {t}
            </a>
          ))}
          {/* Featured tag */}
          <div className="hidden lg:flex items-center gap-3 px-8 shrink-0">
            <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-white/25">Featured</span>
            <span className="w-px h-3 bg-white/20" />
            <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-white/25">Talon Pro GT</span>
          </div>
        </div>
      </motion.div>

      {/* ── Scroll hint ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.5 }}
        className="absolute right-8 lg:right-16 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-3"
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-transparent via-white/20 to-transparent"
        />
        <span
          className="text-[9px] tracking-[0.3em] uppercase text-white/20 font-medium"
          style={{ writingMode: "vertical-rl" }}
        >
          Scroll
        </span>
      </motion.div>
    </section>
  );
}
