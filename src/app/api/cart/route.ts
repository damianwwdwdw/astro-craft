import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { ensureSavedCartsTable, getPool } from "@/lib/db";
import type { CartItem } from "@/lib/cart-context";

export const runtime = "nodejs";

const MAX_ITEMS = 50;

function isValidItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.productSlug === "string" &&
    item.productSlug.length > 0 &&
    typeof item.productTitle === "string" &&
    item.productTitle.length > 0 &&
    typeof item.quantity === "number" &&
    item.quantity > 0
  );
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
      { success: false, error: "Nieprawidłowe dane koszyka." },
      { status: 400 }
    );
  }

  const items = (body as { items?: unknown })?.items;
  if (!Array.isArray(items) || items.length === 0 || items.length > MAX_ITEMS) {
    return NextResponse.json(
      { success: false, error: "Nieprawidłowa zawartość koszyka." },
      { status: 400 }
    );
  }
  if (!items.every(isValidItem)) {
    return NextResponse.json(
      { success: false, error: "Nieprawidłowa zawartość koszyka." },
      { status: 400 }
    );
  }

  try {
    await ensureSavedCartsTable();

    const token = randomBytes(9).toString("base64url");
    await getPool().query(`INSERT INTO saved_carts (token, items) VALUES ($1, $2)`, [
      token,
      JSON.stringify(items),
    ]);

    return NextResponse.json({ success: true, token });
  } catch {
    return NextResponse.json(
      { success: false, error: "Nie udało się zapisać koszyka." },
      { status: 500 }
    );
  }
}
