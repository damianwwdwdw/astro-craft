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

export function ensureReviewsTable(): Promise<void> {
  if (!reviewsTableReady) {
    reviewsTableReady = getPool()
      .query(
        `CREATE TABLE IF NOT EXISTS reviews (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          content TEXT NOT NULL,
          rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
          photo_url TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )`
      )
      .then(() => undefined)
      .catch((error) => {
        // Pozwól kolejnemu wywołaniu spróbować ponownie zamiast trwale
        // zapamiętywać nieudaną inicjalizację tabeli.
        reviewsTableReady = null;
        throw error;
      });
  }
  return reviewsTableReady;
}
