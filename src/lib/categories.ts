import {
  Camera,
  CircleDashed,
  Focus,
  LayoutGrid,
  Puzzle,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type Category = {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Only set for categories with their own dedicated page (e.g. the mask configurator). */
  href?: string;
};

export const CATEGORIES: Category[] = [
  {
    slug: "wszystko",
    icon: LayoutGrid,
    title: "Wszystko",
    description: "Pełen przegląd oferty — akcesoria, adaptery i elementy na zamówienie.",
  },
  {
    slug: "akcesoria-do-teleskopow",
    icon: Wrench,
    title: "Akcesoria do teleskopów",
    description: "Uchwyty, śruby regulacyjne i drobne usprawnienia montażu.",
  },
  {
    slug: "adaptery-do-aparatow-i-kamer",
    icon: Camera,
    title: "Adaptery do aparatów i kamer",
    description: "Dedykowane łączniki pod astrofotografię i autoguiding.",
  },
  {
    slug: "elementy-zamienne",
    icon: Puzzle,
    title: "Elementy zamienne",
    description: "Zagubione lub zużyte części odtworzone na miarę.",
  },
  {
    slug: "maski-bahtinova",
    icon: Focus,
    title: "Maski Bahtinova i Tri-Bahtinova",
    description: "Zamów maskę dopasowaną do Twoich potrzeb.",
    href: "/maska-bahtinova",
  },
  {
    slug: "projekty-na-zamowienie",
    icon: CircleDashed,
    title: "Projekty na zamówienie",
    description: "Indywidualny model pod Twój sprzęt i pomysł.",
    href: "/projekty-na-zamowienie",
  },
];
