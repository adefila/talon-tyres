"use client";

const footerLinks = {
  Products: ["Performance Tyres", "All-Season Tyres", "Off-Road Tyres", "Winter Tyres", "Commercial"],
  Company: ["About TALON", "Engineering", "Careers", "Press", "Sustainability"],
  Support: ["Find a Dealer", "Tyre Guide", "Warranty", "FAQ", "Contact Us"],
  Legal: ["Privacy Policy", "Terms of Use", "Cookie Policy"],
};

export default function Footer() {
  return (
    <footer className="bg-[#0A0A14] text-white relative overflow-hidden">

      {/* ── Watermark logo — blended into the background ── */}
      <div
        className="absolute inset-x-0 bottom-0 flex items-end justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <span
          className="font-black italic tracking-[-0.04em] text-white leading-none"
          style={{
            fontSize: "clamp(120px, 22vw, 320px)",
            opacity: 0.032,
            lineHeight: 0.85,
            letterSpacing: "-0.04em",
          }}
        >
          TALON
        </span>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 pt-20 pb-10">
        {/* Top */}
        <div className="grid lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <span className="text-[#CC0000] font-black text-2xl italic tracking-tight leading-none">
                talon™
              </span>
            </div>
            <p className="text-[14px] text-white/40 leading-relaxed max-w-xs mb-8">
              Engineered for every turn. Built for tomorrow. TALON delivers precision-crafted tyres trusted by drivers across 50+ countries.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-4">
              {["X", "IN", "YT", "IG"].map((s) => (
                <a
                  key={s}
                  href="#"
                  aria-label={s}
                  className="w-9 h-9 border border-white/10 flex items-center justify-center text-[11px] font-bold text-white/40 hover:border-[#CC0000] hover:text-[#CC0000] transition-colors"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-[11px] font-bold tracking-[0.25em] uppercase text-white/30 mb-5">
                {section}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[13px] text-white/50 hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-white/20">
            &copy; {new Date().getFullYear()} TALON Tyres. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Cookies"].map((l) => (
              <a key={l} href="#" className="text-[12px] text-white/20 hover:text-white/50 transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
