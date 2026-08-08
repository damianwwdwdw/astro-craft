import { MessageSquare, PencilRuler, Printer, Truck } from "lucide-react";
import { CONTAINER, SectionHeading } from "@/components/sections/shared";

const STEPS = [
  {
    icon: MessageSquare,
    title: "Kontakt i wycena",
    description: "Opisujesz potrzebę, wspólnie ustalamy zakres i wycenę projektu.",
  },
  {
    icon: PencilRuler,
    title: "Projekt 3D",
    description: "Przygotowujemy lub dopracowujemy model pod Twój konkretny sprzęt.",
  },
  {
    icon: Printer,
    title: "Druk i wykończenie",
    description: "Drukujemy w materiale dobranym do zastosowania i starannie wykańczamy.",
  },
  {
    icon: Truck,
    title: "Wysyłka",
    description: "Bezpiecznie pakujemy i wysyłamy gotowy element pod wskazany adres lub do paczkomatu.",
  },
];

export function Process() {
  return (
    <section id="proces" className={`${CONTAINER} py-20`}>
      <SectionHeading eyebrow="Jak to działa" title="Od pomysłu do gotowej części" />

      <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, index) => (
          <div key={step.title} className="relative flex flex-col gap-3">
            <span className="text-brand-violet/40 font-heading text-4xl font-semibold">
              {String(index + 1).padStart(2, "0")}
            </span>
            <step.icon className="text-brand-periwinkle size-5" />
            <p className="font-heading font-semibold">{step.title}</p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
