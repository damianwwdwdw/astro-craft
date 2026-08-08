"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/lib/categories";
import { getProductsByCategory, type Product } from "@/lib/products";
import { cn } from "@/lib/utils";

type ResultItem =
  | { kind: "product"; key: string; product: Product }
  | { kind: "category"; key: string; category: (typeof CATEGORIES)[number] };

export function ShopCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedSlug = searchParams.get("kategoria") ?? "wszystko";

  const [searchText, setSearchText] = useState("");

  function selectCategory(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "wszystko") {
      params.delete("kategoria");
    } else {
      params.set("kategoria", slug);
    }
    const query = params.toString();
    router.replace(query ? `/sklep?${query}` : "/sklep", { scroll: false });
  }

  const results = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    const items: ResultItem[] = [];

    for (const category of CATEGORIES) {
      if (category.slug === "wszystko") continue;
      if (selectedSlug !== "wszystko" && category.slug !== selectedSlug) continue;

      const products = getProductsByCategory(category.slug);
      if (products.length > 0) {
        for (const product of products) {
          const matches =
            !query ||
            product.title.toLowerCase().includes(query) ||
            product.excerpt.toLowerCase().includes(query);
          if (matches) {
            items.push({ kind: "product", key: product.slug, product });
          }
        }
        continue;
      }

      const matches =
        !query ||
        category.title.toLowerCase().includes(query) ||
        category.description.toLowerCase().includes(query);
      if (matches) {
        items.push({ kind: "category", key: category.slug, category });
      }
    }

    return items;
  }, [selectedSlug, searchText]);

  return (
    <div>
      <div className="mx-auto flex max-w-xl flex-col gap-6">
        <div className="relative">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Czego potrzebujesz? np. adapter do aparatu"
            className="h-11 pl-9"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category.slug}
              type="button"
              onClick={() => selectCategory(category.slug)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                selectedSlug === category.slug
                  ? "border-brand-violet bg-brand-violet/15 text-foreground"
                  : "border-brand-lavender/35 text-muted-foreground hover:border-brand-violet hover:bg-brand-violet/15"
              )}
            >
              {category.title}
            </button>
          ))}
        </div>
      </div>

      {results.length === 0 ? (
        <div className="mt-14 flex flex-col items-center gap-4 text-center">
          <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
            Nic nie pasuje do „{searchText}” — katalog wciąż rośnie. Napisz, czego
            potrzebujesz, a odezwę się z wyceną.
          </p>
        </div>
      ) : (
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((item) => {
            if (item.kind === "product") {
              return (
                <Link key={item.key} href={`/produkt/${item.product.slug}`} className="block">
                  <Card className="hover:ring-brand-violet hover:bg-brand-violet/10 h-full overflow-hidden py-0 transition-colors hover:-translate-y-0.5">
                    <div className="bg-muted relative aspect-[4/3] w-full">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="flex flex-col gap-2 py-4">
                      <p className="font-heading font-semibold">{item.product.title}</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {item.product.excerpt}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            }

            const category = item.category;
            return category.href ? (
              <Link key={item.key} href={category.href} className="block">
                <Card className="hover:ring-brand-violet hover:bg-brand-violet/10 h-full transition-colors hover:-translate-y-0.5">
                  <CardContent className="flex flex-col gap-3">
                    <category.icon className="text-brand-periwinkle size-6" />
                    <p className="font-heading font-semibold">{category.title}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ) : (
              <Card key={item.key} className="opacity-80">
                <CardContent className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <category.icon className="text-brand-periwinkle size-6" />
                    <Badge className="bg-brand-periwinkle/20 text-brand-lavender">Wkrótce</Badge>
                  </div>
                  <p className="font-heading font-semibold">{category.title}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <Button nativeButton={false} render={<Link href="/#kontakt" />}>
          Zapytaj o wycenę
        </Button>
      </div>
    </div>
  );
}
