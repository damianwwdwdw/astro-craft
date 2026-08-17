// Jednorazowy skrypt migracyjny: przenosi produkt "Szukacz laserowy" ze
// statycznego src/lib/products.ts (skąd został usunięty) do tabeli
// `products` w bazie, żeby był widoczny i zarządzalny w /admin/produkty.
//
// Użycie (raz, po wdrożeniu):
//   DATABASE_URL="<connection string z Vercel>" node scripts/seed-szukacz-laserowy.mjs
// albo lokalnie po `vercel env pull .env.local`:
//   node --env-file=.env.local scripts/seed-szukacz-laserowy.mjs
//
// Bezpieczny do wielokrotnego uruchomienia — używa ON CONFLICT DO NOTHING.

import { Pool } from "pg";

const STANDARD_COLOR_IDS = [
  "czarny",
  "bialy",
  "kosciana-biel",
  "szary",
  "ciemny-braz",
  "jasnoniebieski-przezroczysty",
  "latte-brazowy",
  "mandarynkowy",
  "morski",
  "pustynny-bez",
  "rozowy",
  "czarny-polysk",
  "galaxy-z-drobinkami",
  "srebrny-polysk",
  "zloty-polysk",
  "bialy-polysk",
];

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("Brak DATABASE_URL w środowisku.");
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await pool.query(
      `CREATE TABLE IF NOT EXISTS products (
        slug TEXT PRIMARY KEY,
        category_slug TEXT NOT NULL,
        title TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        description TEXT NOT NULL,
        features TEXT[] NOT NULL DEFAULT '{}',
        images TEXT[] NOT NULL,
        color_ids TEXT[],
        custom_field_label TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`
    );

    const result = await pool.query(
      `INSERT INTO products (slug, category_slug, title, excerpt, description, features, images, color_ids, custom_field_label)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (slug) DO NOTHING
       RETURNING slug`,
      [
        "szukacz-laserowy-vixen",
        "akcesoria-do-teleskopow",
        "Szukacz laserowy do teleskopu na stopce Vixen",
        "Precyzyjne celowanie bez szukania w polu widzenia okularu.",
        "Szukacz laserowy do teleskopu, mocowany na standardowej stopce Vixen — pozwala szybko wycelować teleskop, zanim jeszcze spojrzysz przez okular.",
        [
          "W zestawie: uchwyt szukacza, laser, śruby pozycjonujące, ładowarka, kluczyk zabezpieczający i smycz.",
          "Śruby mają końcówki z tworzywa (widoczne na zdjęciu), które chronią obudowę lasera przed zarysowaniami i pozwalają precyzyjnie ustawić wiązkę.",
          "Kluczyk pozwala trwale wyłączyć laser — przydatne, gdy w domu są dzieci.",
          "Całość zapakowana w kartonowe pudełko z zabezpieczeniem z gąbki.",
        ],
        [
          "/products/szukacz-laserowy/01-produkt.jpg",
          "/products/szukacz-laserowy/02-w-akcji.jpg",
          "/products/szukacz-laserowy/03-detal-srubka.jpg",
          "/products/szukacz-laserowy/04-zestaw.jpg",
        ],
        STANDARD_COLOR_IDS,
        null,
      ]
    );

    if (result.rows.length > 0) {
      console.log("Dodano produkt 'szukacz-laserowy-vixen' do bazy.");
    } else {
      console.log("Produkt 'szukacz-laserowy-vixen' już istnieje w bazie — pominięto.");
    }
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Błąd migracji:", error);
  process.exit(1);
});
