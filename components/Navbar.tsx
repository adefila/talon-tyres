"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const megaItems = [
  {
    label: "Performance",
    name: "Talon Pro GT",
    desc: "Track-grade wet grip. Precision cornering at speed.",
    color: "#CC0000",
    stat: "97 Grip",
  },
  {
    label: "All-Season",
    name: "Talon AllRoad",
    desc: "One tyre for every season, every surface.",
    color: "#1E40AF",
    stat: "4yr Warranty",
  },
  {
    label: "Off-Road",
    name: "Talon X-Terra",
    desc: "Reinforced 6-ply casing. Built where roads end.",
    color: "#15803D",
    stat: "6-ply Casing",
  },
  {
    label: "Winter",
    name: "Talon Ice Shield",
    desc: "Biting-edge sipes engineered to −40°C.",
    color: "#0EA5E9",
    stat: "−40°C Rated",
  },
];

const navLinks = [
  { label: "Products", href: "#products", hasMega: true },
  { label: "Configure", href: "#configure" },
  { label: "Technology", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const closeMega = () => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 120);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm"
            : "bg-white border-b border-[#E5E7EB]"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex items-center justify-between h-[72px]">
          {/* SVG Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/logo.svg"
              alt="TALON Tyres"
              width={110}
              height={18}
              className="h-[22px] w-auto"
              priority
              style={{ color: "#EE2846" }}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
              link.hasMega ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={openMega}
                  onMouseLeave={closeMega}
                >
                  <button
                    className={`flex items-center gap-1.5 text-[13px] font-semibold tracking-[0.1em] uppercase transition-colors ${
                      megaOpen ? "text-[#CC0000]" : "text-[#0A0A14] hover:text-[#CC0000]"
                    }`}
                  >
                    {link.label}
                    <svg
                      className={`w-3 h-3 transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[13px] font-semibold tracking-[0.1em] uppercase text-[#0A0A14] hover:text-[#CC0000] transition-colors"
                >
                  {link.label}
                </a>
              )
            )}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex">
            <a
              href="#configure"
              className="group inline-flex items-center gap-2 bg-[#0D0F1C] text-white text-[12px] font-bold tracking-[0.14em] uppercase px-6 py-3 hover:bg-[#CC0000] transition-colors duration-200"
            >
              Build Your Set
              <span className="text-[10px] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block h-0.5 bg-[#0A0A14] transition-all duration-300 ${mobileOpen ? "w-6 rotate-45 translate-y-2" : "w-6"}`} />
            <span className={`block h-0.5 bg-[#0A0A14] transition-all duration-300 ${mobileOpen ? "opacity-0 w-4" : "w-4"}`} />
            <span className={`block h-0.5 bg-[#0A0A14] transition-all duration-300 ${mobileOpen ? "w-6 -rotate-45 -translate-y-2" : "w-6"}`} />
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden bg-white border-t border-[#E5E7EB]"
            >
              <div className="px-6 py-6 flex flex-col gap-5">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-[14px] font-semibold tracking-[0.1em] uppercase text-[#0A0A14] hover:text-[#CC0000] transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="#configure"
                  className="mt-2 flex items-center justify-center gap-2 bg-[#0D0F1C] text-white text-[13px] font-bold tracking-[0.12em] uppercase px-6 py-3"
                >
                  Build Your Set ↗
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ── Mega Menu (fixed, full-width) ── */}
      <AnimatePresence>
        {megaOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-[72px] left-0 right-0 z-40 bg-[#0A0A14] border-b border-white/10 shadow-2xl"
            onMouseEnter={openMega}
            onMouseLeave={closeMega}
          >
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-8">

              {/* Header row */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-[9px] font-bold tracking-[0.32em] uppercase text-[#CC0000] block mb-1">
                    Our Collection
                  </span>
                  <p className="text-[13px] text-white/40">
                    Four precision-engineered lines — city to trail.
                  </p>
                </div>
                <a
                  href="#products"
                  onClick={() => setMegaOpen(false)}
                  className="group flex items-center gap-2 text-[11px] font-bold tracking-[0.15em] uppercase text-white/50 hover:text-white transition-colors"
                >
                  View Full Range
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </a>
              </div>

              {/* 4-column tyre grid */}
              <div className="grid grid-cols-4 gap-px bg-white/[0.06]">
                {megaItems.map((item) => (
                  <a
                    key={item.label}
                    href="#products"
                    onClick={() => setMegaOpen(false)}
                    className="group bg-[#0A0A14] px-5 py-5 flex flex-col gap-3 hover:bg-white/[0.05] transition-colors"
                  >
                    {/* Accent dot + label */}
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ background: item.color }}
                      />
                      <span
                        className="text-[9px] font-bold tracking-[0.24em] uppercase"
                        style={{ color: item.color }}
                      >
                        {item.label}
                      </span>
                    </div>

                    {/* Product name */}
                    <div>
                      <div className="text-[15px] font-bold text-white tracking-tight leading-tight group-hover:text-white transition-colors">
                        {item.name}
                      </div>
                      <div className="text-[12px] text-white/40 mt-1.5 leading-relaxed">
                        {item.desc}
                      </div>
                    </div>

                    {/* Stat chip */}
                    <div className="mt-auto">
                      <span
                        className="text-[9px] font-bold tracking-[0.18em] uppercase px-2.5 py-1 inline-block"
                        style={{ background: `${item.color}22`, color: item.color, border: `1px solid ${item.color}44` }}
                      >
                        {item.stat}
                      </span>
                    </div>

                    {/* Hover arrow */}
                    <div className="flex items-center gap-1.5 text-white/20 group-hover:text-white/60 transition-colors">
                      <span className="text-[10px] font-semibold tracking-[0.12em] uppercase">Configure</span>
                      <span className="text-[10px] transition-transform group-hover:translate-x-0.5">→</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop to close mega menu */}
      {megaOpen && (
        <div
          className="fixed inset-0 z-30 top-[72px]"
          onMouseEnter={closeMega}
        />
      )}
    </>
  );
}
