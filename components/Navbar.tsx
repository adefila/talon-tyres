"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import TalonLogo from "./TalonLogo";

const megaItems = [
  {
    label: "Performance",
    name: "Talon Pro GT",
    desc: "Track-grade wet grip. Precision cornering at speed.",
    color: "#CC0000",
  },
  {
    label: "All-Season",
    name: "Talon AllRoad",
    desc: "One tyre for every season, every surface.",
    color: "#1E40AF",
  },
  {
    label: "Off-Road",
    name: "Talon X-Terra",
    desc: "Reinforced 6-ply casing. Built where roads end.",
    color: "#15803D",
  },
  {
    label: "Winter",
    name: "Talon Ice Shield",
    desc: "Biting-edge sipes engineered to −40°C.",
    color: "#0EA5E9",
  },
];

const navLinks = [
  { label: "Products", href: "#products", hasMega: true },
  { label: "Configure", href: "#configure" },
  { label: "Technology", href: "#about" },
  { label: "Contact", href: "#contact" },
];

function MegaCarSVG() {
  const spk = [0, 72, 144, 216, 288];
  return (
    <svg viewBox="0 0 300 170" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Road */}
      <rect x="0" y="128" width="300" height="42" fill="#06070e" />
      <line x1="0" y1="128" x2="300" y2="128" stroke="#CC0000" strokeWidth="1" opacity="0.3" />

      {/* Car body */}
      <path d="M34 104 L30 90 L30 76 L44 65 L60 48 L116 40 L174 40 L190 47 L206 68 L224 78 L234 89 L234 104 Z" fill="#0c0d1c" />
      <rect x="30" y="88" width="204" height="17" fill="#070810" />

      {/* Greenhouse */}
      <path d="M72 72 L84 50 L116 42 L172 42 L188 50 L204 72 Z" fill="#0b0c1a" />
      <path d="M74 70 L86 52 L114 44 L114 70 Z" fill="#112540" opacity="0.92" />
      <path d="M118 44 L170 44 L186 52 L200 70 L118 70 Z" fill="#112540" opacity="0.92" />

      {/* A-pillar */}
      <line x1="114" y1="70" x2="114" y2="104" stroke="#CC0000" strokeWidth="1.2" opacity="0.35" />

      {/* Red accent stripe */}
      <path d="M32 82 Q132 79 234 81" stroke="#CC0000" strokeWidth="2" fill="none" opacity="0.65" />

      {/* Headlight */}
      <rect x="224" y="78" width="10" height="15" fill="white" opacity="0.96" rx="1" />
      <rect x="226" y="80" width="6" height="11" fill="#ffe880" opacity="0.55" rx="0.5" />

      {/* Taillight */}
      <rect x="30" y="72" width="4" height="22" fill="#CC0000" opacity="0.95" rx="1" />

      {/* TALON badge */}
      <text x="52" y="120" fontSize="8" fontFamily="Arial Black, sans-serif" fontWeight="900" fill="#CC0000" letterSpacing="3" opacity="0.9">TALON</text>

      {/* Front wheel */}
      <circle cx="186" cy="122" r="24" fill="#0e0e18" />
      <circle cx="186" cy="122" r="15" fill="#252538" />
      {spk.map((deg, i) => {
        const a = (deg * Math.PI) / 180;
        return (
          <line key={i}
            x1={186 + Math.cos(a) * 3} y1={122 + Math.sin(a) * 3}
            x2={186 + Math.cos(a) * 13} y2={122 + Math.sin(a) * 13}
            stroke="#c0cce0" strokeWidth="3.5" strokeLinecap="round"
          />
        );
      })}
      <circle cx="186" cy="122" r="3.5" fill="#CC0000" />
      <circle cx="186" cy="122" r="1.5" fill="white" opacity="0.75" />

      {/* Rear wheel */}
      <circle cx="84" cy="122" r="24" fill="#0e0e18" />
      <circle cx="84" cy="122" r="15" fill="#252538" />
      {spk.map((deg, i) => {
        const a = (deg * Math.PI) / 180;
        return (
          <line key={i}
            x1={84 + Math.cos(a) * 3} y1={122 + Math.sin(a) * 3}
            x2={84 + Math.cos(a) * 13} y2={122 + Math.sin(a) * 13}
            stroke="#c0cce0" strokeWidth="3.5" strokeLinecap="round"
          />
        );
      })}
      <circle cx="84" cy="122" r="3.5" fill="#CC0000" />
      <circle cx="84" cy="122" r="1.5" fill="white" opacity="0.75" />
    </svg>
  );
}

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
          <Link href="/" className="flex items-center shrink-0" aria-label="TALON Tyres">
            <TalonLogo color="#EE2846" className="h-[22px] w-auto" />
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
              className="group inline-flex items-center bg-[#0D0F1C] text-white text-[12px] font-bold tracking-[0.14em] uppercase px-6 py-3 hover:bg-[#CC0000] transition-colors duration-200"
              style={{ transform: "skewX(-6deg)" }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", transform: "skewX(6deg)" }}>
                Build Your Set
                <ArrowUpRight size={13} />
              </span>
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

      {/* ── Mega Menu ── */}
      <AnimatePresence>
        {megaOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-[72px] left-0 right-0 z-40 bg-white border-b border-[#E5E7EB] shadow-lg"
            onMouseEnter={openMega}
            onMouseLeave={closeMega}
          >
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-8">
              <div className="grid lg:grid-cols-[300px_1fr] gap-8">

                {/* Left: Car image panel */}
                <div className="bg-[#0A0A14] p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-bold tracking-[0.32em] uppercase text-[#CC0000] block mb-1">
                      TALON Collection
                    </span>
                    <p className="text-[13px] font-semibold text-white leading-tight mt-2">
                      City to Trail.
                      <br />
                      <span className="text-white/50 font-normal">Four lines. One obsession.</span>
                    </p>
                  </div>
                  <div className="mt-4">
                    <MegaCarSVG />
                  </div>
                </div>

                {/* Right: Product columns */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border border-[#F0F0F0]">
                  {megaItems.map((item) => (
                    <a
                      key={item.label}
                      href="#products"
                      onClick={() => setMegaOpen(false)}
                      className="group px-5 py-5 flex flex-col gap-3 hover:bg-[#F9F9FB] transition-colors border-r border-[#F0F0F0] last:border-r-0"
                    >
                      {/* Accent dot + label */}
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
                        <span className="text-[9px] font-bold tracking-[0.24em] uppercase" style={{ color: item.color }}>
                          {item.label}
                        </span>
                      </div>

                      {/* Name + desc */}
                      <div>
                        <div className="text-[15px] font-bold text-[#0A0A14] tracking-tight leading-tight">
                          {item.name}
                        </div>
                        <div className="text-[12px] text-[#6B7280] mt-1.5 leading-relaxed">
                          {item.desc}
                        </div>
                      </div>

                      {/* Hover arrow */}
                      <div className="mt-auto flex items-center gap-1.5 text-[#D1D5DB] group-hover:text-[#6B7280] transition-colors">
                        <span className="text-[10px] font-semibold tracking-[0.12em] uppercase">Configure</span>
                        <ArrowUpRight size={11} />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {megaOpen && (
        <div className="fixed inset-0 z-30 top-[72px]" onMouseEnter={closeMega} />
      )}
    </>
  );
}
