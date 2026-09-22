"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.9, ease } },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-white pt-[72px] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 min-h-[calc(100vh-72px)] grid lg:grid-cols-[1fr_480px] gap-0 items-stretch">

        {/* ── Left column ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex flex-col justify-center py-16 lg:py-24 pr-0 lg:pr-16 border-r border-[#E5E7EB]"
        >
          {/* Pill badge */}
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-10">
            <span className="bg-[#CC0000] text-white text-[10px] font-semibold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full">
              New Arrival
            </span>
            <a
              href="#products"
              className="group flex items-center gap-2 text-[12px] font-medium text-[#6B7280] hover:text-[#CC0000] transition-colors"
            >
              20% off in store near you
              <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
            </a>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-[52px] sm:text-[60px] lg:text-[72px] font-bold uppercase leading-[1] tracking-[-0.02em] text-[#0A0A14] mb-6"
          >
            Tires Built
            <br />
            <span className="text-[#CC0000]">for Every</span>
            <br />
            Turn.
          </motion.h1>

          {/* Divider + sub */}
          <motion.div variants={fadeUp} className="flex items-start gap-5 mb-10 max-w-lg">
            <div className="w-px h-16 bg-[#CC0000] shrink-0 mt-1" />
            <p className="text-[15px] text-[#6B7280] leading-relaxed">
              Experience power, control, and safety with every mile. TALON tyres
              are crafted for the road ahead — whether it&apos;s a daily
              commute or a rugged expedition.
            </p>
          </motion.div>

          {/* CTAs — clean rectangles */}
          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3 mb-16">
            <a
              href="#products"
              className="group inline-flex items-center gap-2.5 bg-[#0D0F1C] text-white text-[12px] font-semibold tracking-[0.12em] uppercase px-7 py-3.5 hover:bg-[#CC0000] transition-colors duration-200"
            >
              Explore Products
              <span className="text-[10px] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
            </a>
            <a
              href="#reviews"
              className="inline-flex items-center gap-2.5 border border-[#0D0F1C] text-[#0D0F1C] text-[12px] font-semibold tracking-[0.12em] uppercase px-7 py-3.5 hover:border-[#CC0000] hover:text-[#CC0000] transition-colors duration-200"
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
                {i > 0 && <div className="w-px h-8 bg-[#E5E7EB]" />}
                <div>
                  <div className="text-[26px] font-bold text-[#0A0A14] leading-none tracking-tight">{s.val}</div>
                  <div className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#9CA3AF] mt-1">{s.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Right column — tyre visual ── */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="show"
          className="hidden lg:flex flex-col"
        >
          {/* Top tag */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-[#E5E7EB]">
            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#9CA3AF]">Featured</span>
            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#9CA3AF]">Talon Pro GT</span>
          </div>

          {/* Tyre visual */}
          <div className="flex-1 bg-[#0D0F1C] relative overflow-hidden flex items-center justify-center">
            {/* Ambient glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#CC000015_0%,_transparent_65%)]" />

            <svg viewBox="0 0 400 400" className="w-[320px] h-[320px] relative z-10" fill="none">
              {/* Outer tyre */}
              <circle cx="200" cy="200" r="190" fill="#111" stroke="#222" strokeWidth="2" />
              {/* Tread */}
              {Array.from({ length: 20 }).map((_, i) => (
                <g key={i} transform={`rotate(${i * 18} 200 200)`}>
                  <rect x="190" y="10" width="20" height="32" rx="4" fill="#1E1E1E" stroke="#2A2A2A" strokeWidth="1" />
                  <rect x="192" y="14" width="8" height="24" rx="2" fill="#282828" />
                  <rect x="202" y="14" width="6" height="24" rx="2" fill="#242424" />
                </g>
              ))}
              {/* Inner sidewall */}
              <circle cx="200" cy="200" r="148" fill="#0D0D0D" stroke="#1A1A1A" strokeWidth="1.5" />
              {/* Rim outer */}
              <circle cx="200" cy="200" r="130" fill="#1A1A1A" stroke="#2A2A2A" strokeWidth="2" />
              {/* Spokes × 5 */}
              {Array.from({ length: 5 }).map((_, i) => (
                <g key={i} transform={`rotate(${i * 72} 200 200)`}>
                  <path
                    d="M194 80 L200 70 L206 80 L210 165 L200 170 L190 165 Z"
                    fill="#242424"
                    stroke="#333"
                    strokeWidth="1"
                  />
                </g>
              ))}
              {/* Center hub */}
              <circle cx="200" cy="200" r="38" fill="#141414" stroke="#2A2A2A" strokeWidth="2" />
              <circle cx="200" cy="200" r="28" fill="#1A1A1A" stroke="#333" strokeWidth="1" />
              <text
                x="200"
                y="204"
                fill="#444"
                fontSize="9"
                fontWeight="700"
                textAnchor="middle"
                letterSpacing="3"
                fontFamily="Space Grotesk, sans-serif"
              >
                TALON
              </text>
              {/* Ambient reflection */}
              <ellipse cx="150" cy="120" rx="40" ry="20" fill="white" opacity="0.03" />
            </svg>

            {/* Bottom caption */}
            <div className="absolute bottom-0 inset-x-0 p-6 flex items-end justify-between">
              <div>
                <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white/30 mb-1">Performance</div>
                <div className="text-[18px] font-bold text-white tracking-tight">Talon Pro GT</div>
              </div>
              <a
                href="#products"
                className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#CC0000] border border-[#CC0000]/40 px-4 py-2 hover:bg-[#CC0000] hover:text-white transition-colors"
              >
                View Specs
              </a>
            </div>
          </div>

          {/* Bottom tag bar */}
          <div className="grid grid-cols-3 divide-x divide-[#E5E7EB] border-t border-[#E5E7EB]">
            {["Performance", "All-Season", "Off-Road"].map((t) => (
              <a
                key={t}
                href="#products"
                className="text-center py-4 text-[10px] font-semibold tracking-[0.18em] uppercase text-[#6B7280] hover:text-[#CC0000] hover:bg-[#F5F5F5] transition-colors"
              >
                {t}
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-8 left-6 lg:left-12 flex items-center gap-3"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-[#9CA3AF] to-transparent"
        />
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#9CA3AF] font-medium">Scroll</span>
      </motion.div>
    </section>
  );
}
