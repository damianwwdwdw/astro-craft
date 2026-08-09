import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { ensureReviewsTable, getPool } from "@/lib/db";
import type { AdminReview } from "@/lib/reviews";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ success: false, error: "Brak autoryzacji." }, { status: 401 });
  }
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { success: false, error: "Serwer nie jest skonfigurowany." },
      { status: 500 }
    );
  }

  try {
    await ensureReviewsTable();
    const { rows } = await getPool().query(
      `SELECT id, name, content, rating, photo_url, created_at, status
       FROM reviews
       ORDER BY created_at DESC`
    );

    const reviews: AdminReview[] = rows.map((row) => ({
      id: row.id,
      name: row.name,
      content: row.content,
      rating: row.rating,
      photoUrl: row.photo_url,
      createdAt: row.created_at,
      status: row.status,
    }));

    return NextResponse.json({ success: true, reviews });
  } catch {
    return NextResponse.json(
      { success: false, error: "Nie udało się pobrać opinii." },
      { status: 500 }
    );
  }
}
