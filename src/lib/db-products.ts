import { ensureProductsTable, getPool } from "@/lib/db";
import { getProduct } from "@/lib/products";

export type CustomFieldType = "text" | "number";

export type DbProduct = {
  slug: string;
  categorySlug: string;
  title: string;
  excerpt: string;
  description: string[];
  features: string[];
  images: string[];
  colorIds: string[];
  customFieldLabel: string | null;
  customFieldType: CustomFieldType;
  customFieldMin: number | null;
  customFieldMax: number | null;
};

export function mapRow(row: {
  slug: string;
  category_slug: string;
  title: string;
  excerpt: string;
  description: string;
  features: string[];
  images: string[];
  color_ids: string[] | null;
  custom_field_label: string | null;
  custom_field_type: string | null;
  custom_field_min: string | number | null;
  custom_field_max: string | number | null;
}): DbProduct {
  return {
    slug: row.slug,
    categorySlug: row.category_slug,
    title: row.title,
    excerpt: row.excerpt,
    description: row.description
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean),
    features: row.features ?? [],
    images: row.images ?? [],
    colorIds: row.color_ids ?? [],
    customFieldLabel: row.custom_field_label,
    customFieldType: row.custom_field_type === "number" ? "number" : "text",
    customFieldMin: row.custom_field_min === null ? null : Number(row.custom_field_min),
    customFieldMax: row.custom_field_max === null ? null : Number(row.custom_field_max),
  };
}

const POLISH_DIACRITICS: Record<string, string> = {
  ą: "a",
  ć: "c",
  ę: "e",
  ł: "l",
  ń: "n",
  ó: "o",
  ś: "s",
  ź: "z",
  ż: "z",
};

export function slugify(title: string): string {
  const transliterated = title
    .toLowerCase()
    .split("")
    .map((char) => POLISH_DIACRITICS[char] ?? char)
    .join("");

  return transliterated
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function getDbProductBySlug(slug: string): Promise<DbProduct | null> {
  if (!process.env.DATABASE_URL) return null;
  try {
    await ensureProductsTable();
    const { rows } = await getPool().query(`SELECT * FROM products WHERE slug = $1`, [slug]);
    if (rows.length === 0) return null;
    return mapRow(rows[0]);
  } catch {
    return null;
  }
}

export async function getUniqueSlug(title: string): Promise<string> {
  const base = slugify(title) || "produkt";
  let candidate = base;
  let suffix = 2;

  while (true) {
    const takenStatically = Boolean(getProduct(candidate));
    const { rows } = await getPool().query(`SELECT 1 FROM products WHERE slug = $1`, [
      candidate,
    ]);
    if (!takenStatically && rows.length === 0) return candidate;
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}
