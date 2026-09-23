"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const MiniTyre = dynamic(() => import("./MiniTyre"), { ssr: false });

interface Props {
  accentColor: string;
  rimColor: string;
  rimLabel: string;
  size: string;
  tyreName: string;
}

/* Spoke pattern for side-view wheel illustration */
function WheelSide({ rimColor, accentColor, size }: { rimColor: string; accentColor: string; size: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.48;   // tyre outer radius
  const rimR = size * 0.33;     // rim outer radius
  const sidewallW = outerR - rimR;
  const hubR = size * 0.07;
  const lugR = size * 0.24;     // lug bolt circle radius
  const lugDot = size * 0.025;  // lug bolt size

  const spokeAngles = Array.from({ length: 5 }, (_, i) => (i / 5) * Math.PI * 2 + Math.PI / 10);

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      style={{ display: "block" }}
    >
      {/* Tyre outer */}
      <circle cx={cx} cy={cy} r={outerR} fill="#0a0a10" />
      {/* Sidewall shine */}
      <circle cx={cx} cy={cy} r={outerR - 2} fill="none" stroke="#1a1a22" strokeWidth={sidewallW - 2} />
      {/* Tread area — dark with subtle banding */}
      <circle cx={cx} cy={cy} r={outerR - 4} fill="none" stroke="#060608" strokeWidth={4} />

      {/* Accent sidewall ring */}
      <circle
        cx={cx} cy={cy}
        r={rimR + sidewallW * 0.45}
        fill="none"
        stroke={accentColor}
        strokeWidth={1.5}
        opacity={0.7}
      />

      {/* Rim face */}
      <circle cx={cx} cy={cy} r={rimR} fill="#1a1a20" />

      {/* 5 spokes */}
      {spokeAngles.map((angle, i) => {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const x1 = cx + cos * hubR * 1.5;
        const y1 = cy + sin * hubR * 1.5;
        const x2 = cx + cos * (rimR - 4);
        const y2 = cy + sin * (rimR - 4);
        const perpX = -sin * (size * 0.062);
        const perpY = cos * (size * 0.062);
        const hubX = cx + cos * hubR;
        const hubY = cy + sin * hubR;
        const rimInX = cx + cos * (rimR - 5);
        const rimInY = cy + sin * (rimR - 5);

        return (
          <polygon
            key={i}
            points={`
              ${hubX - (-sin) * size * 0.032},${hubY - cos * size * 0.032}
              ${hubX + (-sin) * size * 0.032},${hubY + cos * size * 0.032}
              ${rimInX + (-sin) * size * 0.065},${rimInY + cos * size * 0.065}
              ${rimInX - (-sin) * size * 0.065},${rimInY - cos * size * 0.065}
            `}
            fill={rimColor}
            opacity={0.92}
          />
        );
      })}

      {/* Rim outer ring highlight */}
      <circle cx={cx} cy={cy} r={rimR - 1} fill="none" stroke={rimColor} strokeWidth={2.5} opacity={0.4} />

      {/* 5 lug bolts */}
      {spokeAngles.map((angle, i) => {
        const a = angle + Math.PI / 5; // offset between spokes
        return (
          <circle
            key={`lug-${i}`}
            cx={cx + Math.cos(a) * lugR}
            cy={cy + Math.sin(a) * lugR}
            r={lugDot}
            fill="#2a2a32"
          />
        );
      })}

      {/* Hub */}
      <circle cx={cx} cy={cy} r={hubR} fill="#111116" />
      <circle cx={cx} cy={cy} r={hubR * 0.6} fill={accentColor} opacity={0.9} />
    </svg>
  );
}

export default function CarPreview({ accentColor, rimColor, rimLabel, size, tyreName }: Props) {
  /* Car SVG constants */
  const W = 720;
  const H = 270;
  const ground = 242;
  const frontWheelX = 196;
  const rearWheelX = 554;
  const wheelY = ground - 42;
  const archR = 46;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#F8F9FA] overflow-hidden select-none">

      {/* Background grid lines */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: "repeating-linear-gradient(0deg, #000 0, #000 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #000 0, #000 1px, transparent 1px, transparent 40px)"
      }} />

      {/* "On Car" badge */}
      <div className="absolute top-4 left-4 text-[9px] font-bold tracking-[0.22em] uppercase text-[#9CA3AF] flex items-center gap-2 z-10">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        Live Preview
      </div>

      {/* Car illustration container */}
      <div className="relative w-full max-w-[720px] mx-auto px-4">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ display: "block" }}
        >
          {/* Ground surface */}
          <rect x="0" y={ground} width={W} height={H - ground} fill="#EBEBEE" />
          {/* Ground line */}
          <line x1="0" y1={ground} x2={W} y2={ground} stroke="#D1D5DB" strokeWidth="1.5" />
          {/* Ground shadow blur under car */}
          <ellipse cx="375" cy={ground + 4} rx="280" ry="6" fill="#C8CAD0" opacity="0.5" />

          {/* Car body */}
          <path
            d={`
              M 80,${ground}
              L 80,218
              C 82,202 96,190 118,185
              C 148,174 196,165 248,161
              C 270,159 292,140 310,113
              C 326,98 366,92 428,92
              C 480,93 512,103 533,117
              C 546,129 557,145 564,157
              C 570,164 577,170 590,176
              C 602,181 616,189 619,200
              L 620,218
              C 620,230 617,238 609,${ground}
              L ${rearWheelX + archR},${ground}
              A ${archR} ${archR} 0 0 0 ${rearWheelX - archR},${ground}
              L ${frontWheelX + archR},${ground}
              A ${archR} ${archR} 0 0 0 ${frontWheelX - archR},${ground}
              L 80,${ground}
              Z
            `}
            fill="#1C1C2E"
          />

          {/* Windshield glass */}
          <path
            d="M 258,158 C 278,155 294,138 312,112 C 328,97 365,92 427,92 C 426,98 420,102 418,104 C 386,106 354,106 326,114 C 308,120 294,138 278,156 Z"
            fill="#0D1117"
            opacity="0.95"
          />

          {/* Side windows — rear */}
          <path
            d="M 432,93 C 478,94 509,104 531,117 C 548,130 558,146 565,157 L 540,162 C 534,153 526,141 514,130 C 502,119 484,110 452,106 Z"
            fill="#0D1117"
            opacity="0.92"
          />

          {/* Door line */}
          <line x1="430" y1="93" x2="435" y2="186" stroke="#141428" strokeWidth="2" />

          {/* Accent body stripe */}
          <path
            d="M 100,188 C 200,183 350,179 500,180 C 560,181 595,184 618,192"
            stroke={accentColor}
            strokeWidth="2"
            fill="none"
            opacity="0.55"
          />

          {/* Front lights */}
          <rect x="616" y="152" width="8" height="18" rx="2" fill="white" opacity="0.9" />
          <rect x="614" y="162" width="10" height="6" rx="1" fill="#FFFDD0" opacity="0.6" />

          {/* Rear lights */}
          <rect x="77" y="155" width="8" height="20" rx="1" fill={accentColor} opacity="0.9" />
          <rect x="76" y="174" width="10" height="5" rx="1" fill={accentColor} opacity="0.5" />

          {/* Front grille */}
          <path d="M 615,178 C 617,188 618,196 619,200" stroke="#2a2a3e" strokeWidth="3" fill="none" />

          {/* Wheel shadow ellipses on ground */}
          <ellipse cx={frontWheelX} cy={ground + 3} rx="38" ry="5" fill="#B8BAC0" opacity="0.6" />
          <ellipse cx={rearWheelX} cy={ground + 3} rx="38" ry="5" fill="#B8BAC0" opacity="0.6" />
        </svg>

        {/* Wheel overlays — flat side-view illustrations */}
        {[
          { cx: frontWheelX, label: "Front" },
          { cx: rearWheelX, label: "Rear" },
        ].map(({ cx, label }) => (
          <div
            key={label}
            className="absolute"
            style={{
              left: `${(cx / W) * 100}%`,
              top: `${((wheelY - 40) / H) * 100}%`,
              transform: "translateX(-50%)",
              width: `${(80 / W) * 100}%`,
            }}
          >
            <WheelSide rimColor={rimColor} accentColor={accentColor} size={80} />
          </div>
        ))}
      </div>

      {/* Info strip */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="flex items-center gap-6 mt-3 text-[10px] font-semibold tracking-[0.16em] uppercase text-[#6B7280]"
      >
        <span>{tyreName}</span>
        <span className="w-1 h-1 rounded-full bg-[#D1D5DB]" />
        <span style={{ color: rimColor === "#C0C8D8" ? "#374151" : rimColor }}>{rimLabel}</span>
        <span className="w-1 h-1 rounded-full bg-[#D1D5DB]" />
        <span className="font-mono">{size}</span>
      </motion.div>
    </div>
  );
}
