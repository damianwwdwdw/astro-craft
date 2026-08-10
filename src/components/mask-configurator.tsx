"use client";

import { Check, Mail, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { ColorSwatchGrid } from "@/components/color-swatch-grid";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/lib/cart-context";
import type { ProductColor } from "@/lib/products";

type MaskType = "bahtinov" | "tri-bahtinov";
type Mounting = "na-tube" | "w-tube";

const MASK_TYPE_LABELS: Record<MaskType, string> = {
  bahtinov: "Bahtinov",
  "tri-bahtinov": "Tri-Bahtinov",
};

const MOUNTING_LABELS: Record<Mounting, string> = {
  "na-tube": "Na tubę",
  "w-tube": "W tubę",
};

const SECOND_DIMENSION_DEFAULTS: Record<Mounting, string> = {
  "na-tube": "13",
  "w-tube": "5",
};

// Na razie maskę drukujemy tylko w czarnym, klasycznym wykończeniu — pole
// zostawione w formie wyboru koloru, żeby łatwo dodać kolejne warianty.
const MASK_COLORS: ProductColor[] = [
  {
    id: "czarny",
    name: "Czarny",
    finish: "Wykończenie klasyczne",
    swatch: "/products/szukacz-laserowy/kolory/czarny.png",
  },
];

export function MaskConfigurator() {
  const { addItem } = useCart();
  const [maskType, setMaskType] = useState<MaskType>("bahtinov");
  const [mounting, setMounting] = useState<Mounting>("na-tube");
  const [diameter, setDiameter] = useState("");
  const [hasCentralHole, setHasCentralHole] = useState(false);
  const [centralHoleDiameter, setCentralHoleDiameter] = useState("");
  const [secondDimension, setSecondDimension] = useState(SECOND_DIMENSION_DEFAULTS["na-tube"]);
  const [colorId, setColorId] = useState(MASK_COLORS[0].id);
  const [added, setAdded] = useState(false);

  const selectedColor = MASK_COLORS.find((color) => color.id === colorId) ?? MASK_COLORS[0];

  const diameterLabel =
    mounting === "na-tube"
      ? "Średnica zewnętrzna tuby (mm)"
      : "Średnica wewnętrzna tuby (mm)";

  const secondDimensionDefault = SECOND_DIMENSION_DEFAULTS[mounting];

  const secondDimensionLabel =
    mounting === "na-tube" ? "Wysokość kołnierza (mm)" : "Głębokość wsunięcia w tubę (mm)";

  function handleMountingChange(value: string) {
    const nextMounting = value as Mounting;
    setMounting(nextMounting);
    setSecondDimension(SECOND_DIMENSION_DEFAULTS[nextMounting]);
  }

  const summaryItems = [
    { label: "Typ maski", value: MASK_TYPE_LABELS[maskType] },
    { label: "Mocowanie", value: MOUNTING_LABELS[mounting] },
    { label: diameterLabel, value: diameter ? `${diameter} mm` : "" },
    {
      label: "Otwór centralny",
      value: hasCentralHole
        ? centralHoleDiameter
          ? `Ø ${centralHoleDiameter} mm`
          : "tak"
        : "",
    },
    {
      label: secondDimensionLabel,
      value: `${secondDimension.trim() || secondDimensionDefault} mm`,
    },
    { label: "Kolor", value: selectedColor.name },
  ].filter((item) => item.value !== "");

  const canAddToCart = diameter.trim() !== "";

  function handleAddToCart() {
    if (!canAddToCart) return;
    addItem({
      productSlug: "maska-bahtinova",
      productTitle: `Maska ${MASK_TYPE_LABELS[maskType]} na miarę`,
      specs: summaryItems,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="mx-auto grid max-w-3xl gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-start">
      <Card>
        <CardContent className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <Label>Typ maski</Label>
            <RadioGroup
              value={maskType}
              onValueChange={(value) => setMaskType(value as MaskType)}
            >
              {(Object.keys(MASK_TYPE_LABELS) as MaskType[]).map((type) => (
                <div key={type} className="flex items-center gap-2">
                  <RadioGroupItem value={type} id={`mask-type-${type}`} />
                  <Label htmlFor={`mask-type-${type}`}>{MASK_TYPE_LABELS[type]}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex flex-col gap-3">
            <Label>Mocowanie</Label>
            <RadioGroup value={mounting} onValueChange={handleMountingChange}>
              {(Object.keys(MOUNTING_LABELS) as Mounting[]).map((option) => (
                <div key={option} className="flex items-center gap-2">
                  <RadioGroupItem value={option} id={`mounting-${option}`} />
                  <Label htmlFor={`mounting-${option}`}>{MOUNTING_LABELS[option]}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="diameter">{diameterLabel}</Label>
            <Input
              id="diameter"
              type="number"
              min={0}
              step="0.1"
              placeholder="np. 203"
              value={diameter}
              onChange={(event) => setDiameter(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="central-hole-toggle"
                checked={hasCentralHole}
                onCheckedChange={(checked) => setHasCentralHole(checked)}
              />
              <Label htmlFor="central-hole-toggle">Otwór centralny</Label>
            </div>
            {hasCentralHole && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="central-hole-diameter">
                  Średnica otworu centralnego (mm)
                </Label>
                <Input
                  id="central-hole-diameter"
                  type="number"
                  min={0}
                  step="0.1"
                  placeholder="np. 50"
                  value={centralHoleDiameter}
                  onChange={(event) => setCentralHoleDiameter(event.target.value)}
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="second-dimension">{secondDimensionLabel}</Label>
            <p className="text-muted-foreground -mt-1 text-xs">
              Jeśli nie podasz, przyjmiemy domyślnie {secondDimensionDefault} mm.
            </p>
            <Input
              id="second-dimension"
              type="number"
              min={0}
              step="0.1"
              placeholder={secondDimensionDefault}
              value={secondDimension}
              onChange={(event) => setSecondDimension(event.target.value)}
            />
          </div>

          <ColorSwatchGrid
            colors={MASK_COLORS}
            selectedId={colorId}
            onSelect={(color) => setColorId(color.id)}
          />
        </CardContent>
      </Card>

      <Card className="bg-card/60 lg:sticky lg:top-24">
        <CardContent className="flex flex-col gap-5">
          <p className="font-heading font-semibold">Podsumowanie</p>

          {summaryItems.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Uzupełnij pola po lewej, żeby zobaczyć podsumowanie.
            </p>
          ) : (
            <ul className="flex flex-col gap-2 text-sm">
              {summaryItems.map((item) => (
                <li key={item.label} className="flex justify-between gap-4">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="text-right font-medium">{item.value}</span>
                </li>
              ))}
            </ul>
          )}

          <p className="text-muted-foreground text-sm leading-relaxed">
            Dodaj do koszyka, żeby przesłać tę specyfikację razem z zapytaniem
            o wycenę — albo napisz bezpośrednio.
          </p>

          <Button
            type="button"
            size="lg"
            onClick={handleAddToCart}
            disabled={!canAddToCart}
            className="from-brand-violet to-brand-periwinkle w-full bg-gradient-to-br px-6 py-3 text-white"
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
              Podaj średnicę tuby, żeby dodać maskę do koszyka.
            </p>
          )}

          <a
            href="mailto:kontakt@astro-craft.pl"
            className="text-muted-foreground hover:text-foreground inline-flex w-fit items-center gap-2 text-sm font-medium transition-colors"
          >
            <Mail className="size-4" />
            kontakt@astro-craft.pl
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
