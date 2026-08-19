import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";
import { CONTAINER, SectionHeading } from "@/components/sections/shared";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Polityka plików cookie — Astro Craft",
  description: "Informacja o plikach cookie i lokalnym zapisie danych używanych na astro-craft.pl.",
};

const STORED_ITEMS = [
  {
    name: "astro-craft-cart",
    type: "Lokalny zapis w przeglądarce (localStorage)",
    purpose:
      "Przechowuje zawartość Twojego koszyka, żeby nie znikała po odświeżeniu strony albo jej ponownym otwarciu.",
  },
  {
    name: "astro-craft-cookie-notice-dismissed",
    type: "Lokalny zapis w przeglądarce (localStorage)",
    purpose: "Zapamiętuje, że zapoznałeś/aś się z komunikatem o plikach cookie, żeby nie pokazywać go ponownie.",
  },
];

export default function CookiePolicyPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className={`${CONTAINER} py-20`}>
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href="/" />}
            className="mb-8"
          >
            <ArrowLeft className="size-4" />
            Powrót na stronę główną
          </Button>

          <SectionHeading
            align="left"
            eyebrow="Informacje prawne"
            title="Polityka plików cookie"
            description="Ta strona korzysta tylko z niezbędnych plików cookie i lokalnego zapisu danych w przeglądarce — bez śledzenia, analityki ani reklam."
          />

          <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-8">
            <div className="flex flex-col gap-3">
              <h2 className="font-heading text-lg font-semibold">Czym są te technologie</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Pliki cookie to małe pliki tekstowe zapisywane przez przeglądarkę. Obok nich strona
                korzysta też z tzw. lokalnego zapisu (localStorage) — działa podobnie, ale dane
                zostają wyłącznie w Twojej przeglądarce i nie są wysyłane na serwer przy każdym
                żądaniu.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="font-heading text-lg font-semibold">Czego używamy</h2>
              <div className="flex flex-col gap-4">
                {STORED_ITEMS.map((item) => (
                  <div key={item.name} className="border-border rounded-2xl border p-4">
                    <p className="font-mono text-sm font-semibold">{item.name}</p>
                    <p className="text-brand-lavender mt-1 text-xs">{item.type}</p>
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                      {item.purpose}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="font-heading text-lg font-semibold">Czego nie używamy</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Nie korzystamy z plików cookie do śledzenia, profilowania ani reklam, ani z żadnych
                zewnętrznych narzędzi analitycznych czy marketingowych (np. Google Analytics, Meta
                Pixel).
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="font-heading text-lg font-semibold">Jak zarządzać tymi danymi</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Możesz w każdej chwili usunąć pliki cookie i dane lokalne w ustawieniach swojej
                przeglądarki (zwykle w sekcji „Prywatność” lub „Dane witryn”). Usunięcie danych
                lokalnych wyczyści też zawartość koszyka na tej stronie.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="font-heading text-lg font-semibold">Pytania</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                W razie pytań napisz na{" "}
                <a
                  href="mailto:kontakt@astro-craft.pl"
                  className="text-foreground font-medium hover:underline"
                >
                  kontakt@astro-craft.pl
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
