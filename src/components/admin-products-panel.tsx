"use client";

import { LogOut, Package, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminProductForm } from "@/components/admin-product-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CATEGORIES } from "@/lib/categories";
import type { DbProduct } from "@/lib/db-products";

function categoryTitle(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.title ?? slug;
}

export function AdminProductsPanel() {
  const router = useRouter();
  const [products, setProducts] = useState<DbProduct[] | null>(null);
  const [error, setError] = useState("");
  const [editingProduct, setEditingProduct] = useState<DbProduct | null>(null);

  function load() {
    fetch("/api/admin/products")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products);
        } else {
          setError(data.error ?? "Nie udało się wczytać produktów.");
        }
      })
      .catch(() => setError("Błąd połączenia."));
  }

  useEffect(load, []);

  async function remove(slug: string) {
    if (editingProduct?.slug === slug) setEditingProduct(null);
    await fetch(`/api/admin/products/${slug}`, { method: "DELETE" });
    load();
  }

  function handleSaved() {
    setEditingProduct(null);
    load();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between gap-4">
        <p className="text-muted-foreground text-sm">
          {products === null ? "Wczytywanie..." : `${products.length} ogłoszeń`}
        </p>
        <Button type="button" variant="outline" size="sm" onClick={logout}>
          <LogOut className="size-4" />
          Wyloguj
        </Button>
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <AdminProductForm
        key={editingProduct?.slug ?? "new"}
        product={editingProduct ?? undefined}
        onSaved={handleSaved}
        onCancel={() => setEditingProduct(null)}
      />

      <section className="flex flex-col gap-4">
        <h2 className="font-heading text-lg font-semibold">Twoje ogłoszenia</h2>
        {products !== null && products.length === 0 ? (
          <p className="text-muted-foreground text-sm">Nie dodałeś jeszcze żadnego ogłoszenia.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {products?.map((product) => (
              <Card key={product.slug}>
                <CardContent className="flex items-center gap-4">
                  <div className="bg-muted relative size-16 shrink-0 overflow-hidden rounded-lg">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.title}
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
                    <p className="font-heading text-sm font-semibold">{product.title}</p>
                    <p className="text-muted-foreground text-xs">
                      {categoryTitle(product.categorySlug)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      aria-label={`Edytuj ${product.title}`}
                      onClick={() => setEditingProduct(product)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon-sm"
                      aria-label={`Usuń ${product.title}`}
                      onClick={() => remove(product.slug)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
