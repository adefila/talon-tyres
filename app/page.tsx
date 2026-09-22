import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TyreFinder from "@/components/TyreFinder";
import Stats from "@/components/Stats";
import Marquee from "@/components/Marquee";
import Products from "@/components/Products";
import TyreShowcase from "@/components/TyreShowcase";
import Technology from "@/components/Technology";
import TyreConfigurator from "@/components/TyreConfigurator";
import Reviews from "@/components/Reviews";
import PressLogos from "@/components/PressLogos";
import FAQ from "@/components/FAQ";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <TyreFinder />
      <Stats />
      <Marquee />
      <Products />
      <TyreShowcase />
      <Technology />
      <TyreConfigurator />
      <Reviews />
      <PressLogos />
      <FAQ />
      <CtaBanner />
      <Footer />
    </main>
  );
}
