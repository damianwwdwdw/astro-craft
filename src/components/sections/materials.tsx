import { Layers, Settings2, ShieldCheck } from "lucide-react";
import { CONTAINER, SectionHeading } from "@/components/sections/shared";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Odporność na warunki",
    description: "ASA i PETG dobrze znoszą wilgoć, rosę i niskie temperatury nocnych obserwacji.",
  },
  {
    icon: Layers,
    title: "Precyzja wydruku",
    description: "Warstwa 0,1–0,2 mm zapewnia gładkie pasowanie do gwintów i mocowań.",
  },
  {
    icon: Settings2,
    title: "Dopasowanie do sprzętu",
    description: "Wymiary i tolerancje weryfikowane pod konkretny model teleskopu lub aparatu.",
  },
];

export function Materials() {
  return (
    <section id="materialy" className={`${CONTAINER} py-20`}>
      <div className="border-brand-lavender/15 bg-card/40 grid gap-10 rounded-3xl border p-8 sm:p-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <SectionHeading
          eyebrow="Materiały i jakość"
          title="Wytrzymują noc pod gwiazdami"
          align="left"
        />

        <div className="grid gap-6 sm:grid-cols-3 lg:gap-4">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="flex flex-col gap-2">
              <feature.icon className="text-brand-violet size-5" />
              <p className="text-sm font-semibold">{feature.title}</p>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
