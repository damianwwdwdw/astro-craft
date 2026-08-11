"use client";

import { Check, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/products";

export function StageSelector({ product }: { product: Product }) {
  const { addItem } = useCart();
  const options = product.stageOptions ?? [];
  const [selected, setSelected] = useState<string[]>([]);
  const [added, setAdded] = useState(false);

  function toggle(id: string) {
    setSelected((current) =>
      current.includes(id) ? current.filter((s) => s !== id) : [...current, id]
    );
  }

  const canAddToCart = selected.length > 0;
  const selectedLabels = options
    .filter((option) => selected.includes(option.id))
    .map((option) => option.label);

  function handleAddToCart() {
    if (!canAddToCart) return;
    addItem({
      productSlug: product.slug,
      productTitle: product.title,
      productImage: product.images[0],
      specs: [{ label: "Wybrane elementy", value: selectedLabels.join(" + ") }],
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  if (options.length === 0) return null;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        {options.map((option) => (
          <div key={option.id} className="flex items-center gap-2">
            <Checkbox
              id={`stage-${option.id}`}
              checked={selected.includes(option.id)}
              onCheckedChange={() => toggle(option.id)}
            />
            <Label htmlFor={`stage-${option.id}`}>{option.label}</Label>
          </div>
        ))}
      </div>

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
      {!canAddToCart && (
        <p className="text-muted-foreground -mt-3 text-xs">
          Zaznacz przynajmniej jedną opcję, żeby dodać do koszyka.
        </p>
      )}
    </div>
  );
}
