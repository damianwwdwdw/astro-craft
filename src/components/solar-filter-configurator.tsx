"use client";

import { Check, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/products";
import { cn } from "@/lib/utils";

type Variant = "pojedynczy" | "bino";
type DiameterMode = "standard" | "custom";

const VARIANT_OPTIONS: { id: Variant; label: string }[] = [
  { id: "pojedynczy", label: "Pojedynczy" },
  { id: "bino", label: "Bino" },
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

export function SolarFilterConfigurator({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [variant, setVariant] = useState<Variant | null>(null);
  const [diameterMode, setDiameterMode] = useState<DiameterMode>("standard");
  const [customDiameter, setCustomDiameter] = useState("");
  const [hasCustomText, setHasCustomText] = useState(false);
  const [customText, setCustomText] = useState("");
  const [added, setAdded] = useState(false);

  const parsedCustomDiameter = Number(customDiameter);
  const customDiameterValid =
    customDiameter.trim() !== "" && Number.isFinite(parsedCustomDiameter) && parsedCustomDiameter > 0;

  const canAddToCart =
    variant !== null &&
    (diameterMode === "standard" || customDiameterValid) &&
    (!hasCustomText || customText.trim() !== "");

  function handleAddToCart() {
    if (!canAddToCart || !variant) return;

    const variantLabel = VARIANT_OPTIONS.find((option) => option.id === variant)!.label;
    const diameterValue =
      diameterMode === "standard"
        ? "43-64mm (standardowa)"
        : `${customDiameter.trim()} mm (własna)`;

    addItem({
      productSlug: product.slug,
      productTitle: product.title,
      productImage: product.images[0],
      specs: [
        { label: "Wariant", value: variantLabel },
        { label: "Średnica obiektywu", value: diameterValue },
        ...(hasCustomText && customText.trim()
          ? [{ label: "Napis na oprawce", value: customText.trim() }]
          : []),
      ],
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label>Wariant *</Label>
        <div className="flex flex-wrap gap-2">
          {VARIANT_OPTIONS.map((option) => (
            <PillButton
              key={option.id}
              selected={variant === option.id}
              onClick={() => setVariant(option.id)}
            >
              {option.label}
            </PillButton>
          ))}
        </div>
      </div>

      {variant !== null && (
        <div className="flex flex-col gap-2">
          <Label>Średnica obiektywu *</Label>
          <div className="flex flex-wrap gap-2">
            <PillButton
              selected={diameterMode === "standard"}
              onClick={() => setDiameterMode("standard")}
            >
              Standardowa 43-64mm
            </PillButton>
            <PillButton selected={diameterMode === "custom"} onClick={() => setDiameterMode("custom")}>
              Podaj własną średnicę
            </PillButton>
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Zakres 43-64mm pasuje do większości lornetek oraz teleskopów Dobson.
          </p>

          {diameterMode === "custom" && (
            <div className="mt-1 flex flex-col gap-2">
              <Label htmlFor="solar-filter-custom-diameter">Średnica (mm) *</Label>
              <Input
                id="solar-filter-custom-diameter"
                type="number"
                min={1}
                step="0.1"
                placeholder="np. 70"
                value={customDiameter}
                onChange={(event) => setCustomDiameter(event.target.value)}
              />
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        <Checkbox
          id="solar-filter-custom-text-enabled"
          checked={hasCustomText}
          onCheckedChange={() => setHasCustomText((v) => !v)}
        />
        <Label htmlFor="solar-filter-custom-text-enabled">Własny napis na oprawce</Label>
      </div>

      {hasCustomText && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="solar-filter-custom-text">Treść napisu *</Label>
          <Input
            id="solar-filter-custom-text"
            value={customText}
            onChange={(event) => setCustomText(event.target.value)}
            placeholder="np. Imię, nazwa teleskopu..."
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
      {variant === null && (
        <p className="text-muted-foreground -mt-3 text-xs">
          Wybierz wariant (pojedynczy/bino), żeby dodać do koszyka.
        </p>
      )}
    </div>
  );
}
