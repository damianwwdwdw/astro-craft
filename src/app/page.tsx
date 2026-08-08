import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Faq } from "@/components/sections/faq";
import { Footer } from "@/components/sections/footer";
import { Gallery } from "@/components/sections/gallery";
import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { Materials } from "@/components/sections/materials";
import { Process } from "@/components/sections/process";
import { Testimonials } from "@/components/sections/testimonials";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <About />
        <Process />
        <Materials />
        <Gallery />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
