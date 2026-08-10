"use client";

import { AlertCircle, CheckCircle2, Mail, Minus, Package, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ColorSwatchGrid } from "@/components/color-swatch-grid";
import { DEFAULT_HOLE_RATIO, type MaskType, type Mounting } from "@/components/mask-configurator";
import { MaskPreview, type MaskPreviewProps } from "@/components/mask-3d-preview";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";
import { CONTAINER } from "@/components/sections/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart, type CartItem } from "@/lib/cart-context";
import { getProduct } from "@/lib/products";

function describeItem(item: CartItem): string {
  const parts: string[] = [];
  if (item.colorName) parts.push(`kolor: ${item.colorName}`);
  if (item.specs && item.specs.length > 0) {
    parts.push(item.specs.map((spec) => `${spec.label}: ${spec.value}`).join(", "));
  }
  return parts.join(", ");
}

function extractNumber(value: string): number | null {
  const match = value.match(/[\d.]+/);
  if (!match) return null;
  const num = Number(match[0]);
  return Number.isFinite(num) ? num : null;
}

function getMaskPreviewProps(item: CartItem): MaskPreviewProps | null {
  if (item.productSlug !== "maska-bahtinova" || !item.specs) return null;
  const specMap = new Map(item.specs.map((spec) => [spec.label, spec.value]));

  const maskType: MaskType = specMap.get("Typ maski")?.includes("Tri") ? "tri-bahtinov" : "bahtinov";
  const mounting: Mounting = specMap.get("Mocowanie")?.includes("W tubę") ? "w-tube" : "na-tube";

  const diameterEntry = item.specs.find((spec) => spec.label.startsWith("Średnica"));
  const diameterMM = diameterEntry ? extractNumber(diameterEntry.value) : null;
  if (!diameterMM) return null;

  const secondDimensionEntry = item.specs.find(
    (spec) => spec.label.startsWith("Wysokość kołnierza") || spec.label.startsWith("Głębokość wsunięcia")
  );
  const secondDimensionMM = secondDimensionEntry ? extractNumber(secondDimensionEntry.value) : null;
  if (!secondDimensionMM) return null;

  const holeValue = specMap.get("Otwór centralny");
  const holeDiameterMM = holeValue ? extractNumber(holeValue) ?? diameterMM * DEFAULT_HOLE_RATIO : null;

  return { maskType, mounting, diameterMM, secondDimensionMM, holeDiameterMM };
}

export default function CartPage() {
  const { items, itemCount, removeItem, updateQuantity, updateColor } = useCart();

  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [orderStatus, setOrderStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle"
  );
  const [orderError, setOrderError] = useState("");

  const orderMessage = useMemo(() => {
    if (items.length === 0) return "";
    const lines = items.map((item) => {
      const desc = describeItem(item);
      return `- ${item.productTitle}${desc ? ` — ${desc}` : ""} — ilość: ${item.quantity}`;
    });
    return `Dzień dobry,\n\nchciał(a)bym zamówić:\n${lines.join("\n")}\n\nProszę o kontakt w sprawie realizacji zamówienia.`;
  }, [items]);

  const mailtoHref = `mailto:kontakt@astro-craft.pl?subject=${encodeURIComponent(
    "Zamówienie ze strony — koszyk"
  )}&body=${encodeURIComponent(orderMessage)}`;

  const busy = orderStatus === "sending";

  async function handleSendOrder(event: FormEvent) {
    event.preventDefault();
    if (!email.trim() || items.length === 0) return;

    setOrderStatus("sending");
    setOrderError("");

    try {
      const response = await fetch("/api/cart-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          description,
          items: items.map((item) => ({
            title: item.productTitle,
            details: describeItem(item),
            quantity: item.quantity,
          })),
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        setOrderStatus("error");
        setOrderError(data.error ?? "Nie udało się wysłać zapytania.");
        return;
      }

      setOrderStatus("success");
    } catch {
      setOrderStatus("error");
      setOrderError("Wystąpił błąd. Spróbuj ponownie.");
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className={`${CONTAINER} py-20`}>
          <h1 className="font-heading text-2xl font-semibold sm:text-3xl">Koszyk</h1>

          {items.length === 0 ? (
            <div className="mt-10 flex flex-col items-center gap-4 text-center">
              <ShoppingCart className="text-muted-foreground size-10" />
              <p className="text-muted-foreground text-sm">
                Twój koszyk jest pusty. Dodaj produkty ze sklepu, aby przygotować zapytanie ofertowe.
              </p>
              <Button nativeButton={false} render={<Link href="/sklep" />}>
                Przejdź do sklepu
              </Button>
            </div>
          ) : (
            <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
              <div className="flex flex-col gap-4">
                {items.map((item) => {
                  const product = getProduct(item.productSlug);
                  const color = product?.colors?.find((c) => c.id === item.colorId);
                  const maskPreviewProps = getMaskPreviewProps(item);
                  return (
                    <Card key={item.id}>
                      <CardContent className="flex flex-col gap-1">
                        <div className="flex items-start gap-4">
                          {maskPreviewProps ? (
                            <div className="h-16 w-24 shrink-0">
                              <MaskPreview {...maskPreviewProps} className="h-full w-full" />
                            </div>
                          ) : (
                            <div className="bg-muted relative size-16 shrink-0 overflow-hidden rounded-lg">
                              {item.productImage ? (
                                <Image
                                  src={item.productImage}
                                  alt={item.productTitle}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="text-muted-foreground flex size-full items-center justify-center">
                                  <Package className="size-6" />
                                </div>
                              )}
                            </div>
                          )}

                          <div className="flex min-w-0 flex-1 flex-col gap-1">
                            {product ? (
                              <Link
                                href={`/produkt/${item.productSlug}`}
                                className="font-heading text-sm font-semibold hover:underline"
                              >
                                {item.productTitle}
                              </Link>
                            ) : (
                              <p className="font-heading text-sm font-semibold">
                                {item.productTitle}
                              </p>
                            )}
                            {item.colorName && (
                              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                                {color && (
                                  <span className="relative size-4 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
                                    <Image
                                      src={color.swatch}
                                      alt=""
                                      fill
                                      className="object-cover"
                                    />
                                  </span>
                                )}
                                Kolor: {item.colorName}
                              </div>
                            )}
                            {item.specs && item.specs.length > 0 && (
                              <ul className="text-muted-foreground text-xs leading-relaxed">
                                {item.specs.map((spec) => (
                                  <li key={spec.label}>
                                    {spec.label}: {spec.value}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon-sm"
                              aria-label="Zmniejsz ilość"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="size-3.5" />
                            </Button>
                            <span className="w-6 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon-sm"
                              aria-label="Zwiększ ilość"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="size-3.5" />
                            </Button>
                          </div>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Usuń z koszyka"
                            onClick={() => removeItem(item.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>

                        {item.colorId && product?.colors && product.colors.length > 1 && (
                          <Accordion multiple={false}>
                            <AccordionItem value="kolor">
                              <AccordionTrigger>Zmień kolor</AccordionTrigger>
                              <AccordionContent>
                                <ColorSwatchGrid
                                  colors={product.colors}
                                  selectedId={item.colorId}
                                  swatchClassName="size-8"
                                  onSelect={(newColor) =>
                                    updateColor(item.id, newColor.id, newColor.name)
                                  }
                                />
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <Card className="bg-card/60 lg:sticky lg:top-24">
                <CardContent className="flex flex-col gap-5">
                  <p className="font-heading font-semibold">Podsumowanie</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Liczba sztuk</span>
                    <span className="font-medium">{itemCount}</span>
                  </div>

                  {orderStatus === "success" ? (
                    <div className="flex flex-col items-center gap-3 py-4 text-center">
                      <CheckCircle2 className="text-brand-violet size-8" />
                      <p className="font-heading text-sm font-semibold">Zapytanie wysłane</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Dziękuję za zapytanie — odezwę się najszybciej jak to możliwe.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSendOrder} className="flex flex-col gap-5">
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Sklep nie obsługuje płatności online — podaj e-mail, a przygotuję wycenę
                        i dostępność.
                      </p>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="cart-email">E-mail *</Label>
                        <Input
                          id="cart-email"
                          type="email"
                          required
                          value={email}
                          disabled={busy}
                          onChange={(event) => setEmail(event.target.value)}
                          placeholder="np. jan@example.com"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="cart-description">Dodatkowy opis (opcjonalnie)</Label>
                        <Textarea
                          id="cart-description"
                          value={description}
                          disabled={busy}
                          onChange={(event) => setDescription(event.target.value)}
                          placeholder="Dodatkowe informacje do zamówienia..."
                        />
                      </div>

                      {orderStatus === "error" && (
                        <div className="text-destructive flex items-center gap-2 text-sm">
                          <AlertCircle className="size-4 shrink-0" />
                          {orderError}
                        </div>
                      )}

                      <Button
                        type="submit"
                        disabled={busy || !email.trim()}
                        className="from-brand-violet to-brand-periwinkle w-full bg-gradient-to-br px-6 py-3 text-white"
                      >
                        <Mail className="size-4" />
                        {busy ? "Wysyłanie..." : "Wyślij zapytanie"}
                      </Button>

                      <a
                        href={mailtoHref}
                        className="text-muted-foreground hover:text-foreground text-center text-xs transition-colors"
                      >
                        lub napisz bezpośrednio na kontakt@astro-craft.pl
                      </a>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
