"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fieldClass =
  "w-full bg-white/10 border border-white/20 text-white placeholder-white/30 px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-colors";

export default function CtaBanner() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section id="contact" ref={ref} className="relative overflow-hidden bg-[#CC0000] py-24 lg:py-32">
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left — headline */}
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
            <div className="flex items-start gap-4">
              <div className="w-px h-14 bg-white/30 shrink-0 mt-1" aria-hidden="true" />
              <p className="text-[14px] text-white/70 leading-relaxed">
                Not sure which tyre is right for your vehicle and conditions? Our specialists are ready to guide you to the perfect match.
              </p>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.18, duration: 0.7, ease }}
          >
            <form
              className="flex flex-col gap-5"
              onSubmit={(e) => e.preventDefault()}
              noValidate
              aria-label="Tyre enquiry form"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-[11px] font-semibold tracking-[0.2em] uppercase text-white/70 mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    placeholder="John Smith"
                    autoComplete="name"
                    className={fieldClass}
                  />
                </div>

                {/* Vehicle Type */}
                <div>
                  <label
                    htmlFor="contact-vehicle"
                    className="block text-[11px] font-semibold tracking-[0.2em] uppercase text-white/70 mb-2"
                  >
                    Vehicle Type
                  </label>
                  <input
                    id="contact-vehicle"
                    type="text"
                    name="vehicle"
                    placeholder="SUV / Sedan / Truck"
                    className={fieldClass}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-[11px] font-semibold tracking-[0.2em] uppercase text-white/70 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={fieldClass}
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-[11px] font-semibold tracking-[0.2em] uppercase text-white/70 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  placeholder="Tell us your driving conditions, budget, or tyre size..."
                  className={`${fieldClass} resize-none`}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="group inline-flex items-center justify-between bg-white text-[#CC0000] text-[11px] font-bold tracking-[0.18em] uppercase px-7 py-4 hover:bg-[#0D0F1C] hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#CC0000] focus:ring-white"
                style={{ transform: "skewX(-6deg)" }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", transform: "skewX(6deg)" }}>
                  Send Message
                  <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true">↗</span>
                </span>
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
