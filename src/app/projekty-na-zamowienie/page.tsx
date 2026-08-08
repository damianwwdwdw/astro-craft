import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CustomProjectForm } from "@/components/custom-project-form";
import { CONTAINER, SectionHeading } from "@/components/sections/shared";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";

export const metadata: Metadata = {
  title: "Projekt na zamówienie — Astro Craft",
  description: "Prześlij swój projekt lub pomysł — przygotuję wycenę indywidualnego wydruku.",
};

export default function ProjektyNaZamowieniePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className={`${CONTAINER} py-20`}>
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href="/sklep" />}
            className="mb-8"
          >
            <ArrowLeft className="size-4" />
            Powrót
          </Button>

          <SectionHeading
            eyebrow="Sklep"
            title="Projekt na zamówienie"
            description="Masz pomysł na własny element albo model, którego nie ma w katalogu? Prześlij swój projekt lub pomysł na poniższy adres mailowy. Odpowiem w przeciągu 48h."
          />

          <div className="mt-10">
            <CustomProjectForm />
          </div>

          <p className="text-muted-foreground mt-8 text-center text-sm">
            Możesz też napisać bezpośrednio na{" "}
            <a
              href="mailto:kontakt@astro-craft.pl"
              className="text-foreground font-medium hover:underline"
            >
              kontakt@astro-craft.pl
            </a>
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
