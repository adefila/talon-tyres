import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Marquee from "@/components/Marquee";
import Products from "@/components/Products";
import Technology from "@/components/Technology";
import Reviews from "@/components/Reviews";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Stats />
      <Marquee />
      <Products />
      <Technology />
      <Reviews />
      <CtaBanner />
      <Footer />
    </main>
  );
}
