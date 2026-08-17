export type ProductColorFinish = "Wykończenie klasyczne" | "Wykończenie w połysku";

export type ProductColor = {
  id: string;
  name: string;
  finish: ProductColorFinish;
  swatch: string;
};

export type Product = {
  slug: string;
  categorySlug: string;
  title: string;
  excerpt: string;
  description: string[];
  features: string[];
  images: string[];
  colors?: ProductColor[];
  /** Odrośnik: konfigurator wymiarów (średnica tuby + wysokość) zamiast zwykłego wyboru koloru. */
  requiresDimensions?: boolean;
  /** Starship + Booster: wybór elementów (checkboxy) zamiast koloru. */
  stageOptions?: { id: string; label: string }[];
};

// Standardowa paleta kolorów/wykończeń — współdzielona przez produkty drukowane na miarę.
export const STANDARD_COLORS: ProductColor[] = [
  { id: "czarny", name: "Czarny", finish: "Wykończenie klasyczne", swatch: "/products/szukacz-laserowy/kolory/czarny.png" },
  { id: "bialy", name: "Biały", finish: "Wykończenie klasyczne", swatch: "/products/szukacz-laserowy/kolory/bialy.png" },
  { id: "kosciana-biel", name: "Kościana Biel", finish: "Wykończenie klasyczne", swatch: "/products/szukacz-laserowy/kolory/kosciana-biel.png" },
  { id: "szary", name: "Szary", finish: "Wykończenie klasyczne", swatch: "/products/szukacz-laserowy/kolory/szary.png" },
  { id: "ciemny-braz", name: "Ciemny Brąz", finish: "Wykończenie klasyczne", swatch: "/products/szukacz-laserowy/kolory/ciemny-braz.png" },
  { id: "jasnoniebieski-przezroczysty", name: "Jasnoniebieski Przeźroczysty", finish: "Wykończenie klasyczne", swatch: "/products/szukacz-laserowy/kolory/jasnoniebieski-przezroczysty.png" },
  { id: "latte-brazowy", name: "Latte Brązowy", finish: "Wykończenie klasyczne", swatch: "/products/szukacz-laserowy/kolory/latte-brazowy.png" },
  { id: "mandarynkowy", name: "Mandarynkowy", finish: "Wykończenie klasyczne", swatch: "/products/szukacz-laserowy/kolory/mandarynkowy.png" },
  { id: "morski", name: "Morski", finish: "Wykończenie klasyczne", swatch: "/products/szukacz-laserowy/kolory/morski.png" },
  { id: "pustynny-bez", name: "Pustynny Beż", finish: "Wykończenie klasyczne", swatch: "/products/szukacz-laserowy/kolory/pustynny-bez.png" },
  { id: "rozowy", name: "Różowy", finish: "Wykończenie klasyczne", swatch: "/products/szukacz-laserowy/kolory/rozowy.png" },
  { id: "czarny-polysk", name: "Czarny Połysk", finish: "Wykończenie w połysku", swatch: "/products/szukacz-laserowy/kolory/czarny-polysk.png" },
  { id: "galaxy-z-drobinkami", name: "Galaxy z drobinkami", finish: "Wykończenie w połysku", swatch: "/products/szukacz-laserowy/kolory/galaxy-z-drobinkami.png" },
  { id: "srebrny-polysk", name: "Srebrny Połysk", finish: "Wykończenie w połysku", swatch: "/products/szukacz-laserowy/kolory/srebrny-polysk.png" },
  { id: "zloty-polysk", name: "Złoty Połysk", finish: "Wykończenie w połysku", swatch: "/products/szukacz-laserowy/kolory/zloty-polysk.png" },
  { id: "bialy-polysk", name: "Biały Połysk", finish: "Wykończenie w połysku", swatch: "/products/szukacz-laserowy/kolory/bialy-polysk.png" },
];

export const PRODUCTS: Product[] = [
  {
    slug: "odrosnik-na-tube",
    categorySlug: "akcesoria-do-teleskopow",
    title: "Odrośnik na tubę, szukacz, itd.",
    excerpt: "Chroni lustro przed osadzającą się wilgocią i szronem.",
    description: [
      "Odrośnik drukowany na miarę pod średnicę Twojej tuby, szukacza lub innego akcesorium — wydłuża osłonę i chroni optykę przed osadzającą się wilgocią i szronem podczas obserwacji.",
    ],
    features: [
      "Wymiary dopasowane indywidualnie do średnicy tuby i potrzebnej wysokości.",
      "Stabilny, mocny montaż.",
    ],
    images: [
      "/products/odrosnik/01-produkt.jpg",
      "/products/odrosnik/02-w-akcji.jpg",
      "/products/odrosnik/03-w-akcji-2.jpg",
    ],
    colors: STANDARD_COLORS,
    requiresDimensions: true,
  },
  {
    slug: "starship-booster",
    categorySlug: "gadzety",
    title: "Starship + Booster w skali 1:200",
    excerpt: "Model rakiety SpaceX Starship i boostera Super Heavy w skali 1:200.",
    description: [
      "Model w skali 1:200. Przy zakupie pierwszego i drugiego stopnia (Booster + Starship) w komplecie dorzucam pierścień łączący.",
    ],
    features: [
      "Dwie części do wyboru osobno lub razem: Starship i Booster (Super Heavy), obie w skali 1:200.",
      "Przy zakupie obu stopni razem w zestawie gratis pierścień łączący.",
    ],
    images: [
      "/products/starship-booster/01-produkt.jpg",
      "/products/starship-booster/02-produkt.jpg",
      "/products/starship-booster/03-detal.jpg",
      "/products/starship-booster/04-detal.jpg",
      "/products/starship-booster/05-detal.jpg",
      "/products/starship-booster/06-detal.jpg",
      "/products/starship-booster/07-super-heavy.jpg",
      "/products/starship-booster/08-detal.jpg",
    ],
    stageOptions: [
      { id: "starship", label: "Starship skala 1:200" },
      { id: "booster", label: "Booster skala 1:200" },
    ],
  },
];

export function getProductsByCategory(categorySlug: string): Product[] {
  return PRODUCTS.filter((product) => product.categorySlug === categorySlug);
}

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug === slug);
}
