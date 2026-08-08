import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const MAX_ATTACHMENTS = 10;

type Attachment = { url: string; filename: string };

function parseAttachments(value: unknown): Attachment[] {
  if (!Array.isArray(value)) return [];
  const attachments: Attachment[] = [];
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

  const { name, email, message, attachments: rawAttachments } = (body ?? {}) as Record<
    string,
    unknown
  >;
  const nameStr = String(name ?? "").trim();
  const emailStr = String(email ?? "").trim();
  const messageStr = String(message ?? "").trim();
  const attachments = parseAttachments(rawAttachments);

  if (!emailStr || !messageStr) {
    return NextResponse.json(
      { success: false, error: "Podaj adres e-mail i wiadomość." },
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
      // TODO: po weryfikacji domeny astro-craft.pl w Resend zmień na np. kontakt@astro-craft.pl
      from: "Astro Craft <onboarding@resend.dev>",
      to: "kontakt@astro-craft.pl",
      replyTo: emailStr,
      subject: `Nowa wiadomość z formularza kontaktowego${nameStr ? ` — ${nameStr}` : ""}`,
      text: `Imię: ${nameStr || "(nie podano)"}\nE-mail: ${emailStr}\n\nWiadomość:\n${messageStr}${attachmentsText}`,
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
