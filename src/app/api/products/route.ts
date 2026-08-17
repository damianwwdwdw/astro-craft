import { NextResponse } from "next/server";
import { ensureProductsTable, getPool } from "@/lib/db";
import { mapRow, type DbProduct } from "@/lib/db-products";

export const runtime = "nodejs";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ success: true, products: [] });
  }

  try {
    await ensureProductsTable();
    const { rows } = await getPool().query(`SELECT * FROM products ORDER BY created_at DESC`);
    const products: DbProduct[] = rows.map(mapRow);
    return NextResponse.json({ success: true, products });
  } catch {
    return NextResponse.json({ success: true, products: [] });
  }
}
