"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: 35, suffix: "+", label: "Years of Engineering Excellence" },
  { value: 2, suffix: "M+", label: "Tyres Delivered Worldwide" },
  { value: 50, suffix: "+", label: "Countries & Growing" },
  { value: 99.4, suffix: "%", label: "Customer Satisfaction Rate", decimal: true },
];

function AnimatedNumber({
  target,
  suffix,
  decimal,
  active,
}: {
  target: number;
  suffix: string;
  decimal?: boolean;
  active: boolean;
}) {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    const duration = 1600;
    const start = performance.now();
    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      /* Ease out expo */
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setDisplay(parseFloat((eased * target).toFixed(decimal ? 1 : 0)));
      if (t < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [active, target, decimal]);

  return (
    <span>
      {decimal ? display.toFixed(1) : Math.round(display)}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section ref={ref} className="bg-[#0D0F1C] py-16 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="bg-[#0D0F1C] px-8 py-10 group hover:bg-[#CC0000] transition-colors duration-300"
            >
              <div className="text-[42px] lg:text-[52px] font-black text-white leading-none mb-2 tabular-nums">
                <AnimatedNumber
                  target={s.value}
                  suffix={s.suffix}
                  decimal={s.decimal}
                  active={inView}
                />
              </div>
              <div className="text-[11px] tracking-widest uppercase text-white/50 font-medium group-hover:text-white/80 transition-colors">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
