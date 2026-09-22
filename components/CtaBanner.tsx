"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function CtaBanner() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section id="contact" ref={ref} className="relative overflow-hidden bg-[#CC0000] py-24 lg:py-32">
      {/* Subtle grid texture */}
      <div className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease }}
          >
            <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/50 mb-4 block">
              Get in Touch
            </span>
            <h2 className="text-[48px] lg:text-[60px] font-bold uppercase leading-[1] tracking-[-0.02em] text-white mb-6">
              Find Your
              <br />
              Perfect Tyre.
            </h2>
            <div className="flex items-start gap-4 mb-0">
              <div className="w-px h-14 bg-white/30 shrink-0 mt-1" />
              <p className="text-[14px] text-white/70 leading-relaxed">
                Not sure which tyre is right for your vehicle and conditions? Our specialists are ready to guide you to the perfect match.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.18, duration: 0.7, ease }}
            className="flex flex-col gap-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] tracking-[0.2em] uppercase text-white/50 font-medium block mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Smith"
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 px-4 py-3 text-[13px] focus:outline-none focus:border-white transition-colors font-[var(--font-space)]"
                />
              </div>
              <div>
                <label className="text-[10px] tracking-[0.2em] uppercase text-white/50 font-medium block mb-2">
                  Vehicle Type
                </label>
                <input
                  type="text"
                  placeholder="SUV / Sedan / Truck"
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 px-4 py-3 text-[13px] focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase text-white/50 font-medium block mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 px-4 py-3 text-[13px] focus:outline-none focus:border-white transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase text-white/50 font-medium block mb-2">
                Message
              </label>
              <textarea
                rows={3}
                placeholder="Tell us your driving conditions, budget, or tyre size..."
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 px-4 py-3 text-[13px] focus:outline-none focus:border-white transition-colors resize-none"
              />
            </div>

            {/* Clean rectangle button */}
            <button className="group flex items-center justify-between bg-white text-[#CC0000] text-[11px] font-semibold tracking-[0.18em] uppercase px-7 py-4 hover:bg-[#0D0F1C] hover:text-white transition-colors duration-200">
              <span>Send Message</span>
              <span className="text-[11px] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
