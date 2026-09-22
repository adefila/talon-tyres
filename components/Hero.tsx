"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease },
  }),
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white pt-[72px]">
      {/* Left content */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-72px)]">
        <div className="py-16 lg:py-24">
          {/* Badge */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="inline-flex items-center gap-3 mb-8"
          >
            <span className="flex items-center gap-2 bg-[#CC0000] text-white text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full">
              <span className="text-base leading-none">+</span>
              NEW
            </span>
            <a
              href="#products"
              className="flex items-center gap-2 text-[12px] font-semibold tracking-widest uppercase text-[#0A0A14] border border-[#E5E7EB] px-4 py-1.5 rounded-full hover:border-[#CC0000] hover:text-[#CC0000] transition-colors"
            >
              Get 20% off our new arrival in near store
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </motion.div>

          {/* Headline */}
          <div className="overflow-hidden">
            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="text-[56px] sm:text-[68px] lg:text-[80px] xl:text-[90px] font-black uppercase leading-[0.9] tracking-tight text-[#0A0A14] mb-8"
            >
              Tires
              <br />
              <span className="text-[#CC0000]">Engineered</span>
              <br />
              for Every
              <br />
              Turn.
              <br />
              <span className="italic">Built for</span>
              <br />
              Tomorrow.
            </motion.h1>
          </div>

          {/* Subtext */}
          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="text-[16px] text-[#6B7280] leading-relaxed max-w-md mb-10"
          >
            Experience power, control, and safety with every mile. TALON tyres
            are crafted for the road ahead—whether it&apos;s a daily commute or
            a rugged expedition.
          </motion.p>

          {/* CTAs */}
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="flex flex-wrap items-center gap-4"
          >
            <a
              href="#products"
              className="flex items-center gap-3 bg-[#0D0F1C] text-white text-[13px] font-bold tracking-widest uppercase px-8 py-4 hover:bg-[#CC0000] transition-colors duration-200 group"
            >
              Explore Products
              <svg className="w-4 h-4 -rotate-45 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="#reviews"
              className="text-[13px] font-semibold tracking-widest uppercase text-[#0A0A14] underline underline-offset-4 hover:text-[#CC0000] transition-colors"
            >
              Read Reviews
            </a>
          </motion.div>

          {/* Trust bar */}
          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-14 pt-8 border-t border-[#E5E7EB] flex items-center gap-8"
          >
            {[
              { val: "50+", label: "Countries" },
              { val: "2M+", label: "Tyres Sold" },
              { val: "4.9", label: "Avg Rating" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-[28px] font-black text-[#0A0A14] leading-none">{s.val}</div>
                <div className="text-[11px] font-semibold tracking-widest uppercase text-[#6B7280] mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — image panel */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:block relative h-[calc(100vh-72px)] -mr-12"
        >
          {/* Gradient fade left */}
          <div className="absolute inset-y-0 left-0 w-32 z-10 bg-gradient-to-r from-white to-transparent" />

          {/* Tire image — using a styled placeholder since no real image */}
          <div className="h-full w-full relative overflow-hidden bg-[#F0F0F0]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#D0D0D0] via-[#C0C0C0] to-[#A0A0A0]" />
            {/* Stylized tire SVG */}
            <svg
              className="absolute inset-0 w-full h-full object-cover"
              viewBox="0 0 600 900"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid slice"
            >
              <rect width="600" height="900" fill="#1a1a1a" />
              {/* Tire body */}
              <circle cx="420" cy="450" r="340" fill="#111111" />
              <circle cx="420" cy="450" r="260" fill="#222222" />
              {/* Tread blocks */}
              {Array.from({ length: 18 }).map((_, i) => (
                <g key={i} transform={`rotate(${i * 20} 420 450)`}>
                  <rect x="150" y="435" width="120" height="30" rx="4" fill="#333333" />
                  <rect x="155" y="440" width="50" height="20" rx="2" fill="#444444" />
                  <rect x="215" y="440" width="50" height="20" rx="2" fill="#3a3a3a" />
                </g>
              ))}
              {/* Inner rim */}
              <circle cx="420" cy="450" r="160" fill="#181818" />
              <circle cx="420" cy="450" r="140" fill="#222222" stroke="#333" strokeWidth="4" />
              {/* Spokes */}
              {Array.from({ length: 5 }).map((_, i) => (
                <g key={i} transform={`rotate(${i * 72} 420 450)`}>
                  <rect x="410" y="310" width="20" height="140" rx="8" fill="#2a2a2a" />
                </g>
              ))}
              <circle cx="420" cy="450" r="40" fill="#1a1a1a" stroke="#333" strokeWidth="3" />
              {/* Side text */}
              <text
                x="420"
                y="454"
                fill="#555555"
                fontSize="16"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="Arial"
                letterSpacing="6"
              >
                TALON
              </text>
              {/* Ambient lighting */}
              <radialGradient id="g1" cx="30%" cy="30%" r="60%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
              <rect width="600" height="900" fill="url(#g1)" />
            </svg>
          </div>

          {/* Bottom gradient */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white/20 to-transparent z-10" />
        </motion.div>
      </div>

      {/* Bottom scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#9CA3AF] font-medium">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-[#9CA3AF] to-transparent"
        />
      </motion.div>
    </section>
  );
}
