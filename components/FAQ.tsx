"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const faqs = [
  {
    q: "How do I read my tyre size?",
    a: "Your tyre size is printed on the sidewall — for example 205/55 R16. The first number (205) is the width in millimetres. The second number (55) is the aspect ratio — the height of the sidewall as a percentage of the width. The letter R means radial construction. The final number (16) is the rim diameter in inches.",
  },
  {
    q: "What's the difference between all-season and winter tyres?",
    a: "All-season tyres are designed to perform adequately in a wide range of conditions — dry, wet, and light snow. Winter tyres use a specially formulated compound that stays soft below 7°C, providing significantly better grip on ice, packed snow, and cold wet roads. If you regularly face temperatures under 7°C, dedicated winter tyres are the safer choice.",
  },
  {
    q: "How long do TALON tyres last?",
    a: "Tyre lifespan depends on driving style, vehicle alignment, and road conditions. Under normal use, most TALON tyres are designed for 40,000–60,000 km. Our AllRoad range carries a 4-year tread warranty. We recommend inspecting tread depth every 6 months — replace when below 1.6mm (3mm in winter conditions).",
  },
  {
    q: "Can I mix different tyre types on my vehicle?",
    a: "Mixing tyres with different constructions or performance characteristics is not recommended and can negatively affect handling and safety. Identical axles should always carry the same model and size. If you must use different tyres front and rear (common on performance vehicles), ensure they are designed to be used together and follow your vehicle manufacturer's guidance.",
  },
  {
    q: "What tyre do I need for my SUV or 4x4?",
    a: "It depends on how you use your vehicle. If you drive mostly on-road with occasional light off-road, our AllRoad range provides excellent year-round performance. For serious off-road use — gravel, mud, rocky terrain — the Talon X-Terra is purpose-built with a reinforced 6-ply casing and aggressive tread pattern for superior traction where roads end.",
  },
  {
    q: "Does TALON offer a fitment guarantee?",
    a: "Yes. When you use our Tyre Finder tool to search by vehicle make, model, and year, every result shown is guaranteed to be compatible with your vehicle. If you receive a tyre that doesn't fit, we'll exchange it free of charge within 30 days, including collection and redelivery.",
  },
  {
    q: "How do I know when to replace my tyres?",
    a: "The legal minimum tread depth is 1.6mm in most countries, but TALON recommends replacing at 2mm for optimal safety. Modern TALON tyres include tread wear indicators moulded into the grooves — when the tread is flush with these indicators, it's time to replace. You should also inspect for sidewall bulges, cracking, or embedded objects after any impact.",
  },
  {
    q: "What warranty do TALON tyres come with?",
    a: "All TALON tyres include a 2-year manufacturing defect warranty from the date of purchase. Our AllRoad range additionally carries a 4-year tread warranty against premature wear. Warranties do not cover damage from road hazards, improper fitment, incorrect inflation, or racing use. Contact our customer team with your purchase receipt to initiate any warranty claim.",
  },
];

function FaqItem({ q, a, index, inView }: { q: string; a: string; index: number; inView: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.06, duration: 0.5, ease }}
      className="border-b border-[#E5E7EB] last:border-b-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
        aria-expanded={open}
      >
        <span className="text-[15px] font-semibold text-[#0A0A14] leading-snug group-hover:text-[#CC0000] transition-colors pr-2">
          {q}
        </span>
        <span
          className={`shrink-0 w-6 h-6 flex items-center justify-center border border-[#E5E7EB] transition-all duration-200 mt-0.5 ${
            open ? "bg-[#CC0000] border-[#CC0000] rotate-45" : "bg-white hover:border-[#CC0000]"
          }`}
        >
          <svg
            className={`w-3 h-3 transition-colors ${open ? "text-white" : "text-[#0A0A14]"}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="text-[14px] text-[#6B7280] leading-relaxed pb-5 pr-10">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <section ref={ref} id="faq" className="py-24 lg:py-32 bg-[#F8F8FA]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

        <div className="grid lg:grid-cols-[320px_1fr] gap-16">

          {/* Left sticky header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="lg:sticky lg:top-28 self-start"
          >
            <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-[#CC0000] mb-3 block">
              FAQ
            </span>
            <h2 className="text-[40px] lg:text-[48px] font-bold uppercase leading-[1] tracking-[-0.02em] text-[#0A0A14] mb-5">
              Common<br />Questions.
            </h2>
            <p className="text-[14px] text-[#6B7280] leading-relaxed mb-8">
              Everything you need to know about choosing and buying the right TALON tyre.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-[#0D0F1C] text-white text-[11px] font-bold tracking-[0.16em] uppercase px-6 py-3 hover:bg-[#CC0000] transition-colors duration-200"
              style={{ transform: "skewX(-5deg)" }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", transform: "skewX(5deg)" }}>
                Ask a Specialist
              </span>
            </a>
          </motion.div>

          {/* Right accordion */}
          <div className="bg-white border border-[#E5E7EB] divide-y divide-[#E5E7EB]">
            <div className="px-7 divide-y divide-[#E5E7EB]">
              {faqs.map((item, i) => (
                <FaqItem key={i} q={item.q} a={item.a} index={i} inView={inView} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
