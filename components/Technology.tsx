"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const features = [
  {
    icon: "grip",
    title: "Nano-Grip Compound",
    description:
      "Proprietary silica-rich tread bonds to micro-surface irregularities — delivering 18% more wet grip than the category average. Stops shorter, corners harder.",
  },
  {
    icon: "structure",
    title: "StressTech Casing",
    description:
      "Multi-ply high-tensile steel belt structure absorbs lateral forces at high speed without compromising ride quality. Built for the long haul.",
  },
  {
    icon: "heat",
    title: "ThermalGuard Sidewall",
    description:
      "Heat-dissipating sidewall compound prevents thermal runaway in high-load and high-speed applications, extending service life by up to 30%.",
  },
  {
    icon: "water",
    title: "AquaChannel Tread",
    description:
      "Asymmetric circumferential grooves evacuate 8 litres of water per second at highway speed. Aquaplaning risk is eliminated — not just reduced.",
  },
];

/* ── Animated SVG Icons ── */
function GripIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
      {/* Ground surface */}
      <motion.rect x="4" y="36" width="40" height="4" rx="2" fill="#CC0000" opacity="0.3"
        initial={{ scaleX: 0 }} animate={active ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease }} style={{ transformOrigin: "left center" }}
      />
      {/* Tread block 1 */}
      <motion.rect x="8" y="22" width="8" height="14" rx="2" fill="#CC0000"
        initial={{ y: -10, opacity: 0 }} animate={active ? { y: 0, opacity: 1 } : { y: -10, opacity: 0 }}
        transition={{ delay: 0.0, duration: 0.5, ease }}
      />
      {/* Tread block 2 */}
      <motion.rect x="20" y="26" width="8" height="10" rx="2" fill="#CC0000" opacity="0.7"
        initial={{ y: -10, opacity: 0 }} animate={active ? { y: 0, opacity: 0.7 } : { y: -10, opacity: 0 }}
        transition={{ delay: 0.08, duration: 0.5, ease }}
      />
      {/* Tread block 3 */}
      <motion.rect x="32" y="22" width="8" height="14" rx="2" fill="#CC0000"
        initial={{ y: -10, opacity: 0 }} animate={active ? { y: 0, opacity: 1 } : { y: -10, opacity: 0 }}
        transition={{ delay: 0.16, duration: 0.5, ease }}
      />
      {/* Grip lines */}
      {[0, 1, 2].map(i => (
        <motion.line key={i} x1={10 + i * 14} y1="22" x2={10 + i * 14} y2="36"
          stroke="white" strokeWidth="1" opacity="0.2"
          initial={{ pathLength: 0 }} animate={active ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ delay: 0.3 + i * 0.05, duration: 0.4 }}
        />
      ))}
    </svg>
  );
}

function StructureIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
      {/* Steel belt layers */}
      {[0, 1, 2, 3].map(i => (
        <motion.rect key={i} x="6" y={12 + i * 7} width="36" height="4" rx="1.5"
          fill="#CC0000" opacity={1 - i * 0.18}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={active ? { scaleX: 1, opacity: 1 - i * 0.18 } : { scaleX: 0, opacity: 0 }}
          transition={{ delay: i * 0.1, duration: 0.5, ease }}
          style={{ transformOrigin: "left center" }}
        />
      ))}
      {/* Diagonal cross pattern */}
      <motion.line x1="6" y1="12" x2="42" y2="38" stroke="white" strokeWidth="1" opacity="0.15"
        initial={{ pathLength: 0 }} animate={active ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      />
      <motion.line x1="42" y1="12" x2="6" y2="38" stroke="white" strokeWidth="1" opacity="0.15"
        initial={{ pathLength: 0 }} animate={active ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ delay: 0.55, duration: 0.4 }}
      />
    </svg>
  );
}

function HeatIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
      {/* Heat waves */}
      {[0, 1, 2].map(i => (
        <motion.path key={i}
          d={`M ${10 + i * 14} 38 Q ${14 + i * 14} 28 ${10 + i * 14} 20 Q ${6 + i * 14} 12 ${10 + i * 14} 8`}
          stroke="#CC0000" strokeWidth="2.5" strokeLinecap="round" fill="none"
          opacity={1 - i * 0.25}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={active ? { pathLength: 1, opacity: 1 - i * 0.25 } : { pathLength: 0, opacity: 0 }}
          transition={{ delay: i * 0.12, duration: 0.6, ease }}
        />
      ))}
      {/* Sidewall arc */}
      <motion.path d="M 8 42 Q 24 36 40 42" stroke="#CC0000" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.4"
        initial={{ pathLength: 0 }} animate={active ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ delay: 0.5, duration: 0.5, ease }}
      />
    </svg>
  );
}

function WaterIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
      {/* Tyre tread base */}
      <motion.rect x="4" y="30" width="40" height="10" rx="2" fill="#CC0000" opacity="0.2"
        initial={{ scaleX: 0 }} animate={active ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ delay: 0.1, duration: 0.4, ease }} style={{ transformOrigin: "left center" }}
      />
      {/* Water droplets flowing */}
      {[0, 1, 2, 3].map(i => (
        <motion.ellipse key={i} cx={10 + i * 10} cy={24} rx="2.5" ry="4" fill="#60A5FA" opacity="0.7"
          initial={{ y: -16, opacity: 0 }}
          animate={active ? { y: [0, 6, 12], opacity: [0.7, 0.5, 0] } : { y: -16, opacity: 0 }}
          transition={{ delay: i * 0.1, duration: 0.7, repeat: active ? Infinity : 0, repeatDelay: 0.8, ease: "easeIn" }}
        />
      ))}
      {/* Groove lines */}
      {[0, 1].map(i => (
        <motion.line key={i} x1={16 + i * 16} y1="30" x2={16 + i * 16} y2="40"
          stroke="white" strokeWidth="1.5" opacity="0.35"
          initial={{ pathLength: 0 }} animate={active ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
        />
      ))}
    </svg>
  );
}

const icons = { grip: GripIcon, structure: StructureIcon, heat: HeatIcon, water: WaterIcon };

export default function Technology() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <section id="about" ref={ref} className="py-24 lg:py-32 bg-[#F7F7F7] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left — sticky headline */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease }}
            className="lg:sticky lg:top-28"
          >
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#CC0000] mb-4 block">
              Engineering
            </span>
            <h2 className="text-[44px] lg:text-[54px] font-bold uppercase leading-[1] tracking-[-0.025em] text-[#0A0A14] mb-6">
              The Science
              <br />
              Behind Every
              <br />
              Grip.
            </h2>
            <div className="flex items-start gap-4 mb-10">
              <div className="w-px h-14 bg-[#CC0000] shrink-0 mt-1" />
              <p className="text-[14px] text-[#6B7280] leading-relaxed">
                Every TALON tyre is born in our R&amp;D facility where material scientists and racing engineers collaborate — pushing what rubber, steel, and physics can achieve together.
              </p>
            </div>
            <a
              href="#contact"
              className="group inline-flex items-center gap-2.5 bg-[#0D0F1C] text-white text-[11px] font-bold tracking-[0.15em] uppercase px-7 py-3.5 hover:bg-[#CC0000] transition-colors duration-200"
            >
              Deep Dive
              <span className="text-[10px] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
            </a>
          </motion.div>

          {/* Right — animated icon cards */}
          <div className="grid grid-cols-2 gap-4">
            {features.map((f, i) => {
              const Icon = icons[f.icon as keyof typeof icons];
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.1 + i * 0.09, duration: 0.6, ease }}
                  className="group bg-white border border-[#E5E7EB] p-6 flex flex-col gap-4 hover:bg-[#0D0F1C] hover:border-[#0D0F1C] transition-all duration-300 cursor-default"
                >
                  {/* Animated icon — light bg default, always visible on hover */}
                  <div className="p-3 bg-[#F5F5F5] group-hover:bg-white/[0.06] inline-flex w-fit transition-colors">
                    <Icon active={inView} />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-[#0A0A14] group-hover:text-white transition-colors tracking-tight mb-2">
                      {f.title}
                    </h3>
                    <p className="text-[12px] text-[#6B7280] group-hover:text-white/50 transition-colors leading-relaxed">
                      {f.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
