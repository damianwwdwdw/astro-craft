import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { ensureReviewsTable, getPool } from "@/lib/db";

export const runtime = "nodejs";

function parseId(id: string): number | null {
  const parsed = Number(id);
  return Number.isInteger(parsed) ? parsed : null;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ success: false, error: "Brak autoryzacji." }, { status: 401 });
  }

  const { id } = await params;
  const reviewId = parseId(id);
  if (reviewId === null) {
    return NextResponse.json({ success: false, error: "Nieprawidłowe ID." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Nieprawidłowe dane." }, { status: 400 });
  }

  const { status } = (body ?? {}) as Record<string, unknown>;
  if (status !== "approved" && status !== "pending") {
    return NextResponse.json({ success: false, error: "Nieprawidłowy status." }, { status: 400 });
  }

  try {
    await ensureReviewsTable();
    await getPool().query(`UPDATE reviews SET status = $1 WHERE id = $2`, [status, reviewId]);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Nie udało się zaktualizować opinii." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ success: false, error: "Brak autoryzacji." }, { status: 401 });
  }

  const { id } = await params;
  const reviewId = parseId(id);
  if (reviewId === null) {
    return NextResponse.json({ success: false, error: "Nieprawidłowe ID." }, { status: 400 });
  }

  try {
    await ensureReviewsTable();
    await getPool().query(`DELETE FROM reviews WHERE id = $1`, [reviewId]);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Nie udało się usunąć opinii." },
      { status: 500 }
    );
  }
}
