import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Careers } from "@/components/home/Careers";

export default function ContactPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#ffffff" }}>
      <Navbar />
      <Careers hideHeader className="section-lines-light" />
      <Footer />
    </main>
  );
}
