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
};

export const PRODUCTS: Product[] = [
  {
    slug: "szukacz-laserowy-vixen",
    categorySlug: "akcesoria-do-teleskopow",
    title: "Szukacz laserowy do teleskopu na stopce Vixen",
    excerpt: "Precyzyjne celowanie bez szukania w polu widzenia okularu.",
    description: [
      "Szukacz laserowy do teleskopu, mocowany na standardowej stopce Vixen — pozwala szybko wycelować teleskop, zanim jeszcze spojrzysz przez okular.",
    ],
    features: [
      "W zestawie: uchwyt szukacza, laser, śruby pozycjonujące, ładowarka, kluczyk zabezpieczający i smycz.",
      "Śruby mają końcówki z tworzywa (widoczne na zdjęciu), które chronią obudowę lasera przed zarysowaniami i pozwalają precyzyjnie ustawić wiązkę.",
      "Kluczyk pozwala trwale wyłączyć laser — przydatne, gdy w domu są dzieci.",
      "Całość zapakowana w kartonowe pudełko z zabezpieczeniem z gąbki.",
    ],
    images: [
      "/products/szukacz-laserowy/01-produkt.jpg",
      "/products/szukacz-laserowy/02-w-akcji.jpg",
      "/products/szukacz-laserowy/03-detal-srubka.jpg",
      "/products/szukacz-laserowy/04-zestaw.jpg",
    ],
    colors: [
      { id: "bialy", name: "Biały", finish: "Wykończenie klasyczne", swatch: "/products/szukacz-laserowy/kolory/bialy.png" },
      { id: "ciemny-braz", name: "Ciemny Brąz", finish: "Wykończenie klasyczne", swatch: "/products/szukacz-laserowy/kolory/ciemny-braz.png" },
      { id: "czarny", name: "Czarny", finish: "Wykończenie klasyczne", swatch: "/products/szukacz-laserowy/kolory/czarny.png" },
      { id: "jasnoniebieski-przezroczysty", name: "Jasnoniebieski Przeźroczysty", finish: "Wykończenie klasyczne", swatch: "/products/szukacz-laserowy/kolory/jasnoniebieski-przezroczysty.png" },
      { id: "kosciana-biel", name: "Kościana Biel", finish: "Wykończenie klasyczne", swatch: "/products/szukacz-laserowy/kolory/kosciana-biel.png" },
      { id: "latte-brazowy", name: "Latte Brązowy", finish: "Wykończenie klasyczne", swatch: "/products/szukacz-laserowy/kolory/latte-brazowy.png" },
      { id: "mandarynkowy", name: "Mandarynkowy", finish: "Wykończenie klasyczne", swatch: "/products/szukacz-laserowy/kolory/mandarynkowy.png" },
      { id: "morski", name: "Morski", finish: "Wykończenie klasyczne", swatch: "/products/szukacz-laserowy/kolory/morski.png" },
      { id: "pustynny-bez", name: "Pustynny Beż", finish: "Wykończenie klasyczne", swatch: "/products/szukacz-laserowy/kolory/pustynny-bez.png" },
      { id: "rozowy", name: "Różowy", finish: "Wykończenie klasyczne", swatch: "/products/szukacz-laserowy/kolory/rozowy.png" },
      { id: "szary", name: "Szary", finish: "Wykończenie klasyczne", swatch: "/products/szukacz-laserowy/kolory/szary.png" },
      { id: "bialy-polysk", name: "Biały Połysk", finish: "Wykończenie w połysku", swatch: "/products/szukacz-laserowy/kolory/bialy-polysk.png" },
      { id: "czarny-polysk", name: "Czarny Połysk", finish: "Wykończenie w połysku", swatch: "/products/szukacz-laserowy/kolory/czarny-polysk.png" },
      { id: "galaxy-z-drobinkami", name: "Galaxy z drobinkami", finish: "Wykończenie w połysku", swatch: "/products/szukacz-laserowy/kolory/galaxy-z-drobinkami.png" },
      { id: "srebrny-polysk", name: "Srebrny Połysk", finish: "Wykończenie w połysku", swatch: "/products/szukacz-laserowy/kolory/srebrny-polysk.png" },
      { id: "zloty-polysk", name: "Złoty Połysk", finish: "Wykończenie w połysku", swatch: "/products/szukacz-laserowy/kolory/zloty-polysk.png" },
    ],
  },
];

export function getProductsByCategory(categorySlug: string): Product[] {
  return PRODUCTS.filter((product) => product.categorySlug === categorySlug);
}

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug === slug);
}
