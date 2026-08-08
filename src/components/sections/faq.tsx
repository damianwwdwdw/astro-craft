import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CONTAINER, SectionHeading } from "@/components/sections/shared";

const FAQ_ITEMS = [
  {
    question: "Jak długo trwa realizacja zamówienia?",
    answer:
      "Zwykle 2–5 dni roboczych, w zależności od złożoności projektu i aktualnego obłożenia.",
  },
  {
    question: "Czy mogę zamówić projekt dopasowany do mojego sprzętu?",
    answer:
      "Tak — prześlij wymiary lub zdjęcie elementu, a przygotujemy dopasowany projekt na miarę.",
  },
  {
    question: "Jakie materiały są używane do druku?",
    answer:
      "Najczęściej ASA i PETG, ze względu na odporność na wilgoć i niskie temperatury nocnych obserwacji.",
  },
  {
    question: "Czy wysyłacie poza Polskę?",
    answer:
      "Obecnie wysyłki realizowane są na terenie Polski — w sprawie wysyłki zagranicznej skontaktuj się bezpośrednio.",
  },
];

export function Faq() {
  return (
    <section className={`${CONTAINER} py-20`}>
      <SectionHeading eyebrow="FAQ" title="Najczęściej zadawane pytania" />

      <div className="mx-auto mt-12 max-w-2xl">
        <Accordion multiple={false}>
          {FAQ_ITEMS.map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">{item.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
