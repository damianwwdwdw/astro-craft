"use client";

import { Check, ShoppingCart } from "lucide-react";
import { useMemo, useState } from "react";
import { ColorSwatchGrid } from "@/components/color-swatch-grid";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/products";

export function ProductColorPicker({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const colors = useMemo(() => product.colors ?? [], [product.colors]);
  const [selectedId, setSelectedId] = useState(colors[0]?.id ?? "");

  const selectedColor = colors.find((color) => color.id === selectedId);

  if (colors.length === 0) return null;

  function handleAddToCart() {
    if (!selectedColor) return;
    addItem({
      productSlug: product.slug,
      productTitle: product.title,
      productImage: product.images[0],
      colorId: selectedColor.id,
      colorName: selectedColor.name,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex flex-col gap-5">
      <ColorSwatchGrid
        colors={colors}
        selectedId={selectedId}
        onSelect={(color) => setSelectedId(color.id)}
      />

      <Button
        type="button"
        size="lg"
        onClick={handleAddToCart}
        disabled={!selectedColor}
        className="from-brand-violet to-brand-periwinkle mt-1 w-fit bg-gradient-to-br px-6 py-3 text-white"
      >
        {added ? (
          <>
            <Check className="size-4" />
            Dodano do koszyka
          </>
        ) : (
          <>
            <ShoppingCart className="size-4" />
            Dodaj do koszyka{selectedColor ? ` — ${selectedColor.name}` : ""}
          </>
        )}
      </Button>
    </div>
  );
}
