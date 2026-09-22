"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function CtaBanner() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section id="contact" ref={ref} className="relative overflow-hidden bg-[#CC0000] py-24 lg:py-32">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
          {Array.from({ length: 8 }).map((_, i) => (
            <circle
              key={i}
              cx={100 * i + 50}
              cy={200}
              r={80 + i * 20}
              fill="none"
              stroke="white"
              strokeWidth="1"
            />
          ))}
        </svg>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-white/60 mb-4 block">
              Get in Touch
            </span>
            <h2 className="text-[52px] lg:text-[64px] font-black uppercase leading-[0.9] text-white mb-6">
              Find Your
              <br />
              <span className="italic">Perfect Tyre.</span>
            </h2>
            <p className="text-[15px] text-white/70 leading-relaxed max-w-md">
              Not sure which tyre is right for your vehicle and conditions? Our specialists are ready to guide you to the perfect match.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] tracking-widest uppercase text-white/60 font-bold block mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Smith"
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 px-4 py-3 text-[14px] focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <div>
                <label className="text-[11px] tracking-widest uppercase text-white/60 font-bold block mb-2">
                  Vehicle Type
                </label>
                <input
                  type="text"
                  placeholder="e.g. SUV / Sedan"
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 px-4 py-3 text-[14px] focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] tracking-widest uppercase text-white/60 font-bold block mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 px-4 py-3 text-[14px] focus:outline-none focus:border-white transition-colors"
              />
            </div>
            <div>
              <label className="text-[11px] tracking-widest uppercase text-white/60 font-bold block mb-2">
                What are you looking for?
              </label>
              <textarea
                rows={3}
                placeholder="Tell us your driving conditions, budget, or tyre size..."
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 px-4 py-3 text-[14px] focus:outline-none focus:border-white transition-colors resize-none"
              />
            </div>
            <button className="flex items-center justify-center gap-3 bg-white text-[#CC0000] text-[12px] font-bold tracking-widest uppercase px-8 py-4 hover:bg-[#0D0F1C] hover:text-white transition-colors duration-200 group">
              Send Message
              <svg className="w-3.5 h-3.5 -rotate-45 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
