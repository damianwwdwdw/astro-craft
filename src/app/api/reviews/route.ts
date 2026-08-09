import { NextResponse } from "next/server";
import { ensureReviewsTable, getPool } from "@/lib/db";
import { validateReviewInput, type Review } from "@/lib/reviews";

export const runtime = "nodejs";

const MAX_REVIEWS = 50;
const RATE_LIMIT_HOURS = 24;

function getClientIp(request: Request): string | null {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return null;
}

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { success: false, error: "Serwer nie jest skonfigurowany." },
      { status: 500 }
    );
  }

  try {
    await ensureReviewsTable();
    const { rows } = await getPool().query(
      `SELECT id, name, content, rating, photo_url, created_at
       FROM reviews
       WHERE status = 'approved'
       ORDER BY created_at DESC
       LIMIT $1`,
      [MAX_REVIEWS]
    );

    const reviews: Review[] = rows.map((row) => ({
      id: row.id,
      name: row.name,
      content: row.content,
      rating: row.rating,
      photoUrl: row.photo_url,
      createdAt: row.created_at,
    }));

    return NextResponse.json({ success: true, reviews });
  } catch {
    return NextResponse.json(
      { success: false, error: "Nie udało się pobrać opinii." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { success: false, error: "Serwer nie jest skonfigurowany." },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Nieprawidłowe dane formularza." },
      { status: 400 }
    );
  }

  const parsed = validateReviewInput(body);
  if ("error" in parsed) {
    return NextResponse.json({ success: false, error: parsed.error }, { status: 400 });
  }

  try {
    await ensureReviewsTable();

    // Jeśli nie da się ustalić IP (np. brak nagłówków proxy), nie blokujemy
    // wysyłki — to dotyczy głównie lokalnego dewelopmentu.
    const ip = getClientIp(request);
    if (ip) {
      const { rows: recent } = await getPool().query(
        `SELECT id FROM reviews
         WHERE ip_address = $1 AND created_at > now() - interval '${RATE_LIMIT_HOURS} hours'
         LIMIT 1`,
        [ip]
      );
      if (recent.length > 0) {
        return NextResponse.json(
          { success: false, error: "Możesz dodać tylko jedną opinię na 24 godziny." },
          { status: 429 }
        );
      }
    }

    const { rows } = await getPool().query(
      `INSERT INTO reviews (name, content, rating, photo_url, status, ip_address)
       VALUES ($1, $2, $3, $4, 'pending', $5)
       RETURNING id, name, content, rating, photo_url, created_at`,
      [parsed.name, parsed.content, parsed.rating, parsed.photoUrl, ip]
    );

    const row = rows[0];
    const review: Review = {
      id: row.id,
      name: row.name,
      content: row.content,
      rating: row.rating,
      photoUrl: row.photo_url,
      createdAt: row.created_at,
    };

    return NextResponse.json({ success: true, review });
  } catch {
    return NextResponse.json(
      { success: false, error: "Nie udało się zapisać opinii." },
      { status: 500 }
    );
  }
}
