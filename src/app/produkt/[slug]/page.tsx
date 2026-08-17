import { ArrowLeft, Mail } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CustomProductConfigurator } from "@/components/custom-product-configurator";
import { ProductColorPicker } from "@/components/product-color-picker";
import { ProductGallery } from "@/components/product-gallery";
import { RiserConfigurator } from "@/components/riser-configurator";
import { StageSelector } from "@/components/stage-selector";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";
import { CONTAINER } from "@/components/sections/shared";
import { Button } from "@/components/ui/button";
import { getDbProductBySlug } from "@/lib/db-products";
import { getProduct, PRODUCTS } from "@/lib/products";

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug) ?? (await getDbProductBySlug(slug));
  if (!product) return {};
  return {
    title: `${product.title} — Astro Craft`,
    description: product.excerpt,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const staticProduct = getProduct(slug);
  const dbProduct = staticProduct ? null : await getDbProductBySlug(slug);
  const product = staticProduct ?? dbProduct;
  if (!product) notFound();

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className={`${CONTAINER} py-20`}>
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href={`/sklep?kategoria=${product.categorySlug}`} />}
            className="mb-8"
          >
            <ArrowLeft className="size-4" />
            Powrót
          </Button>

          <div className="mx-auto grid max-w-4xl gap-10 lg:grid-cols-2 lg:items-start">
            <ProductGallery images={product.images} title={product.title} />

            <div className="flex flex-col gap-6">
              <div>
                <h1 className="font-heading text-2xl font-semibold text-balance sm:text-3xl">
                  {product.title}
                </h1>
                <p className="text-muted-foreground mt-2 text-base">{product.excerpt}</p>
              </div>

              {product.description.map((paragraph) => (
                <p key={paragraph} className="text-muted-foreground text-sm leading-relaxed">
                  {paragraph}
                </p>
              ))}

              <ul className="flex flex-col gap-2">
                {product.features.map((feature) => (
                  <li key={feature} className="flex gap-2 text-sm leading-relaxed">
                    <span className="text-brand-violet mt-1.5 size-1.5 shrink-0 rounded-full bg-current" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {dbProduct ? (
                <CustomProductConfigurator product={dbProduct} />
              ) : "stageOptions" in product && product.stageOptions && product.stageOptions.length > 0 ? (
                <StageSelector product={product} />
              ) : (
                "colors" in product &&
                product.colors &&
                product.colors.length > 0 &&
                (product.requiresDimensions ? (
                  <RiserConfigurator product={product} />
                ) : (
                  <ProductColorPicker product={product} />
                ))
              )}

              <a
                href="mailto:kontakt@astro-craft.pl"
                className="text-muted-foreground hover:text-foreground mt-1 inline-flex w-fit items-center gap-2 text-sm font-medium transition-colors"
              >
                <Mail className="size-4" />
                Zapytaj mailowo: kontakt@astro-craft.pl
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
