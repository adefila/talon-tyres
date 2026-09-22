"use client";

export default function HeroCarAnimation() {
  const FWX = 648, WY = 368;   // front wheel center
  const RWX = 202, WR = 66, RI = 43; // rear wheel, tyre radius, rim radius

  function spokes(cx: number, cy: number) {
    return [0, 72, 144, 216, 288].map((deg) => {
      const a = (deg * Math.PI) / 180;
      return {
        x1: cx + Math.cos(a) * RI * 0.22, y1: cy + Math.sin(a) * RI * 0.22,
        x2: cx + Math.cos(a) * RI * 0.87, y2: cy + Math.sin(a) * RI * 0.87,
      };
    });
  }

  const Wheel = ({ cx }: { cx: number }) => (
    <g>
      {/* Outer tyre */}
      <circle cx={cx} cy={WY} r={WR} fill="#0e0e18" />
      <circle cx={cx} cy={WY} r={WR} fill="none" stroke="#1c1c28" strokeWidth="13" />
      {/* Red sidewall accent ring */}
      <circle cx={cx} cy={WY} r={WR * 0.665} fill="none" stroke="#CC0000" strokeWidth="2.2" opacity="0.9" />
      {/* Spinning rim + spokes */}
      <g className="hca-spin" style={{ transformOrigin: `${cx}px ${WY}px` } as never}>
        <circle cx={cx} cy={WY} r={RI} fill="#252538" />
        {spokes(cx, WY).map((s, i) => (
          <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
            stroke="#c0cce0" strokeWidth="5.5" strokeLinecap="round" />
        ))}
        <circle cx={cx} cy={WY} r={RI * 0.22} fill="#CC0000" />
        <circle cx={cx} cy={WY} r={RI * 0.1} fill="#fff" opacity="0.82" />
      </g>
      {/* Glare */}
      <ellipse cx={cx - WR * 0.32} cy={WY - WR * 0.56} rx={WR * 0.15} ry={WR * 0.065}
        fill="white" opacity="0.055"
        transform={`rotate(-25 ${cx - WR * 0.32} ${WY - WR * 0.56})`} />
    </g>
  );

  const archPath = (cx: number) =>
    `M ${cx - WR - 14},338 Q ${cx - WR - 18},${WY - WR * 0.8} ${cx},${WY - WR - 7} Q ${cx + WR + 18},${WY - WR * 0.8} ${cx + WR + 14},338`;

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <style>{`
        @keyframes hcaSpin { to { transform: rotate(360deg); } }
        @keyframes hcaRoad { to { transform: translateX(-180px); } }
        @keyframes hcaBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes hcaFade {
          0% { opacity: 0.18; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(-65px); }
        }
        .hca-spin { animation: hcaSpin 0.82s linear infinite; }
        .hca-road { animation: hcaRoad 0.42s linear infinite; }
        .hca-car  { animation: hcaBob 3.2s ease-in-out infinite; }
        .hca-sl1  { animation: hcaFade 0.7s ease-out infinite; }
        .hca-sl2  { animation: hcaFade 0.7s ease-out 0.18s infinite; }
        .hca-sl3  { animation: hcaFade 0.7s ease-out 0.36s infinite; }
      `}</style>

      <svg viewBox="0 0 1000 520" xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMax meet" className="absolute inset-0 w-full h-full">

        <defs>
          <linearGradient id="hcaTextGuard" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#0A0A14" stopOpacity="1" />
            <stop offset="48%"  stopColor="#0A0A14" stopOpacity="0.75" />
            <stop offset="72%"  stopColor="#0A0A14" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#0A0A14" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hcaBottomFade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"  stopColor="#0A0A14" stopOpacity="0" />
            <stop offset="100%" stopColor="#0A0A14" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* ── ROAD ── */}
        <rect x="0" y="382" width="1000" height="138" fill="#06070e" />
        <line x1="0" y1="382" x2="1000" y2="382" stroke="#CC0000" strokeWidth="1.5" opacity="0.28" />
        <g className="hca-road">
          {[-180,0,180,360,540,720,900,1080].map((x,i) => (
            <rect key={i} x={x} y="418" width="110" height="5" rx="2.5" fill="white" opacity="0.055" />
          ))}
        </g>

        {/* ── SPEED STREAKS ── */}
        {[248,268,284,298,310,320].map((y, i) => (
          <line key={i} x1={0} y1={y} x2={45 + i * 24} y2={y}
            stroke="white" strokeWidth={i % 2 ? 0.8 : 1.5}
            className={i < 2 ? 'hca-sl1' : i < 4 ? 'hca-sl2' : 'hca-sl3'} />
        ))}

        {/* ── CAR ── */}
        <g className="hca-car">

          {/* Shadow */}
          <ellipse cx="430" cy="384" rx="248" ry="9" fill="black" opacity="0.5" />

          {/* BODY */}
          <path d="
            M 124,342 L 114,316 L 114,288
            L 152,274 L 198,226 L 244,186
            L 390,168 L 556,168 L 600,180
            L 632,232 L 672,260 L 716,274
            L 740,288 L 748,308 L 748,342 Z
          " fill="#0c0d1c" />

          {/* Lower panel */}
          <rect x="114" y="310" width="634" height="33" fill="#070810" />

          {/* GREENHOUSE */}
          <path d="M 246 230 L 264 188 L 390 170 L 554 170 L 596 184 L 626 230 Z"
            fill="#0b0c1a" />
          {/* Windshield */}
          <path d="M 252 228 L 272 190 L 386 172 L 386 228 Z"
            fill="#112540" opacity="0.92" />
          <path d="M 275 192 L 296 188 L 302 228 L 278 228 Z" fill="white" opacity="0.03" />
          {/* Rear window */}
          <path d="M 394 172 L 550 172 L 592 188 L 618 228 L 394 228 Z"
            fill="#112540" opacity="0.92" />

          {/* Side windows */}
          <path d="M 258 232 L 382 232 L 382 304 L 198 304 L 198 276 L 230 248 Z"
            fill="#091c34" opacity="0.68" />
          <path d="M 390 232 L 614 232 L 614 304 L 390 304 Z"
            fill="#091c34" opacity="0.68" />

          {/* Pillars */}
          <line x1="384" y1="230" x2="384" y2="310" stroke="#CC0000" strokeWidth="1.5" opacity="0.4" />
          <line x1="266" y1="190" x2="266" y2="232" stroke="#0c0d1c" strokeWidth="9" />

          {/* RED ACCENT STRIPE */}
          <path d="M 120 290 Q 432 286 744 288"
            stroke="#CC0000" strokeWidth="2.5" fill="none" opacity="0.68" />

          {/* Hood vents */}
          <line x1="658" y1="262" x2="700" y2="274" stroke="#CC0000" strokeWidth="1.5" opacity="0.35" />
          <line x1="654" y1="268" x2="698" y2="280" stroke="#CC0000" strokeWidth="1" opacity="0.25" />

          {/* HEADLIGHT */}
          <path d="M 726 276 L 748 282 L 748 304 L 726 302 Z" fill="#fff" opacity="0.96" />
          <path d="M 728 278 L 746 284 L 746 302 L 728 300 Z" fill="#ffe880" opacity="0.65" />
          <line x1="724" y1="272" x2="674" y2="268" stroke="#fff" strokeWidth="2.5" opacity="0.52" />
          <path d="M 748 284 L 1000 270 L 1000 296 L 748 302 Z" fill="#fffde0" opacity="0.032" />

          {/* TAILLIGHT */}
          <rect x="114" y="260" rx="2" width="9" height="46" fill="#CC0000" opacity="0.95" />
          <rect x="115" y="263" rx="1" width="4" height="40" fill="#ff5050" opacity="0.5" />

          {/* TALON BADGE */}
          <text x="168" y="328" fontSize="11" fontFamily="'Arial Black',sans-serif"
            fontWeight="900" fill="#CC0000" letterSpacing="4" opacity="0.88">TALON</text>

          {/* WHEELS */}
          <Wheel cx={FWX} />
          <Wheel cx={RWX} />

          {/* Wheel arch masks */}
          <path d={archPath(FWX)} fill="none" stroke="#0c0d1c" strokeWidth="20" />
          <path d={archPath(RWX)} fill="none" stroke="#0c0d1c" strokeWidth="20" />

          {/* Undercarriage between wheels */}
          <rect x={RWX + WR + 8} y="322"
            width={FWX - WR - 14 - RWX - WR - 8} height="60"
            fill="#070810" />
        </g>

        {/* Text-side overlay */}
        <rect x="0" y="0" width="520" height="520" fill="url(#hcaTextGuard)" />
        {/* Bottom fade */}
        <rect x="0" y="440" width="1000" height="80" fill="url(#hcaBottomFade)" />
      </svg>
    </div>
  );
}
