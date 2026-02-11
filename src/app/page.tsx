import Background from "@/components/Background";
import Hero from "@/components/Hero";
import Contributions from "@/components/Contributions";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative">
      <Background />
      <Hero />
      <Contributions />
      <Footer />
    </main>
  );
}
