import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

type OrderItem = {
  title: string;
  details: string;
  quantity: number;
};

function parseItems(raw: unknown): OrderItem[] {
  if (!Array.isArray(raw)) return [];
  const items: OrderItem[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const { title, details, quantity } = entry as Record<string, unknown>;
    const titleStr = String(title ?? "").trim();
    const quantityNum = Number(quantity);
    if (!titleStr || !Number.isFinite(quantityNum) || quantityNum <= 0) continue;
    items.push({
      title: titleStr,
      details: String(details ?? "").trim(),
      quantity: quantityNum,
    });
  }
  return items;
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

  const { email, description } = (body ?? {}) as Record<string, unknown>;
  const emailStr = String(email ?? "").trim();
  const descriptionStr = String(description ?? "").trim();
  const items = parseItems((body as Record<string, unknown>)?.items);

  if (!emailStr) {
    return NextResponse.json(
      { success: false, error: "Podaj adres e-mail." },
      { status: 400 }
    );
  }

  if (items.length === 0) {
    return NextResponse.json(
      { success: false, error: "Koszyk jest pusty." },
      { status: 400 }
    );
  }

  const itemsText = items
    .map((item) => `- ${item.title}${item.details ? ` — ${item.details}` : ""} — ilość: ${item.quantity}`)
    .join("\n");

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: "Astro Craft <kontakt@astro-craft.pl>",
      to: "kontakt@astro-craft.pl",
      replyTo: emailStr,
      subject: "Nowe zapytanie ze strony — koszyk",
      text: `E-mail: ${emailStr}\n\nZamówienie:\n${itemsText}${
        descriptionStr ? `\n\nDodatkowy opis:\n${descriptionStr}` : ""
      }`,
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
