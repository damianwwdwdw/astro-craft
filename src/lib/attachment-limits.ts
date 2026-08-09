// Współdzielone między klientem (walidacja przed wysyłką) a
// src/app/api/contact/upload/route.ts (walidacja tokenu Vercel Blob).
export const ALLOWED_ATTACHMENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
] as const;

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB na plik
export const MAX_TOTAL_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB łącznie

// Zdjęcie do opinii — bez PDF i SVG, to ma być zwykła fotografia.
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
] as const;
