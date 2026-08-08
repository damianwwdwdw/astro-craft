"use client";

import { Mail } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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

export function MaskConfigurator() {
  const [maskType, setMaskType] = useState<MaskType>("bahtinov");
  const [mounting, setMounting] = useState<Mounting>("na-tube");
  const [diameter, setDiameter] = useState("");
  const [hasCentralHole, setHasCentralHole] = useState(false);
  const [centralHoleDiameter, setCentralHoleDiameter] = useState("");
  const [secondDimension, setSecondDimension] = useState("");

  const diameterLabel =
    mounting === "na-tube"
      ? "Średnica zewnętrzna tuby (mm)"
      : "Średnica wewnętrzna tuby (mm)";

  const secondDimensionLabel =
    mounting === "na-tube"
      ? "Wysokość kołnierza (mm)"
      : "Głębokość wsunięcia w tubę (mm)";

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
    { label: secondDimensionLabel, value: secondDimension ? `${secondDimension} mm` : "" },
  ].filter((item) => item.value !== "");

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
            <RadioGroup
              value={mounting}
              onValueChange={(value) => setMounting(value as Mounting)}
            >
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
            <Input
              id="second-dimension"
              type="number"
              min={0}
              step="0.1"
              placeholder="np. 15"
              value={secondDimension}
              onChange={(event) => setSecondDimension(event.target.value)}
            />
          </div>
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
            Skontaktuj się mailowo lub przez social media i przekaż tę
            specyfikację — przygotuję wycenę.
          </p>

          <div className="flex flex-col gap-2">
            <a
              href="mailto:kontakt@astro-craft.pl"
              className="from-brand-violet to-brand-periwinkle font-heading inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(124,92,252,0.7)] transition-transform hover:-translate-y-0.5"
            >
              <Mail className="size-4" />
              kontakt@astro-craft.pl
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
