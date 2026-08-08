import { Compass, Palette, Ruler } from "lucide-react";
import { CONTAINER, SectionHeading } from "@/components/sections/shared";

const POINTS = [
  {
    icon: Compass,
    title: "Odporność na warunki",
    description:
      "Materiały dobrane pod wilgoć i niskie temperatury nocnego nieba. Na życzenie klienta możliwy wydruk z materiału odpornego również na wysokie temperatury i promieniowanie UV — np. do obserwacji Słońca.",
  },
  {
    icon: Ruler,
    title: "Szyte na miarę sprzętu",
    description: "Projekty dopasowane do konkretnego modelu teleskopu czy aparatu.",
  },
  {
    icon: Palette,
    title: "Kolor do wyboru",
    description:
      "Na życzenie klienta wydrukuję w wybranym kolorze — od czerni, przez niebieski, motyw galaktyki, zieleń, aż po srebrny czy złoty.",
  },
];

export function About() {
  return (
    <section id="o-nas" className={`${CONTAINER} py-20`}>
      <SectionHeading
        eyebrow="O mnie"
        title="Pasja do nieba, rzemiosło druku 3D"
        description="Astro Craft to połączenie wieloletniego doświadczenia w astronomii amatorskiej z drukiem 3D. Każdy projekt zaczyna się od realnej potrzeby przy teleskopie — i kończy się częścią zaprojektowaną tak, by działała w terenie, nie tylko na papierze."
      />

      <div className="mt-14 grid gap-8 sm:grid-cols-3">
        {POINTS.map((point) => (
          <div key={point.title} className="flex flex-col items-center gap-3 text-center">
            <div className="bg-brand-violet/15 flex size-12 items-center justify-center rounded-full">
              <point.icon className="text-brand-violet size-5" />
            </div>
            <p className="font-heading font-semibold">{point.title}</p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {point.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
