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
  /** Filtr słoneczny: wariant pojedynczy/bino + średnica standardowa/własna + opcjonalny napis. */
  requiresSolarFilterConfig?: boolean;
  /** Zaślepka na okular: wybór średnicy (1,25"/2"/własna) + kolor. */
  requiresEyepieceCapConfig?: boolean;
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
  {
    slug: "filtr-sloneczny-baader-nd-5",
    categorySlug: "akcesoria-do-teleskopow",
    title: "Filtr słoneczny Baader ND 5.0",
    excerpt: "Bezpieczna, wizualna obserwacja Słońca — na lornetkę lub teleskop, w wersji pojedynczej lub bino.",
    description: [
      "Kompletny zestaw — w skład wchodzi zarówno oprawka drukowana na miarę pod Twój sprzęt, jak i sama folia filtra słonecznego Baader ND 5.0. Nic więcej nie musisz dokupować — pojedynczy na jeden obiektyw albo podwójny (bino) na lornetkę.",
      "Do wyboru standardowa średnica obiektywu 43-64mm, pasująca do większości lornetek oraz teleskopów Dobson, albo dowolna średnica podana przez Ciebie.",
    ],
    features: [
      "Filtr ND 5.0 (Baader) — bezpieczna, wizualna obserwacja Słońca.",
      "W zestawie zarówno oprawka, jak i folia filtra — komplet gotowy do użycia.",
      "Wersja pojedyncza (jeden obiektyw) lub bino (na lornetkę).",
      "Średnica standardowa 43-64mm albo podana indywidualnie.",
      "Możliwość dodania własnego napisu na oprawce.",
    ],
    images: [
      "/products/filtr-sloneczny/01-produkt.jpg",
      "/products/filtr-sloneczny/02-napis.jpg",
      "/products/filtr-sloneczny/03-w-akcji-lornetka.jpg",
      "/products/filtr-sloneczny/04-bino.jpg",
      "/products/filtr-sloneczny/05-w-akcji-teleskop.jpg",
      "/products/filtr-sloneczny/06-detal-teleskop.jpg",
      "/products/filtr-sloneczny/07-detal-mocowanie.jpg",
    ],
    colors: STANDARD_COLORS,
    requiresSolarFilterConfig: true,
  },
  {
    slug: "elastyczna-zaslepka-na-okular",
    categorySlug: "elementy-zamienne",
    title: "Elastyczna zaślepka na okular",
    excerpt: "Elastyczna, silikonowa w dotyku zaślepka chroniąca okular przed kurzem i wilgocią.",
    description: [
      "Elastyczna zaślepka na okular — chroni soczewkę przed kurzem, wilgocią i zarysowaniami, gdy okular nie jest używany. Dzięki elastycznemu materiałowi łatwo się zakłada i ściąga, a jednocześnie pewnie trzyma się na okularze.",
      "Do wyboru dwie standardowe średnice (1,25 cala i 2 cale) albo dowolna średnica podana przez Ciebie.",
    ],
    features: [
      "Elastyczny materiał — łatwy montaż i zdejmowanie, pewne trzymanie.",
      "Chroni soczewkę okularu przed kurzem, wilgocią i zarysowaniami.",
      "Średnica 1,25 cala, 2 cale albo podana indywidualnie w mm.",
    ],
    images: [
      "/products/zaslepka-na-okular/01-produkt.jpg",
      "/products/zaslepka-na-okular/02-produkt-gora.jpg",
      "/products/zaslepka-na-okular/03-w-akcji-na-okularze.jpg",
      "/products/zaslepka-na-okular/04-para.jpg",
      "/products/zaslepka-na-okular/05-detal-elastycznosc.jpg",
    ],
    colors: [
      {
        id: "elastyczny-czarny",
        name: "Elastyczny Czarny",
        finish: "Wykończenie klasyczne",
        swatch: "/products/szukacz-laserowy/kolory/czarny.png",
      },
      {
        id: "elastyczny-pomaranczowy",
        name: "Elastyczny Pomarańczowy",
        finish: "Wykończenie klasyczne",
        swatch: "/products/szukacz-laserowy/kolory/mandarynkowy.png",
      },
    ],
    requiresEyepieceCapConfig: true,
  },
];

export function getProductsByCategory(categorySlug: string): Product[] {
  return PRODUCTS.filter((product) => product.categorySlug === categorySlug);
}

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug === slug);
}
