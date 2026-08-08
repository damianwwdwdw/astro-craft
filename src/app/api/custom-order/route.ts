import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

// Kept comfortably under Vercel Functions' hard 4.5MB request-body limit,
// leaving headroom for multipart overhead and other form fields.
export const MAX_TOTAL_SIZE_BYTES = 4 * 1024 * 1024;

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { success: false, error: "Serwer nie jest skonfigurowany." },
      { status: 500 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { success: false, error: "Nieprawidłowe dane formularza." },
      { status: 400 }
    );
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const files = formData
    .getAll("attachments")
    .filter((value): value is File => value instanceof File && value.size > 0);

  if (!email || !description) {
    return NextResponse.json(
      { success: false, error: "Podaj adres e-mail i opis projektu." },
      { status: 400 }
    );
  }

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  if (totalSize > MAX_TOTAL_SIZE_BYTES) {
    return NextResponse.json(
      { success: false, error: "Załączniki są zbyt duże (limit 4 MB łącznie)." },
      { status: 413 }
    );
  }

  try {
    const attachments = await Promise.all(
      files.map(async (file) => ({
        filename: file.name,
        content: Buffer.from(await file.arrayBuffer()),
      }))
    );

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      // TODO: po weryfikacji domeny astro-craft.pl w Resend zmień na np. zamowienia@astro-craft.pl
      from: "Astro Craft <onboarding@resend.dev>",
      to: "kontakt@astro-craft.pl",
      replyTo: email,
      subject: `Nowe zapytanie o projekt na zamówienie${name ? ` — ${name}` : ""}`,
      text: `Imię: ${name || "(nie podano)"}\nE-mail: ${email}\n\nOpis projektu:\n${description}`,
      attachments,
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: "Nie udało się wysłać wiadomości." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Wystąpił błąd. Spróbuj ponownie." },
      { status: 500 }
    );
  }
}
