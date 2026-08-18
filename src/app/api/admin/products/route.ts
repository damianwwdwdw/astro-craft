import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { ensureProductsTable, getPool } from "@/lib/db";
import { getUniqueSlug, mapRow, type DbProduct } from "@/lib/db-products";
import { validateProductInput } from "@/lib/validate-product-input";

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
    await ensureProductsTable();
    const { rows } = await getPool().query(`SELECT * FROM products ORDER BY created_at DESC`);
    const products: DbProduct[] = rows.map(mapRow);
    return NextResponse.json({ success: true, products });
  } catch {
    return NextResponse.json(
      { success: false, error: "Nie udało się pobrać produktów." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ success: false, error: "Brak autoryzacji." }, { status: 401 });
  }
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
    return NextResponse.json({ success: false, error: "Nieprawidłowe dane." }, { status: 400 });
  }

  const parsed = validateProductInput(body);
  if ("error" in parsed) {
    return NextResponse.json({ success: false, error: parsed.error }, { status: 400 });
  }

  try {
    await ensureProductsTable();
    const slug = await getUniqueSlug(parsed.title);

    const { rows } = await getPool().query(
      `INSERT INTO products (slug, category_slug, title, excerpt, description, features, images, color_ids, custom_field_label, custom_field_type, custom_field_min, custom_field_max)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        slug,
        parsed.categorySlug,
        parsed.title,
        parsed.excerpt,
        parsed.description,
        parsed.features,
        parsed.images,
        parsed.colorIds,
        parsed.customFieldLabel,
        parsed.customFieldType,
        parsed.customFieldMin,
        parsed.customFieldMax,
      ]
    );

    return NextResponse.json({ success: true, product: mapRow(rows[0]) });
  } catch {
    return NextResponse.json(
      { success: false, error: "Nie udało się zapisać produktu." },
      { status: 500 }
    );
  }
}
