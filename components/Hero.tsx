"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

const TyreScene = dynamic(() => import("./TyreScene"), { ssr: false });

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* Word-split headline animation */
const wordContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const word: Variants = {
  hidden: { y: "110%", opacity: 0 },
  show: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.5 } },
};

function SplitHeadline({ lines }: { lines: string[][] }) {
  return (
    <motion.h1
      variants={wordContainer}
      initial="hidden"
      animate="show"
      className="text-[56px] sm:text-[68px] lg:text-[82px] font-bold uppercase leading-[0.95] tracking-[-0.025em] text-white mb-8"
    >
      {lines.map((lineWords, li) => (
        <span key={li} className="block overflow-hidden">
          {lineWords.map((w, wi) => (
            <motion.span key={wi} variants={word} className="inline-block mr-[0.25em]">
              {w}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.h1>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-[#0A0A14] overflow-hidden pt-[72px]">

      {/* ── 3D tyre canvas — right half ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease }}
        className="absolute inset-0 flex items-center justify-end pointer-events-none"
        aria-hidden="true"
      >
        <div className="relative w-[680px] h-[680px] lg:w-[920px] lg:h-[920px] translate-x-[6%] lg:translate-x-[2%]">
          {/* Radial glow so dark rubber reads against dark bg */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 68% 68% at 50% 50%, rgba(100,30,30,0.75) 0%, rgba(60,15,15,0.45) 40%, rgba(20,5,5,0.2) 65%, transparent 80%)",
            }}
          />
          <TyreScene />
        </div>
      </motion.div>

      {/* ── Gradient overlay — left text readability ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(108deg, #0A0A14 36%, #0A0A14cc 56%, transparent 74%), linear-gradient(to top, #0A0A14 0%, transparent 28%)",
        }}
        aria-hidden="true"
      />

      {/* ── Red left accent bar ── */}
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 1.0, delay: 0.2, ease }}
        style={{ transformOrigin: "top" }}
        className="absolute left-0 top-[72px] bottom-0 w-[3px] bg-gradient-to-b from-[#CC0000] via-[#CC0000] to-transparent"
        aria-hidden="true"
      />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-8 lg:px-16 min-h-[calc(100vh-72px)] flex flex-col justify-center">
        <div className="max-w-[600px]">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease }}
            className="flex items-center gap-4 mb-10"
          >
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

          {/* Word-split headline */}
          <SplitHeadline lines={[["Tires", "Built"], ["for", "Every"], ["Turn."]]} />

          {/* Sub */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-12"
          >
            <motion.div variants={fadeUp} className="flex items-start gap-5 max-w-[480px]">
              <div className="w-px h-16 bg-[#CC0000] shrink-0 mt-0.5" />
              <p className="text-[15px] text-white/50 leading-relaxed">
                Experience power, control, and safety with every mile. TALON tyres
                are crafted for the road ahead — whether it&apos;s a daily
                commute or a rugged expedition.
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
              <motion.a
                href="#products"
                className="group inline-flex items-center gap-2.5 bg-[#CC0000] text-white text-[11px] font-bold tracking-[0.15em] uppercase px-8 py-4 hover:bg-white hover:text-[#CC0000] transition-colors duration-200"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                Explore Products
                <span className="text-[10px] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
              </motion.a>
              <motion.a
                href="#reviews"
                className="inline-flex items-center gap-2.5 border border-white/20 text-white text-[11px] font-semibold tracking-[0.15em] uppercase px-8 py-4 hover:border-white hover:bg-white/5 transition-colors duration-200"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                Read Reviews
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Bottom strip ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.6, ease }}
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
        transition={{ delay: 1.4, duration: 0.5 }}
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
