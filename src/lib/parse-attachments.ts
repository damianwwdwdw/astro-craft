const MAX_ATTACHMENTS = 10;

export type ParsedAttachment = { url: string; filename: string };

// Wejście to lista {url, filename} wygenerowana po udanym uploadzie do
// Vercel Blob po stronie klienta — tu tylko sanity-check kształtu danych.
export function parseAttachments(value: unknown): ParsedAttachment[] {
  if (!Array.isArray(value)) return [];
  const attachments: ParsedAttachment[] = [];
  for (const item of value.slice(0, MAX_ATTACHMENTS)) {
    if (typeof item !== "object" || item === null) continue;
    const { url, filename } = item as Record<string, unknown>;
    if (typeof url !== "string" || !url.startsWith("https://")) continue;
    attachments.push({
      url,
      filename: typeof filename === "string" && filename ? filename.slice(0, 200) : "załącznik",
    });
  }
  return attachments;
}
