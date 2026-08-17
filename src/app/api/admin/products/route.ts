import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { ensureProductsTable, getPool } from "@/lib/db";
import { getUniqueSlug, mapRow, type DbProduct } from "@/lib/db-products";
import { CATEGORIES } from "@/lib/categories";
import { STANDARD_COLORS } from "@/lib/products";

export const runtime = "nodejs";

const MAX_IMAGES = 8;

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

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
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

  const data = (body ?? {}) as Record<string, unknown>;
  const title = typeof data.title === "string" ? data.title.trim() : "";
  const excerpt = typeof data.excerpt === "string" ? data.excerpt.trim() : "";
  const description = typeof data.description === "string" ? data.description.trim() : "";
  const categorySlug = typeof data.categorySlug === "string" ? data.categorySlug : "";
  const features = isStringArray(data.features)
    ? data.features.map((f) => f.trim()).filter(Boolean)
    : [];
  const images = isStringArray(data.images) ? data.images.filter(Boolean) : [];
  const colorIds = isStringArray(data.colorIds) ? data.colorIds : [];
  const customFieldLabel =
    typeof data.customFieldLabel === "string" && data.customFieldLabel.trim()
      ? data.customFieldLabel.trim()
      : null;
  const customFieldType = data.customFieldType === "number" ? "number" : "text";
  const customFieldMin =
    customFieldLabel && customFieldType === "number" && typeof data.customFieldMin === "number"
      ? data.customFieldMin
      : null;
  const customFieldMax =
    customFieldLabel && customFieldType === "number" && typeof data.customFieldMax === "number"
      ? data.customFieldMax
      : null;

  if (!title || !excerpt || !description) {
    return NextResponse.json(
      { success: false, error: "Tytuł, skrót i opis są wymagane." },
      { status: 400 }
    );
  }
  if (!CATEGORIES.some((c) => c.slug === categorySlug) || categorySlug === "wszystko") {
    return NextResponse.json(
      { success: false, error: "Nieprawidłowa kategoria." },
      { status: 400 }
    );
  }
  if (images.length === 0 || images.length > MAX_IMAGES) {
    return NextResponse.json(
      { success: false, error: `Wymagane jest od 1 do ${MAX_IMAGES} zdjęć.` },
      { status: 400 }
    );
  }
  const validColorIds = new Set(STANDARD_COLORS.map((c) => c.id));
  if (colorIds.some((id) => !validColorIds.has(id))) {
    return NextResponse.json(
      { success: false, error: "Nieprawidłowy wybór koloru." },
      { status: 400 }
    );
  }
  if (
    customFieldLabel &&
    customFieldType === "number" &&
    (customFieldMin === null || customFieldMax === null || customFieldMin > customFieldMax)
  ) {
    return NextResponse.json(
      { success: false, error: "Podaj prawidłowy zakres liczbowy (min ≤ max)." },
      { status: 400 }
    );
  }

  try {
    await ensureProductsTable();
    const slug = await getUniqueSlug(title);

    const { rows } = await getPool().query(
      `INSERT INTO products (slug, category_slug, title, excerpt, description, features, images, color_ids, custom_field_label, custom_field_type, custom_field_min, custom_field_max)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        slug,
        categorySlug,
        title,
        excerpt,
        description,
        features,
        images,
        colorIds,
        customFieldLabel,
        customFieldType,
        customFieldMin,
        customFieldMax,
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
