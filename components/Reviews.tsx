"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const reviews = [
  {
    name: "Marcus D.",
    role: "Track Enthusiast",
    rating: 5,
    text: "Switched from a well-known German brand to Talon Pro GT. The lateral grip in corners is exceptional — I shaved 2 full seconds off my lap time at the circuit.",
    tyre: "Pro GT",
    loc: "Nürburgring, DE",
  },
  {
    name: "Aisha O.",
    role: "Fleet Manager",
    rating: 5,
    text: "80 vehicles on Talon AllRoad. Tyre replacement frequency down 30%. The even wear pattern across all axle positions is remarkable at this price point.",
    tyre: "AllRoad",
    loc: "Lagos, NG",
  },
  {
    name: "James R.",
    role: "Off-Road Guide",
    rating: 5,
    text: "X-Terra through loose shale, deep sand, river crossings. Not one puncture in 14 months of brutal daily use. These tyres are built genuinely differently.",
    tyre: "X-Terra",
    loc: "Namibia, NA",
  },
  {
    name: "Elena V.",
    role: "Daily Commuter",
    rating: 5,
    text: "Ice Shield on recommendation. Braking distance on compacted snow vs. my previous all-seasons is night and day. Safe and confident every morning.",
    tyre: "Ice Shield",
    loc: "Oslo, NO",
  },
  {
    name: "David K.",
    role: "Automotive Journalist",
    rating: 5,
    text: "Tested 200+ tyre SKUs in my career. Pro GT competes with products costing 40% more. The wet braking numbers in instrumented testing were genuinely surprising.",
    tyre: "Pro GT",
    loc: "Silverstone, UK",
  },
  {
    name: "Priya M.",
    role: "SUV Owner",
    rating: 5,
    text: "AllRoad on my Defender for 18 months. Extreme heat, sandy shoulders, occasional off-road. Still wearing evenly. Outstanding longevity and consistent handling.",
    tyre: "AllRoad",
    loc: "Dubai, AE",
  },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-3 h-3 ${i < n ? "fill-[#CC0000]" : "fill-[#2A2A2A]"}`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Reviews() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <section id="reviews" ref={ref} className="bg-[#F7F7F7] py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-8 lg:px-16">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14 pb-10 border-b border-[#E5E7EB]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
          >
            <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#CC0000] mb-3 block">
              Testimonials
            </span>
            <h2 className="text-[clamp(38px,4.5vw,64px)] font-bold uppercase leading-[0.95] tracking-[-0.025em] text-[#0A0A14]">
              Trusted by<br />Drivers Worldwide.
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.15, duration: 0.6, ease }}
            className="flex items-center gap-8"
          >
            <div>
              <div className="text-[44px] font-bold text-[#0A0A14] leading-none tracking-tight">4.9</div>
              <Stars n={5} />
              <div className="text-[10px] text-[#9CA3AF] tracking-wider uppercase mt-1.5">12,000+ reviews</div>
            </div>
            <div className="w-px h-14 bg-[#E5E7EB]" />
            <div className="max-w-[220px]">
              <p className="text-[13px] text-[#6B7280] leading-relaxed">
                Verified by independent review platforms. Updated monthly.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Reviews grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.07, duration: 0.6, ease }}
              className="group bg-white border border-[#EBEBEB] hover:border-[#0A0A14] hover:bg-[#0A0A14] p-7 flex flex-col gap-5 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <Stars n={r.rating} />
                <span className="text-[9px] font-semibold tracking-[0.22em] uppercase bg-[#F0F0F0] group-hover:bg-white/10 text-[#6B7280] group-hover:text-white/40 px-2.5 py-1 transition-colors">
                  {r.tyre}
                </span>
              </div>
              <p className="text-[13px] text-[#374151] group-hover:text-white/65 transition-colors leading-relaxed flex-1">
                &ldquo;{r.text}&rdquo;
              </p>
              <div className="flex items-end justify-between pt-4 border-t border-[#F0F0F0] group-hover:border-white/[0.08] transition-colors">
                <div>
                  <div className="text-[13px] font-semibold text-[#0A0A14] group-hover:text-white transition-colors">{r.name}</div>
                  <div className="text-[11px] text-[#9CA3AF] group-hover:text-white/35 transition-colors mt-0.5">{r.role}</div>
                </div>
                <span className="text-[10px] text-[#BDBDBD] group-hover:text-white/25 transition-colors">{r.loc}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
