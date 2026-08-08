import { Quote } from "lucide-react";
import { CONTAINER, SectionHeading } from "@/components/sections/shared";

export function Testimonials() {
  return (
    <section className={`${CONTAINER} py-20`}>
      <SectionHeading
        eyebrow="Opinie"
        title="Opinie klientów"
        comingSoon
        description="Pierwsze realizacje są w drodze — opinie klientów pojawią się w tym miejscu wkrótce."
      />

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="border-brand-lavender/15 bg-card/30 flex flex-col gap-3 rounded-2xl border border-dashed p-6 opacity-60"
          >
            <Quote className="text-brand-periwinkle size-5" />
            <div className="bg-muted-foreground/20 h-3 w-full rounded" />
            <div className="bg-muted-foreground/20 h-3 w-4/5 rounded" />
          </div>
        ))}
      </div>
    </section>
  );
}
