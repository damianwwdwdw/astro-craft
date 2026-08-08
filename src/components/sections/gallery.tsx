import { ImageIcon } from "lucide-react";
import { CONTAINER, SectionHeading } from "@/components/sections/shared";

const PLACEHOLDER_COUNT = 6;

export function Gallery() {
  return (
    <section id="galeria" className={`${CONTAINER} py-20`}>
      <SectionHeading
        eyebrow="Realizacje"
        title="Galeria projektów"
        description="Zdjęcia gotowych realizacji pojawią się tutaj wkrótce."
      />

      <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {Array.from({ length: PLACEHOLDER_COUNT }).map((_, index) => (
          <div
            key={index}
            className="border-brand-lavender/15 bg-card/40 flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border"
          >
            <ImageIcon className="text-muted-foreground size-6" />
            <span className="text-muted-foreground text-xs">Wkrótce</span>
          </div>
        ))}
      </div>
    </section>
  );
}
