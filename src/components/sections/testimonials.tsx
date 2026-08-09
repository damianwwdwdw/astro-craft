import { ReviewsList } from "@/components/reviews-list";
import { CONTAINER, SectionHeading } from "@/components/sections/shared";

export function Testimonials() {
  return (
    <section id="opinie" className={`${CONTAINER} py-20`}>
      <SectionHeading
        eyebrow="Opinie"
        title="Opinie klientów"
        description="Zobacz, co mówią klienci — i podziel się własną opinią."
      />

      <div className="mt-10">
        <ReviewsList />
      </div>
    </section>
  );
}
