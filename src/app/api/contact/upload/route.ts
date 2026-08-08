import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { ALLOWED_ATTACHMENT_TYPES, MAX_FILE_SIZE_BYTES } from "@/lib/attachment-limits";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // Formularz kontaktowy jest publiczny (bez logowania), więc jedyną
        // ochroną tokenu jest ścisły whitelist typów i limit rozmiaru pliku.
        // TODO: rozważyć rate limiting, jeśli endpoint zacznie być nadużywany.
        return {
          allowedContentTypes: [...ALLOWED_ATTACHMENT_TYPES],
          maximumSizeInBytes: MAX_FILE_SIZE_BYTES,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async ({ blob }) => {
        // Wywoływane przez Vercel po zakończeniu uploadu (nie działa lokalnie
        // bez tunelu np. ngrok — link i tak trafia do maila przez /api/contact).
        console.log("Załącznik formularza kontaktowego przesłany:", blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
