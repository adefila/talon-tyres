"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, Clock } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const posts = [
  {
    id: "01",
    category: "Tyre Guide",
    categoryColor: "#CC0000",
    title: "How to Choose the Right Tyre for Your Driving Style",
    excerpt:
      "Performance, comfort, or all-season versatility? We break down tread pattern, compound rating, and load index so you never compromise on the wrong spec.",
    readTime: "6 min",
    date: "Sep 2026",
    tag: "Buying Guide",
  },
  {
    id: "02",
    category: "Technology",
    categoryColor: "#1E40AF",
    title: "The Science Behind Nano-Grip Compound",
    excerpt:
      "How silica-rich tread bonds to micro-surface irregularities — and why it outperforms carbon black in wet braking by a measurable margin.",
    readTime: "4 min",
    date: "Aug 2026",
    tag: "Engineering",
  },
  {
    id: "03",
    category: "Maintenance",
    categoryColor: "#15803D",
    title: "Tyre Pressure & Wear: The Complete Checklist",
    excerpt:
      "Under-inflation costs you fuel, grip, and tread life. Step-by-step: PSI, rotation intervals, wear indicators, and when to replace.",
    readTime: "5 min",
    date: "Jul 2026",
    tag: "Maintenance",
  },
  {
    id: "04",
    category: "Winter Driving",
    categoryColor: "#0EA5E9",
    title: "Winter Tyres vs. All-Season: The Cold Truth",
    excerpt:
      "Below 7°C, all-season compounds harden and lose grip. We tested Talon Ice Shield against four rivals on snow, ice, and cold tarmac.",
    readTime: "8 min",
    date: "Jun 2026",
    tag: "Comparison",
  },
  {
    id: "05",
    category: "Tyre Guide",
    categoryColor: "#CC0000",
    title: "Understanding Tyre Size: What 245/45 R19 Really Means",
    excerpt:
      "That string of numbers on your sidewall is a complete performance specification. Here's how to decode it — and what changes when you go wider.",
    readTime: "3 min",
    date: "May 2026",
    tag: "Explainer",
  },
];

export default function Blog() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });

  const featured = posts[0];
  const list = posts.slice(1);

  return (
    <section id="blog" ref={ref} className="py-24 lg:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16 pb-16 border-b border-[#E5E7EB]"
        >
          <div>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#CC0000] mb-4 block">
              Knowledge Hub
            </span>
            <h2 className="text-[44px] lg:text-[60px] font-bold uppercase leading-[1] tracking-[-0.025em] text-[#0A0A14]">
              Tyre
              <br />
              <span className="text-[#CC0000]">Insights.</span>
            </h2>
          </div>
          <p className="text-[14px] text-[#6B7280] leading-relaxed max-w-[360px] lg:pb-2">
            Tyre selection, maintenance, and engineering — written by people
            who've actually tested the rubber.
          </p>
        </motion.div>

        {/* Editorial grid */}
        <div className="grid lg:grid-cols-2 gap-0">

          {/* Featured article — left */}
          <motion.article
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease }}
            className="lg:pr-16 lg:border-r border-[#E5E7EB] pb-12 lg:pb-0"
          >
            <span
              aria-hidden="true"
              className="text-[120px] lg:text-[160px] font-black leading-[0.8] text-[#F0F0F0] block mb-6 select-none"
            >
              01
            </span>

            <div className="flex items-center gap-3 mb-5">
              <span
                className="text-[9px] font-bold tracking-[0.32em] uppercase"
                style={{ color: featured.categoryColor }}
              >
                {featured.category}
              </span>
              <span className="w-px h-3 bg-[#E5E7EB]" />
              <span
                className="text-[8px] font-bold tracking-[0.22em] uppercase px-2 py-0.5"
                style={{ background: featured.categoryColor + "14", color: featured.categoryColor }}
              >
                {featured.tag}
              </span>
            </div>

            <h3 className="text-[28px] lg:text-[36px] font-bold text-[#0A0A14] leading-[1.1] tracking-tight mb-5">
              {featured.title}
            </h3>

            <p className="text-[15px] text-[#6B7280] leading-relaxed mb-8">
              {featured.excerpt}
            </p>

            <div className="flex items-center gap-4 mb-10">
              <span className="text-[11px] text-[#9CA3AF] flex items-center gap-1.5">
                <Clock size={11} />
                {featured.readTime} read
              </span>
              <span className="w-px h-3 bg-[#E5E7EB]" />
              <span className="text-[11px] text-[#9CA3AF]">{featured.date}</span>
            </div>

            <a
              href="#configure"
              className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] uppercase text-white bg-[#0A0A14] px-6 py-3.5 hover:bg-[#CC0000] transition-colors duration-200"
              style={{ transform: "skewX(-4deg)" }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: "7px", transform: "skewX(4deg)" }}>
                Build Your Set
                <ArrowUpRight size={12} />
              </span>
            </a>
          </motion.article>

          {/* Article list — right */}
          <div className="lg:pl-16 mt-12 lg:mt-0 divide-y divide-[#E5E7EB]">
            {list.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, x: 16 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.6, ease }}
                className="py-7 group"
              >
                <div className="flex items-start gap-5">
                  <span
                    aria-hidden="true"
                    className="text-[32px] font-black text-[#EBEBEB] leading-none shrink-0 mt-0.5 select-none"
                  >
                    {post.id}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <span
                        className="text-[8px] font-bold tracking-[0.28em] uppercase"
                        style={{ color: post.categoryColor }}
                      >
                        {post.category}
                      </span>
                      <span className="w-px h-2.5 bg-[#E5E7EB]" />
                      <span className="text-[10px] text-[#9CA3AF] flex items-center gap-1">
                        <Clock size={10} />
                        {post.readTime}
                      </span>
                      <span className="text-[10px] text-[#CCCCCC] ml-auto">{post.date}</span>
                    </div>

                    <h3 className="text-[16px] font-bold text-[#0A0A14] leading-[1.25] tracking-tight mb-2 group-hover:text-[#CC0000] transition-colors duration-200">
                      {post.title}
                    </h3>

                    <p className="text-[12px] text-[#9CA3AF] leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>

                    <a
                      href="#configure"
                      className="inline-flex items-center gap-1 mt-3 text-[10px] font-bold tracking-[0.14em] uppercase text-[#9CA3AF] hover:text-[#0A0A14] transition-colors duration-150"
                    >
                      Read more
                      <ArrowUpRight size={10} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150" />
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* All articles CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-14 pt-14 border-t border-[#E5E7EB] flex justify-center"
        >
          <a
            href="#configure"
            className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.22em] uppercase text-[#0A0A14] border border-[#0A0A14] px-8 py-4 hover:bg-[#0A0A14] hover:text-white transition-colors duration-200"
          >
            View All Articles
            <ArrowUpRight size={12} />
          </a>
        </motion.div>

      </div>
    </section>
  );
}
