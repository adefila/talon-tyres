"use client";

const footerLinks = {
  Products: ["Performance Tyres", "All-Season Tyres", "Off-Road Tyres", "Winter Tyres", "Commercial"],
  Company: ["About TALON", "Engineering", "Careers", "Press", "Sustainability"],
  Support: ["Find a Dealer", "Tyre Guide", "Warranty", "FAQ", "Contact Us"],
  Legal: ["Privacy Policy", "Terms of Use", "Cookie Policy"],
};

export default function Footer() {
  return (
    <footer className="bg-[#080808] text-white border-t border-white/[0.06]">
      <div className="max-w-[1400px] mx-auto px-8 lg:px-16 pt-20 pb-10">
        <div className="grid lg:grid-cols-[320px_1fr] gap-16 mb-16">
          {/* Brand col */}
          <div>
            <div className="mb-6">
              <span className="text-[#CC0000] font-bold text-[22px] italic tracking-[-0.03em]">talon</span>
              <span className="text-[9px] text-[#CC0000] font-semibold">™</span>
            </div>
            <p className="text-[13px] text-white/25 leading-relaxed mb-8 max-w-[260px]">
              Engineered for every turn. Built for tomorrow. TALON tyres are trusted by drivers across 50+ countries.
            </p>
            <div className="flex items-center gap-3">
              {[
                { label: "X", href: "#" },
                { label: "IN", href: "#" },
                { label: "YT", href: "#" },
                { label: "IG", href: "#" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="w-9 h-9 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white/25 hover:border-[#CC0000] hover:text-[#CC0000] transition-all duration-200"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {Object.entries(footerLinks).map(([section, links]) => (
              <div key={section}>
                <h4 className="text-[9px] font-semibold tracking-[0.28em] uppercase text-white/20 mb-5">
                  {section}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-[12px] text-white/35 hover:text-white/80 transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-white/15">
            &copy; {new Date().getFullYear()} TALON Tyres. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Cookies"].map((l) => (
              <a key={l} href="#" className="text-[11px] text-white/15 hover:text-white/40 transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
