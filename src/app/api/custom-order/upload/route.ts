import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { MAX_FILE_SIZE_BYTES } from "@/lib/attachment-limits";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // Formularz "Projekt na zamówienie" akceptuje dowolny typ pliku
        // (zdjęcia, PDF, pliki CAD/3D) — jedyne ograniczenie to rozmiar,
        // takie samo jak w formularzu kontaktowym.
        // TODO: rozważyć rate limiting, jeśli endpoint zacznie być nadużywany.
        return {
          maximumSizeInBytes: MAX_FILE_SIZE_BYTES,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log("Załącznik formularza zamówienia przesłany:", blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
