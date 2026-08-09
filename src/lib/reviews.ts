export type ReviewStatus = "pending" | "approved";

export type Review = {
  id: number;
  name: string;
  content: string;
  rating: number;
  photoUrl: string | null;
  createdAt: string;
};

export type AdminReview = Review & { status: ReviewStatus };

export const MAX_NAME_LENGTH = 100;
export const MAX_CONTENT_LENGTH = 2000;

export type ReviewInput = {
  name: string;
  content: string;
  rating: number;
  photoUrl?: string | null;
};

export function validateReviewInput(body: unknown): ReviewInput | { error: string } {
  const { name, content, rating, photoUrl } = (body ?? {}) as Record<string, unknown>;

  const nameStr = String(name ?? "").trim();
  const contentStr = String(content ?? "").trim();
  const ratingNum = Number(rating);

  if (!nameStr) return { error: "Podaj imię." };
  if (nameStr.length > MAX_NAME_LENGTH) return { error: "Imię jest za długie." };
  if (!contentStr) return { error: "Treść opinii nie może być pusta." };
  if (contentStr.length > MAX_CONTENT_LENGTH) return { error: "Treść opinii jest za długa." };
  if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return { error: "Ocena musi być liczbą całkowitą od 1 do 5." };
  }

  let photoUrlStr: string | null = null;
  if (typeof photoUrl === "string" && photoUrl.trim()) {
    if (!photoUrl.startsWith("https://")) return { error: "Nieprawidłowy link do zdjęcia." };
    photoUrlStr = photoUrl.trim();
  }

  return { name: nameStr, content: contentStr, rating: ratingNum, photoUrl: photoUrlStr };
}
