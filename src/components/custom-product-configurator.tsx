"use client";

import { Check, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { ColorSwatchGrid } from "@/components/color-swatch-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/lib/cart-context";
import type { DbProduct } from "@/lib/db-products";
import { STANDARD_COLORS } from "@/lib/products";

export function CustomProductConfigurator({ product }: { product: DbProduct }) {
  const { addItem } = useCart();
  const colors = STANDARD_COLORS.filter((c) => product.colorIds.includes(c.id));
  const [colorId, setColorId] = useState(colors[0]?.id ?? "");
  const [fieldValue, setFieldValue] = useState("");
  const [added, setAdded] = useState(false);

  const needsColor = colors.length > 0;
  const needsField = Boolean(product.customFieldLabel);
  const canAddToCart = (!needsColor || colorId !== "") && (!needsField || fieldValue.trim() !== "");

  function handleAddToCart() {
    if (!canAddToCart) return;
    const selectedColor = colors.find((c) => c.id === colorId);
    addItem({
      productSlug: product.slug,
      productTitle: product.title,
      productImage: product.images[0],
      colorId: selectedColor?.id,
      colorName: selectedColor?.name,
      specs:
        needsField && product.customFieldLabel
          ? [{ label: product.customFieldLabel, value: fieldValue.trim() }]
          : undefined,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex flex-col gap-5">
      {needsColor && (
        <div className="flex flex-col gap-2">
          <Label>Kolor</Label>
          <ColorSwatchGrid colors={colors} selectedId={colorId} onSelect={(c) => setColorId(c.id)} />
        </div>
      )}

      {needsField && product.customFieldLabel && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="custom-field-value">{product.customFieldLabel} *</Label>
          <Input
            id="custom-field-value"
            required
            value={fieldValue}
            onChange={(event) => setFieldValue(event.target.value)}
          />
        </div>
      )}

      <Button
        type="button"
        size="lg"
        onClick={handleAddToCart}
        disabled={!canAddToCart}
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
            Dodaj do koszyka
          </>
        )}
      </Button>
    </div>
  );
}
