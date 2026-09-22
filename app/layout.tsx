import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TALON Tyres — Engineered for Every Turn",
  description:
    "Experience power, control, and safety with every mile. TALON tyres are crafted for the road ahead—whether it's a daily commute or a rugged expedition.",
  keywords: "tyres, tires, performance tyres, all-season, off-road, TALON",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} scroll-smooth`}>
      <body className="bg-white text-[#0A0A14] antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
