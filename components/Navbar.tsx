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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm"
          : "bg-white"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex items-center justify-between h-[72px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 group">
          <span className="text-[#CC0000] font-black text-2xl italic tracking-tight leading-none" style={{ fontFamily: "var(--font-inter)" }}>
            <span className="inline-block relative">
              <span className="absolute -bottom-0.5 left-0 w-full h-[2px] bg-[#CC0000]" />
              talon
            </span>
          </span>
          <span className="text-[10px] text-[#CC0000] font-bold tracking-widest self-end mb-0.5">™</span>
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
                <button className="flex items-center gap-1.5 text-[13px] font-semibold tracking-widest uppercase text-[#0A0A14] hover:text-[#CC0000] transition-colors">
                  {link.label}
                  <svg
                    className={`w-3 h-3 transition-transform duration-200 ${productsOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {productsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      className="absolute top-full left-0 mt-3 w-44 bg-white border border-gray-100 shadow-xl rounded-sm overflow-hidden"
                    >
                      {link.dropdown.map((item) => (
                        <a
                          key={item}
                          href="#products"
                          className="block px-5 py-3 text-[12px] font-semibold tracking-wider uppercase text-[#0A0A14] hover:bg-[#CC0000] hover:text-white transition-colors"
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
                className="text-[13px] font-semibold tracking-widest uppercase text-[#0A0A14] hover:text-[#CC0000] transition-colors"
              >
                {link.label}
              </a>
            )
          )}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="#products"
            className="flex items-center gap-2 bg-[#0D0F1C] text-white text-[12px] font-bold tracking-widest uppercase px-6 py-3 hover:bg-[#CC0000] transition-colors duration-200"
          >
            Explore Products
            <svg className="w-3.5 h-3.5 -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
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
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-white border-t border-gray-100"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-[13px] font-semibold tracking-widest uppercase text-[#0A0A14]"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#products"
                className="mt-2 flex items-center justify-center gap-2 bg-[#0D0F1C] text-white text-[12px] font-bold tracking-widest uppercase px-6 py-3"
              >
                Explore Products
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
