import { CATEGORIES } from "@/lib/categories";
import { STANDARD_COLORS } from "@/lib/products";

export const MAX_PRODUCT_IMAGES = 8;

export type ValidatedProductInput = {
  title: string;
  excerpt: string;
  description: string;
  categorySlug: string;
  features: string[];
  images: string[];
  colorIds: string[];
  customFieldLabel: string | null;
  customFieldType: "text" | "number";
  customFieldMin: number | null;
  customFieldMax: number | null;
};

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

/** Współdzielone między POST (nowe ogłoszenie) i PATCH (edycja). */
export function validateProductInput(body: unknown): ValidatedProductInput | { error: string } {
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
    return { error: "Tytuł, skrót i opis są wymagane." };
  }
  if (!CATEGORIES.some((c) => c.slug === categorySlug) || categorySlug === "wszystko") {
    return { error: "Nieprawidłowa kategoria." };
  }
  if (images.length === 0 || images.length > MAX_PRODUCT_IMAGES) {
    return { error: `Wymagane jest od 1 do ${MAX_PRODUCT_IMAGES} zdjęć.` };
  }
  const validColorIds = new Set(STANDARD_COLORS.map((c) => c.id));
  if (colorIds.some((id) => !validColorIds.has(id))) {
    return { error: "Nieprawidłowy wybór koloru." };
  }
  if (
    customFieldLabel &&
    customFieldType === "number" &&
    (customFieldMin === null || customFieldMax === null || customFieldMin > customFieldMax)
  ) {
    return { error: "Podaj prawidłowy zakres liczbowy (min ≤ max)." };
  }

  return {
    title,
    excerpt,
    description,
    categorySlug,
    features,
    images,
    colorIds,
    customFieldLabel,
    customFieldType,
    customFieldMin,
    customFieldMax,
  };
}
