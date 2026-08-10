import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { MaskConfigurator } from "@/components/mask-configurator";
import { MaskPreview } from "@/components/mask-3d-preview";
import { CONTAINER, SectionHeading } from "@/components/sections/shared";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";

export const metadata: Metadata = {
  title: "Maska Bahtinova na miarę — Astro Craft",
  description:
    "Skonfiguruj maskę Bahtinova lub Tri-Bahtinova dopasowaną do Twojego teleskopu.",
};

export default function MaskaBahtinovaPage() {
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

          <div className="mx-auto mb-6 w-full max-w-[280px]">
            <MaskPreview
              maskType="bahtinov"
              mounting="na-tube"
              diameterMM={200}
              secondDimensionMM={13}
              holeDiameterMM={null}
            />
          </div>

          <SectionHeading
            eyebrow="Sklep"
            title="Maska Bahtinova na miarę"
            description="Skonfiguruj wymiary swojej maski — Bahtinov lub Tri-Bahtinov, dopasowane do konkretnej tuby."
          />

          <div className="mt-14">
            <MaskConfigurator />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
