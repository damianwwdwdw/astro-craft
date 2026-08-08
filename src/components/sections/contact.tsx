import { Mail, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { CONTAINER, SectionHeading } from "@/components/sections/shared";

const SOCIAL_LINKS = [
  {
    label: "Astromaniak",
    href: "https://astromaniak.pl/memberlist.php?mode=viewprofile&u=6545",
  },
  {
    label: "Astropolis",
    href: "https://astropolis.pl/profile/21577-damianww/",
  },
];

export function Contact() {
  return (
    <section id="kontakt" className={`${CONTAINER} py-20`}>
      <SectionHeading
        eyebrow="Kontakt"
        title="Porozmawiajmy o Twoim projekcie"
        description="Zadzwoń lub napisz"
      />

      <div className="mt-10 flex flex-col items-center gap-10">
        <ContactForm />

        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="tel:889085455"
            className="from-brand-violet to-brand-periwinkle font-heading inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br px-6 py-3 text-lg font-semibold text-white shadow-[0_10px_30px_-10px_rgba(124,92,252,0.7)] transition-transform hover:-translate-y-0.5"
          >
            <Phone className="size-4.5" />
            889 085 455
          </a>
          <a
            href="mailto:kontakt@astro-craft.pl"
            className="from-brand-violet to-brand-periwinkle font-heading inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br px-6 py-3 text-lg font-semibold text-white shadow-[0_10px_30px_-10px_rgba(124,92,252,0.7)] transition-transform hover:-translate-y-0.5"
          >
            <Mail className="size-4.5" />
            kontakt@astro-craft.pl
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="text-muted-foreground w-full text-center text-sm">
            Znajdziesz mnie też na:
          </span>
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="border-brand-lavender/35 hover:border-brand-violet hover:bg-brand-violet/15 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
