"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const reviews = [
  {
    name: "Marcus D.",
    role: "Track Enthusiast",
    rating: 5,
    text: "Switched from a well-known German brand to Talon Pro GT and honestly couldn't be happier. The lateral grip in corners is exceptional—I shaved 2 seconds off my lap time at the circuit.",
    tyre: "Talon Pro GT",
  },
  {
    name: "Aisha O.",
    role: "Fleet Manager, Lagos",
    rating: 5,
    text: "We run 80 vehicles on Talon AllRoad tyres. Reduced our tyre replacement frequency by 30%. The even wear pattern across all axle positions is remarkable for the price point.",
    tyre: "Talon AllRoad",
  },
  {
    name: "James R.",
    role: "Off-Road Guide, Namibia",
    rating: 5,
    text: "X-Terra has been through everything—loose shale, deep sand, river crossings. Not one puncture in 14 months of daily use across brutal terrain. These are built differently.",
    tyre: "Talon X-Terra",
  },
  {
    name: "Elena V.",
    role: "Daily Commuter, Oslo",
    rating: 5,
    text: "My first winter tyre switch and I chose Ice Shield on recommendation. The braking distance on compacted snow versus my previous all-seasons is night and day. Safe and confident every morning.",
    tyre: "Talon Ice Shield",
  },
  {
    name: "David K.",
    role: "Automotive Journalist",
    rating: 5,
    text: "I've tested over 200 tyre SKUs in my career. TALON's Pro GT competes with tyres costing 40% more. The wet braking numbers in our instrumented tests were genuinely surprising.",
    tyre: "Talon Pro GT",
  },
  {
    name: "Priya M.",
    role: "SUV Owner, Dubai",
    rating: 5,
    text: "AllRoad on my Defender for 18 months. Extreme heat, sandy shoulders, the occasional off-road stretch. Still wearing evenly and the handling hasn't degraded. Outstanding longevity.",
    tyre: "Talon AllRoad",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i < count ? "fill-[#CC0000]" : "fill-[#E5E7EB]"}`}
          viewBox="0 0 20 20"
        >
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
    <section id="reviews" ref={ref} className="py-24 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#CC0000] mb-4 block">
              Testimonials
            </span>
            <h2 className="text-[48px] lg:text-[60px] font-black uppercase leading-[0.9] text-[#0A0A14]">
              Trusted by
              <br />
              <span className="italic">Drivers Worldwide.</span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="flex items-center gap-4"
          >
            <div>
              <div className="text-[42px] font-black text-[#0A0A14] leading-none">4.9</div>
              <div className="text-[11px] tracking-widest uppercase text-[#6B7280] font-medium mt-1">Overall Rating</div>
            </div>
            <div className="w-px h-12 bg-[#E5E7EB]" />
            <div>
              <div className="text-[42px] font-black text-[#0A0A14] leading-none">12K+</div>
              <div className="text-[11px] tracking-widest uppercase text-[#6B7280] font-medium mt-1">Verified Reviews</div>
            </div>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#E5E7EB]">
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white p-8 flex flex-col gap-4 group hover:bg-[#0D0F1C] transition-colors duration-300"
            >
              <StarRating count={r.rating} />
              <p className="text-[14px] text-[#374151] group-hover:text-white/70 transition-colors leading-relaxed flex-1">
                &ldquo;{r.text}&rdquo;
              </p>
              <div className="pt-4 border-t border-[#F5F5F5] group-hover:border-white/10 transition-colors flex items-end justify-between">
                <div>
                  <div className="text-[14px] font-bold text-[#0A0A14] group-hover:text-white transition-colors">
                    {r.name}
                  </div>
                  <div className="text-[11px] text-[#6B7280] group-hover:text-white/40 transition-colors tracking-wide mt-0.5">
                    {r.role}
                  </div>
                </div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#CC0000] group-hover:text-[#ff4444] transition-colors">
                  {r.tyre}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
