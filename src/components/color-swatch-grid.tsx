"use client";

import { Check } from "lucide-react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { ProductColor, ProductColorFinish } from "@/lib/products";

export function ColorSwatchGrid({
  colors,
  selectedId,
  onSelect,
  swatchClassName = "size-10",
}: {
  colors: ProductColor[];
  selectedId: string;
  onSelect: (color: ProductColor) => void;
  swatchClassName?: string;
}) {
  const groups = new Map<ProductColorFinish, ProductColor[]>();
  for (const color of colors) {
    const group = groups.get(color.finish) ?? [];
    group.push(color);
    groups.set(color.finish, group);
  }

  return (
    <div className="flex flex-col gap-4">
      {Array.from(groups.entries()).map(([finish, finishColors]) => (
        <div key={finish} className="flex flex-col gap-2">
          <Label className="text-xs">{finish}</Label>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={finish}>
            {finishColors.map((color) => (
              <button
                key={color.id}
                type="button"
                role="radio"
                aria-checked={selectedId === color.id}
                aria-label={color.name}
                title={color.name}
                onClick={() => onSelect(color)}
                className={cn(
                  "bg-card relative shrink-0 overflow-hidden rounded-full ring-2 transition-colors",
                  swatchClassName,
                  selectedId === color.id
                    ? "ring-brand-violet"
                    : "ring-border hover:ring-brand-lavender/50"
                )}
              >
                <Image src={color.swatch} alt={color.name} fill className="object-cover" />
                {selectedId === color.id && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Check className="size-4 text-white drop-shadow" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
