"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const navLinks = [
  {
    label: "Products",
    href: "#products",
    dropdown: ["Performance", "All-Season", "Off-Road", "Winter"],
  },
  { label: "Reviews", href: "#reviews" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/96 backdrop-blur-md border-b border-[#E5E7EB] shadow-sm"
          : "bg-transparent border-b border-white/[0.06]"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex items-center justify-between h-[72px]">
        {/* Logo */}
        <Link href="/" className="flex items-baseline gap-0.5">
          <span className="text-[#CC0000] font-bold text-[22px] italic tracking-[-0.03em]">talon</span>
          <span className="text-[9px] text-[#CC0000] font-semibold">™</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) =>
            link.dropdown ? (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => setProductsOpen(true)}
                onMouseLeave={() => setProductsOpen(false)}
              >
                <button className={`flex items-center gap-1.5 text-[12px] font-medium tracking-[0.12em] uppercase hover:text-[#CC0000] transition-colors ${scrolled ? "text-[#0A0A14]" : "text-white/80"}`}>
                  {link.label}
                  <svg
                    className={`w-3 h-3 transition-transform duration-200 ${productsOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {productsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-3 w-40 bg-white border border-[#E5E7EB] shadow-lg overflow-hidden"
                    >
                      {link.dropdown.map((item) => (
                        <a
                          key={item}
                          href="#products"
                          className="block px-4 py-2.5 text-[11px] font-medium tracking-[0.15em] uppercase text-[#6B7280] hover:bg-[#0D0F1C] hover:text-white transition-colors"
                        >
                          {item}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className={`text-[12px] font-medium tracking-[0.12em] uppercase hover:text-[#CC0000] transition-colors ${scrolled ? "text-[#0A0A14]" : "text-white/80"}`}
              >
                {link.label}
              </a>
            )
          )}
        </nav>

        {/* CTA — clean rectangle */}
        <div className="hidden md:flex">
          <a
            href="#products"
            className="group inline-flex items-center gap-2.5 bg-[#0D0F1C] text-white text-[11px] font-semibold tracking-[0.15em] uppercase px-6 py-3 hover:bg-[#CC0000] transition-colors duration-200"
          >
            Explore Products
            <span className="text-[10px] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span className={`block h-0.5 transition-all duration-300 ${scrolled ? "bg-[#0A0A14]" : "bg-white"} ${mobileOpen ? "w-6 rotate-45 translate-y-2" : "w-6"}`} />
          <span className={`block h-0.5 transition-all duration-300 ${scrolled ? "bg-[#0A0A14]" : "bg-white"} ${mobileOpen ? "opacity-0 w-4" : "w-4"}`} />
          <span className={`block h-0.5 transition-all duration-300 ${scrolled ? "bg-[#0A0A14]" : "bg-white"} ${mobileOpen ? "w-6 -rotate-45 -translate-y-2" : "w-6"}`} />
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
                  className="text-[12px] font-medium tracking-[0.15em] uppercase text-[#0A0A14] hover:text-[#CC0000] transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#products"
                className="mt-2 flex items-center justify-center gap-2 bg-[#0D0F1C] text-white text-[11px] font-semibold tracking-[0.15em] uppercase px-6 py-3"
              >
                Explore Products ↗
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
