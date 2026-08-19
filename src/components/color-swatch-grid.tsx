"use client";

import { Check } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { ProductColor, ProductColorFinish } from "@/lib/products";

const PREVIEW_SIZE = 128;
const PREVIEW_MARGIN = 12;

type ZoomState = { color: ProductColor; rect: DOMRect };

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
  const [zoom, setZoom] = useState<ZoomState | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!zoom) return;
    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setZoom(null);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [zoom]);

  const groups = new Map<ProductColorFinish, ProductColor[]>();
  for (const color of colors) {
    const group = groups.get(color.finish) ?? [];
    group.push(color);
    groups.set(color.finish, group);
  }

  let previewStyle: React.CSSProperties | null = null;
  if (zoom && typeof window !== "undefined") {
    const centerX = Math.min(
      Math.max(zoom.rect.left + zoom.rect.width / 2, PREVIEW_SIZE / 2 + 8),
      window.innerWidth - PREVIEW_SIZE / 2 - 8
    );
    const spaceAbove = zoom.rect.top;
    const showBelow = spaceAbove < PREVIEW_SIZE + PREVIEW_MARGIN + 40;
    previewStyle = showBelow
      ? { left: centerX, top: zoom.rect.bottom + PREVIEW_MARGIN, transform: "translate(-50%, 0)" }
      : { left: centerX, top: zoom.rect.top - PREVIEW_MARGIN, transform: "translate(-50%, -100%)" };
  }

  return (
    <div ref={containerRef} className="flex flex-col gap-4">
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
                onClick={(event) => {
                  onSelect(color);
                  setZoom({ color, rect: event.currentTarget.getBoundingClientRect() });
                }}
                onMouseEnter={(event) =>
                  setZoom({ color, rect: event.currentTarget.getBoundingClientRect() })
                }
                onMouseLeave={() =>
                  setZoom((current) => (current?.color.id === color.id ? null : current))
                }
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

      {zoom && previewStyle && (
        <div
          className="pointer-events-none fixed z-50 flex flex-col items-center gap-1.5"
          style={previewStyle}
        >
          <div
            className="border-brand-lavender/40 bg-card relative overflow-hidden rounded-2xl border shadow-xl"
            style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE }}
          >
            <Image src={zoom.color.swatch} alt={zoom.color.name} fill className="object-cover" />
          </div>
          <span className="rounded-full bg-black/80 px-2.5 py-1 text-xs font-medium whitespace-nowrap text-white shadow">
            {zoom.color.name}
          </span>
        </div>
      )}
    </div>
  );
}
