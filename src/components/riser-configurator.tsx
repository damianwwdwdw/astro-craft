"use client";

import { Check, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { ColorSwatchGrid } from "@/components/color-swatch-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/products";

const DIAMETER_MIN_MM = 20;
const DIAMETER_MAX_MM = 250;
const HEIGHT_MIN_MM = 20;
const HEIGHT_MAX_MM = 250;

export function RiserConfigurator({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [diameter, setDiameter] = useState("");
  const [height, setHeight] = useState("");
  const colors = product.colors ?? [];
  const [colorId, setColorId] = useState(colors[0]?.id ?? "");
  const [added, setAdded] = useState(false);

  const parsedDiameter = Number(diameter);
  const diameterError =
    diameter.trim() !== "" &&
    (!Number.isFinite(parsedDiameter) ||
      parsedDiameter < DIAMETER_MIN_MM ||
      parsedDiameter > DIAMETER_MAX_MM)
      ? `Podaj wartość z zakresu ${DIAMETER_MIN_MM}-${DIAMETER_MAX_MM} mm.`
      : "";

  const parsedHeight = Number(height);
  const heightError =
    height.trim() !== "" &&
    (!Number.isFinite(parsedHeight) || parsedHeight < HEIGHT_MIN_MM || parsedHeight > HEIGHT_MAX_MM)
      ? `Podaj wartość z zakresu ${HEIGHT_MIN_MM}-${HEIGHT_MAX_MM} mm.`
      : "";

  const dimensionsValid =
    diameter.trim() !== "" && height.trim() !== "" && diameterError === "" && heightError === "";

  const selectedColor = colors.find((color) => color.id === colorId);
  const canAddToCart = dimensionsValid && !!selectedColor;

  function handleAddToCart() {
    if (!canAddToCart || !selectedColor) return;
    addItem({
      productSlug: product.slug,
      productTitle: product.title,
      productImage: product.images[0],
      colorId: selectedColor.id,
      colorName: selectedColor.name,
      specs: [
        { label: "Średnica zewnętrzna tuby", value: `${diameter} mm` },
        { label: "Wysokość odrośnika", value: `${height} mm` },
      ],
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  if (colors.length === 0) return null;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="riser-diameter">Średnica zewnętrzna tuby (mm)</Label>
        <Input
          id="riser-diameter"
          type="number"
          min={DIAMETER_MIN_MM}
          max={DIAMETER_MAX_MM}
          step="0.1"
          placeholder="np. 80"
          value={diameter}
          aria-invalid={diameterError !== ""}
          onChange={(event) => setDiameter(event.target.value)}
        />
        {diameterError && <p className="text-destructive text-xs">{diameterError}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="riser-height">Wysokość odrośnika (mm)</Label>
        <Input
          id="riser-height"
          type="number"
          min={HEIGHT_MIN_MM}
          max={HEIGHT_MAX_MM}
          step="0.1"
          placeholder="np. 40"
          value={height}
          aria-invalid={heightError !== ""}
          onChange={(event) => setHeight(event.target.value)}
        />
        {heightError && <p className="text-destructive text-xs">{heightError}</p>}
      </div>

      <ColorSwatchGrid
        colors={colors}
        selectedId={colorId}
        onSelect={(color) => setColorId(color.id)}
      />

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
            Dodaj do koszyka{selectedColor ? ` — ${selectedColor.name}` : ""}
          </>
        )}
      </Button>
      {!dimensionsValid && (
        <p className="text-muted-foreground -mt-3 text-xs">
          Podaj średnicę tuby i wysokość odrośnika, żeby dodać do koszyka.
        </p>
      )}
    </div>
  );
}
