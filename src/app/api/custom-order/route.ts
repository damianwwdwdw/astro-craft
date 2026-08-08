import { NextResponse } from "next/server";
import { Resend } from "resend";
import { parseAttachments } from "@/lib/parse-attachments";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { success: false, error: "Serwer nie jest skonfigurowany." },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Nieprawidłowe dane formularza." },
      { status: 400 }
    );
  }

  const { name, email, description, attachments: rawAttachments } = (body ?? {}) as Record<
    string,
    unknown
  >;
  const nameStr = String(name ?? "").trim();
  const emailStr = String(email ?? "").trim();
  const descriptionStr = String(description ?? "").trim();
  const attachments = parseAttachments(rawAttachments);

  if (!emailStr || !descriptionStr) {
    return NextResponse.json(
      { success: false, error: "Podaj adres e-mail i opis projektu." },
      { status: 400 }
    );
  }

  const attachmentsText =
    attachments.length > 0
      ? `\n\nZałączniki:\n${attachments.map((a) => `- ${a.filename}: ${a.url}`).join("\n")}`
      : "";

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: "Astro Craft <kontakt@astro-craft.pl>",
      to: "kontakt@astro-craft.pl",
      replyTo: emailStr,
      subject: `Nowe zapytanie o projekt na zamówienie${nameStr ? ` — ${nameStr}` : ""}`,
      text: `Imię: ${nameStr || "(nie podano)"}\nE-mail: ${emailStr}\n\nOpis projektu:\n${descriptionStr}${attachmentsText}`,
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
