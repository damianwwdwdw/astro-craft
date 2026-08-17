import { Pool } from "pg";

// Współdzielona pula połączeń — w środowisku serverless (Vercel) przetrwa
// między "ciepłymi" wywołaniami dzięki cache'owaniu na poziomie modułu.
let pool: Pool | null = null;

export function getPool(): Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      // Standardowa konfiguracja dla hostowanych baz (Neon, Supabase, Vercel
      // Postgres itp.), które wymagają SSL, ale niekoniecznie z pełnym
      // łańcuchem certyfikatów weryfikowalnym domyślnie przez node.
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
}

let reviewsTableReady: Promise<void> | null = null;

async function migrateReviewsTable(): Promise<void> {
  const pool = getPool();

  await pool.query(
    `CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      content TEXT NOT NULL,
      rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
      photo_url TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`
  );

  // Dodaje kolumnę `status` tylko przy pierwszym uruchomieniu po wdrożeniu
  // moderacji. Jeśli tabela już istniała (i miała jakieś wiersze sprzed tej
  // zmiany), od razu oznacza je jako 'approved', żeby nie zniknęły z
  // publicznej listy — nowe wiersze wstawiane od teraz zawsze dostają
  // status 'pending' jawnie w INSERCIE, więc ten backfill nigdy nie
  // nadpisze statusu ustawionego świadomie przez aplikację.
  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'reviews' AND column_name = 'status'
      ) THEN
        ALTER TABLE reviews ADD COLUMN status TEXT NOT NULL DEFAULT 'pending';
        UPDATE reviews SET status = 'approved';
      END IF;
    END $$;
  `);

  await pool.query(`ALTER TABLE reviews ADD COLUMN IF NOT EXISTS ip_address TEXT`);
}

export function ensureReviewsTable(): Promise<void> {
  if (!reviewsTableReady) {
    reviewsTableReady = migrateReviewsTable().catch((error) => {
      // Pozwól kolejnemu wywołaniu spróbować ponownie zamiast trwale
      // zapamiętywać nieudaną inicjalizację tabeli.
      reviewsTableReady = null;
      throw error;
    });
  }
  return reviewsTableReady;
}

let savedCartsTableReady: Promise<void> | null = null;

async function migrateSavedCartsTable(): Promise<void> {
  const pool = getPool();

  await pool.query(
    `CREATE TABLE IF NOT EXISTS saved_carts (
      token TEXT PRIMARY KEY,
      items JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`
  );
}

export function ensureSavedCartsTable(): Promise<void> {
  if (!savedCartsTableReady) {
    savedCartsTableReady = migrateSavedCartsTable().catch((error) => {
      savedCartsTableReady = null;
      throw error;
    });
  }
  return savedCartsTableReady;
}

let productsTableReady: Promise<void> | null = null;

async function migrateProductsTable(): Promise<void> {
  const pool = getPool();

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

  // Pole klienta może być tekstowe (jak dotąd) albo liczbowe z zakresem —
  // istniejące wiersze dostają 'text' (zgodne z ich dotychczasowym
  // zachowaniem), min/max zostają puste dopóki admin ich nie ustawi.
  await pool.query(
    `ALTER TABLE products ADD COLUMN IF NOT EXISTS custom_field_type TEXT NOT NULL DEFAULT 'text'`
  );
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS custom_field_min NUMERIC`);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS custom_field_max NUMERIC`);
}

export function ensureProductsTable(): Promise<void> {
  if (!productsTableReady) {
    productsTableReady = migrateProductsTable().catch((error) => {
      productsTableReady = null;
      throw error;
    });
  }
  return productsTableReady;
}
