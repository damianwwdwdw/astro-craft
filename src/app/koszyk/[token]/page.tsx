import { ArrowLeft, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LoadSavedCartButton } from "@/components/load-saved-cart-button";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";
import { CONTAINER } from "@/components/sections/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { CartItem } from "@/lib/cart-context";
import { ensureSavedCartsTable, getPool } from "@/lib/db";
import { describeItem } from "@/lib/describe-cart-item";

async function getSavedCart(token: string): Promise<CartItem[] | null> {
  if (!process.env.DATABASE_URL) return null;
  try {
    await ensureSavedCartsTable();
    const { rows } = await getPool().query(`SELECT items FROM saved_carts WHERE token = $1`, [
      token,
    ]);
    if (rows.length === 0) return null;
    return rows[0].items as CartItem[];
  } catch {
    return null;
  }
}

export default async function SavedCartPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const items = await getSavedCart(token);

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className={`${CONTAINER} py-20`}>
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href="/sklep" />}
            className="mb-8"
          >
            <ArrowLeft className="size-4" />
            Przejdź do sklepu
          </Button>

          {!items ? (
            <div className="mt-10 flex flex-col items-center gap-4 text-center">
              <p className="text-muted-foreground text-sm">Link wygasł lub jest nieprawidłowy.</p>
              <Button nativeButton={false} render={<Link href="/sklep" />}>
                Przejdź do sklepu
              </Button>
            </div>
          ) : (
            <div className="mx-auto max-w-2xl">
              <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
                Zapisany koszyk
              </h1>
              <p className="text-muted-foreground mt-2 text-sm">
                Ktoś (może Ty!) zapisał ten koszyk. Wczytaj go, żeby dodać te produkty do
                bieżącego koszyka.
              </p>

              <div className="mt-8 flex flex-col gap-4">
                {items.map((item, index) => {
                  const description = describeItem(item);
                  return (
                    <Card key={`${item.id}-${index}`}>
                      <CardContent className="flex items-center gap-4">
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
                          <p className="font-heading text-sm font-semibold">
                            {item.productTitle}
                          </p>
                          {description && (
                            <p className="text-muted-foreground text-xs">{description}</p>
                          )}
                        </div>
                        <span className="text-muted-foreground shrink-0 text-sm font-medium">
                          x{item.quantity}
                        </span>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="mt-8">
                <LoadSavedCartButton items={items} />
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
