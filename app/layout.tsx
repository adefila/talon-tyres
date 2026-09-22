import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
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
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="bg-white text-[#0A0A14] antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
