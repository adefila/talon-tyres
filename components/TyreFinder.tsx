"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

function AnimatedCheck({ delay = 0 }: { delay?: number }) {
  return (
    <svg viewBox="0 0 22 22" width="22" height="22" className="shrink-0" aria-hidden="true">
      <circle cx="11" cy="11" r="10" fill="none" stroke="#E5E7EB" strokeWidth="1.5" />
      <path
        d="M6 11.5L9.5 15L16 8"
        fill="none"
        stroke="#0A0A14"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="24"
        strokeDashoffset="24"
        style={{
          animation: `talon-check-draw 0.45s ${delay}s cubic-bezier(0.22,1,0.36,1) forwards`,
        }}
      />
      <style>{`
        @keyframes talon-check-draw {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </svg>
  );
}

const makes = ["BMW", "Audi", "Mercedes", "Toyota", "Ford", "Honda", "Volkswagen", "Volvo", "Land Rover", "Mazda"];
const models: Record<string, string[]> = {
  BMW: ["1 Series", "2 Series", "3 Series", "4 Series", "5 Series", "7 Series", "X3", "X5", "X7"],
  Audi: ["A3", "A4", "A5", "A6", "A8", "Q3", "Q5", "Q7", "Q8", "RS6"],
  Mercedes: ["A-Class", "C-Class", "E-Class", "S-Class", "GLA", "GLC", "GLE", "GLS"],
  Toyota: ["Corolla", "Camry", "Yaris", "RAV4", "Hilux", "Land Cruiser", "Supra"],
  Ford: ["Fiesta", "Focus", "Mondeo", "Kuga", "Explorer", "Ranger", "Mustang"],
  Honda: ["Civic", "Jazz", "CR-V", "HR-V", "Accord", "NSX"],
  Volkswagen: ["Polo", "Golf", "Passat", "Tiguan", "Touareg", "Arteon"],
  Volvo: ["XC40", "XC60", "XC90", "V40", "V60", "V90", "S60", "S90"],
  "Land Rover": ["Defender", "Discovery", "Freelander", "Range Rover", "Range Rover Sport", "Range Rover Evoque"],
  Mazda: ["Mazda2", "Mazda3", "Mazda6", "MX-5", "CX-3", "CX-5", "CX-9"],
};
const years = Array.from({ length: 16 }, (_, i) => String(2024 - i));

const widths = ["155", "165", "175", "185", "195", "205", "215", "225", "235", "245", "255", "265", "275", "285", "295", "305"];
const aspects = ["30", "35", "40", "45", "50", "55", "60", "65", "70", "75"];
const rimSizes = ["14", "15", "16", "17", "18", "19", "20", "21", "22"];

const selectClass =
  "w-full bg-white border border-[#E5E7EB] text-[#0A0A14] text-[13px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#CC0000] focus:border-transparent transition-colors appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

function ChevronDown() {
  return (
    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export default function TyreFinder() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  const [tab, setTab] = useState<"vehicle" | "size">("vehicle");

  // Vehicle tab state
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");

  // Size tab state
  const [width, setWidth] = useState("");
  const [aspect, setAspect] = useState("");
  const [rim, setRim] = useState("");

  return (
    <section
      ref={ref}
      id="finder"
      className="py-20 lg:py-28 bg-[#F8F8FA] border-b border-[#E5E7EB]"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-[1fr_480px] gap-12 items-center">

          {/* Left copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
          >
            <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-[#CC0000] mb-3 block">
              Tyre Finder
            </span>
            <h2 className="text-[40px] lg:text-[52px] font-bold uppercase leading-[1] tracking-[-0.02em] text-[#0A0A14] mb-5">
              Find Tyres<br />For Your Car.
            </h2>
            <p className="text-[15px] text-[#6B7280] leading-relaxed max-w-md mb-8">
              Enter your vehicle or tyre size and we'll show you the exact TALON tyres that fit — guaranteed.
            </p>

            <div className="flex flex-col gap-3">
              {[
                { text: "Guaranteed vehicle fitment", delay: 0.3 },
                { text: "Over 240 size configurations", delay: 0.5 },
                { text: "Free delivery on all orders", delay: 0.7 },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2.5">
                  <AnimatedCheck delay={item.delay} />
                  <span className="text-[13px] text-[#374151] font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right finder card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.6, ease }}
            className="bg-white border border-[#E5E7EB] shadow-sm"
          >
            {/* Tabs */}
            <div className="flex border-b border-[#E5E7EB]">
              {(["vehicle", "size"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-4 text-[11px] font-bold tracking-[0.18em] uppercase transition-colors ${
                    tab === t
                      ? "text-[#CC0000] border-b-2 border-[#CC0000]"
                      : "text-[#9CA3AF] hover:text-[#374151]"
                  }`}
                >
                  {t === "vehicle" ? "By Vehicle" : "By Size"}
                </button>
              ))}
            </div>

            <div className="p-6">
              {tab === "vehicle" ? (
                <div className="flex flex-col gap-4">
                  {/* Make */}
                  <div>
                    <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-[#6B7280] mb-2">Make</label>
                    <div className="relative">
                      <select
                        value={make}
                        onChange={(e) => { setMake(e.target.value); setModel(""); }}
                        className={selectClass}
                      >
                        <option value="">Select make</option>
                        {makes.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                      <ChevronDown />
                    </div>
                  </div>

                  {/* Model */}
                  <div>
                    <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-[#6B7280] mb-2">Model</label>
                    <div className="relative">
                      <select
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        disabled={!make}
                        className={selectClass}
                      >
                        <option value="">Select model</option>
                        {(models[make] ?? []).map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                      <ChevronDown />
                    </div>
                  </div>

                  {/* Year */}
                  <div>
                    <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-[#6B7280] mb-2">Year</label>
                    <div className="relative">
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        disabled={!model}
                        className={selectClass}
                      >
                        <option value="">Select year</option>
                        {years.map((y) => <option key={y} value={y}>{y}</option>)}
                      </select>
                      <ChevronDown />
                    </div>
                  </div>

                  <a
                    href="#products"
                    className="group mt-2 flex items-center justify-between bg-[#CC0000] text-white text-[11px] font-bold tracking-[0.18em] uppercase px-6 py-4 hover:bg-[#0D0F1C] transition-colors duration-200"
                    style={{ transform: "skewX(-5deg)" }}
                    onClick={(e) => { if (!make || !model || !year) e.preventDefault(); }}
                    aria-disabled={!make || !model || !year}
                  >
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", transform: "skewX(5deg)" }}>
                      Find My Tyres
                      <ArrowUpRight size={14} />
                    </span>
                  </a>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {/* Width */}
                  <div>
                    <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-[#6B7280] mb-2">Width (mm)</label>
                    <div className="relative">
                      <select value={width} onChange={(e) => setWidth(e.target.value)} className={selectClass}>
                        <option value="">e.g. 205</option>
                        {widths.map((w) => <option key={w} value={w}>{w}</option>)}
                      </select>
                      <ChevronDown />
                    </div>
                  </div>

                  {/* Aspect ratio */}
                  <div>
                    <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-[#6B7280] mb-2">Aspect Ratio (%)</label>
                    <div className="relative">
                      <select value={aspect} onChange={(e) => setAspect(e.target.value)} className={selectClass}>
                        <option value="">e.g. 55</option>
                        {aspects.map((a) => <option key={a} value={a}>{a}</option>)}
                      </select>
                      <ChevronDown />
                    </div>
                  </div>

                  {/* Rim diameter */}
                  <div>
                    <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-[#6B7280] mb-2">Rim Diameter (inch)</label>
                    <div className="relative">
                      <select value={rim} onChange={(e) => setRim(e.target.value)} className={selectClass}>
                        <option value="">e.g. 16</option>
                        {rimSizes.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <ChevronDown />
                    </div>
                  </div>

                  {/* Size preview */}
                  {width && aspect && rim && (
                    <div className="bg-[#F8F8FA] px-4 py-3 text-center">
                      <span className="text-[22px] font-black text-[#0A0A14] tracking-tight font-mono">
                        {width}/{aspect} R{rim}
                      </span>
                    </div>
                  )}

                  <a
                    href="#products"
                    className="group mt-2 flex items-center justify-between bg-[#CC0000] text-white text-[11px] font-bold tracking-[0.18em] uppercase px-6 py-4 hover:bg-[#0D0F1C] transition-colors duration-200"
                    style={{ transform: "skewX(-5deg)" }}
                    onClick={(e) => { if (!width || !aspect || !rim) e.preventDefault(); }}
                    aria-disabled={!width || !aspect || !rim}
                  >
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", transform: "skewX(5deg)" }}>
                      Find My Tyres
                      <ArrowUpRight size={14} />
                    </span>
                  </a>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
