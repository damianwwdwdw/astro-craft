import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopCatalog } from "@/components/shop-catalog";
import { CONTAINER, SectionHeading } from "@/components/sections/shared";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";

export const metadata: Metadata = {
  title: "Sklep — Astro Craft",
  description: "Przeglądaj i filtruj ofertę Astro Craft — akcesoria do teleskopów, adaptery, maski Bahtinova i więcej.",
};

export default function SklepPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className={`${CONTAINER} py-20`}>
          <SectionHeading
            eyebrow="Sklep"
            title="Znajdź to, czego potrzebujesz"
            description="Przeszukaj ofertę albo wybierz kategorię — katalog wciąż rośnie, ale zapytanie zawsze trafi bezpośrednio do mnie."
          />

          <div className="mt-14">
            <Suspense fallback={null}>
              <ShopCatalog />
            </Suspense>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
