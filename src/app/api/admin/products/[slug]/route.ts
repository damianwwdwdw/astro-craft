import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { ensureProductsTable, getPool } from "@/lib/db";
import { mapRow } from "@/lib/db-products";
import { validateProductInput } from "@/lib/validate-product-input";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ success: false, error: "Brak autoryzacji." }, { status: 401 });
  }
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { success: false, error: "Serwer nie jest skonfigurowany." },
      { status: 500 }
    );
  }

  const { slug } = await params;

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
    // Slug (i tym samym adres /produkt/[slug]) zostaje niezmienny przy edycji
    // — zmiana tytułu nie może przypadkiem zepsuć już udostępnionych linków.
    const { rows } = await getPool().query(
      `UPDATE products
       SET category_slug = $1, title = $2, excerpt = $3, description = $4, features = $5,
           images = $6, color_ids = $7, custom_field_label = $8, custom_field_type = $9,
           custom_field_min = $10, custom_field_max = $11
       WHERE slug = $12
       RETURNING *`,
      [
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
        slug,
      ]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Nie znaleziono ogłoszenia." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product: mapRow(rows[0]) });
  } catch {
    return NextResponse.json(
      { success: false, error: "Nie udało się zaktualizować produktu." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ success: false, error: "Brak autoryzacji." }, { status: 401 });
  }

  const { slug } = await params;

  try {
    await ensureProductsTable();
    await getPool().query(`DELETE FROM products WHERE slug = $1`, [slug]);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Nie udało się usunąć produktu." },
      { status: 500 }
    );
  }
}
