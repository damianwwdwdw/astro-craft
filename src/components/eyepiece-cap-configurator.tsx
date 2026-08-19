"use client";

import { Check, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { ColorSwatchGrid } from "@/components/color-swatch-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/products";
import { cn } from "@/lib/utils";

type DiameterOption = "125" | "2cale" | "custom";

const DIAMETER_OPTIONS: { id: DiameterOption; label: string }[] = [
  { id: "125", label: "1,25 cala" },
  { id: "2cale", label: "2 cale" },
  { id: "custom", label: "Własna średnica" },
];

function PillButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        selected
          ? "border-brand-violet bg-brand-violet/15 text-foreground"
          : "border-brand-lavender/35 text-muted-foreground hover:border-brand-violet hover:bg-brand-violet/15"
      )}
    >
      {children}
    </button>
  );
}

export function EyepieceCapConfigurator({ product }: { product: Product }) {
  const { addItem } = useCart();
  const colors = product.colors ?? [];
  const [colorId, setColorId] = useState(colors[0]?.id ?? "");
  const [diameter, setDiameter] = useState<DiameterOption | null>(null);
  const [customDiameter, setCustomDiameter] = useState("");
  const [added, setAdded] = useState(false);

  const selectedColor = colors.find((color) => color.id === colorId);
  const parsedCustomDiameter = Number(customDiameter);
  const customDiameterValid =
    customDiameter.trim() !== "" && Number.isFinite(parsedCustomDiameter) && parsedCustomDiameter > 0;

  const canAddToCart =
    !!selectedColor && diameter !== null && (diameter !== "custom" || customDiameterValid);

  function handleAddToCart() {
    if (!canAddToCart || !diameter || !selectedColor) return;

    const diameterValue =
      diameter === "custom"
        ? `${customDiameter.trim()} mm (własna)`
        : DIAMETER_OPTIONS.find((option) => option.id === diameter)!.label;

    addItem({
      productSlug: product.slug,
      productTitle: product.title,
      productImage: product.images[0],
      colorId: selectedColor.id,
      colorName: selectedColor.name,
      specs: [{ label: "Średnica", value: diameterValue }],
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label>Średnica *</Label>
        <div className="flex flex-wrap gap-2">
          {DIAMETER_OPTIONS.map((option) => (
            <PillButton key={option.id} selected={diameter === option.id} onClick={() => setDiameter(option.id)}>
              {option.label}
            </PillButton>
          ))}
        </div>

        {diameter === "custom" && (
          <div className="mt-1 flex flex-col gap-2">
            <Label htmlFor="eyepiece-cap-custom-diameter">Średnica (mm) *</Label>
            <Input
              id="eyepiece-cap-custom-diameter"
              type="number"
              min={1}
              step="0.1"
              placeholder="np. 32"
              value={customDiameter}
              onChange={(event) => setCustomDiameter(event.target.value)}
            />
          </div>
        )}
      </div>

      {colors.length > 0 && (
        <div className="flex flex-col gap-2">
          <Label>Kolor</Label>
          <ColorSwatchGrid colors={colors} selectedId={colorId} onSelect={(color) => setColorId(color.id)} />
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
            Dodaj do koszyka{selectedColor ? ` — ${selectedColor.name}` : ""}
          </>
        )}
      </Button>
      {diameter === null && (
        <p className="text-muted-foreground -mt-3 text-xs">
          Wybierz średnicę, żeby dodać do koszyka.
        </p>
      )}
    </div>
  );
}
