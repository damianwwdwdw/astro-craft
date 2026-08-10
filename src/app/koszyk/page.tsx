"use client";

import { Mail, Minus, Package, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ColorSwatchGrid } from "@/components/color-swatch-grid";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";
import { CONTAINER } from "@/components/sections/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart, type CartItem } from "@/lib/cart-context";
import { getProduct } from "@/lib/products";

function describeItem(item: CartItem): string {
  if (item.colorName) return `kolor: ${item.colorName}`;
  if (item.specs && item.specs.length > 0) {
    return item.specs.map((spec) => `${spec.label}: ${spec.value}`).join(", ");
  }
  return "";
}

export default function CartPage() {
  const { items, itemCount, removeItem, updateQuantity, updateColor } = useCart();

  const orderMessage = useMemo(() => {
    if (items.length === 0) return "";
    const lines = items.map((item) => {
      const description = describeItem(item);
      return `- ${item.productTitle}${description ? ` — ${description}` : ""} — ilość: ${item.quantity}`;
    });
    return `Dzień dobry,\n\nchciał(a)bym zamówić:\n${lines.join("\n")}\n\nProszę o kontakt w sprawie realizacji zamówienia.`;
  }, [items]);

  const mailtoHref = `mailto:kontakt@astro-craft.pl?subject=${encodeURIComponent(
    "Zamówienie ze strony — koszyk"
  )}&body=${encodeURIComponent(orderMessage)}`;

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
                  return (
                    <Card key={item.id}>
                      <CardContent className="flex flex-col gap-1">
                        <div className="flex items-center gap-4">
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
                            {item.colorName ? (
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
                            ) : (
                              item.specs &&
                              item.specs.length > 0 && (
                                <ul className="text-muted-foreground text-xs leading-relaxed">
                                  {item.specs.map((spec) => (
                                    <li key={spec.label}>
                                      {spec.label}: {spec.value}
                                    </li>
                                  ))}
                                </ul>
                              )
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
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Sklep nie obsługuje płatności online — wyślij zapytanie, a przygotuję wycenę
                    i dostępność.
                  </p>
                  <div className="flex flex-col gap-2">
                    <a
                      href={mailtoHref}
                      className="from-brand-violet to-brand-periwinkle font-heading inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(124,92,252,0.7)] transition-transform hover:-translate-y-0.5"
                    >
                      <Mail className="size-4" />
                      Wyślij zapytanie mailem
                    </a>
                  </div>
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
