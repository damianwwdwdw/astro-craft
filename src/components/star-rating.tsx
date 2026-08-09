"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const STARS = [1, 2, 3, 4, 5];

export function StarRatingInput({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  return (
    <div role="radiogroup" aria-label="Ocena" className="flex gap-1">
      {STARS.map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} ${star === 1 ? "gwiazdka" : "gwiazdek"}`}
          disabled={disabled}
          onClick={() => onChange(star)}
          className="disabled:pointer-events-none disabled:opacity-50"
        >
          <Star
            className={cn(
              "size-6 transition-colors",
              star <= value
                ? "fill-brand-violet text-brand-violet"
                : "text-muted-foreground hover:text-brand-lavender"
            )}
          />
        </button>
      ))}
    </div>
  );
}

export function StarRatingDisplay({ value }: { value: number }) {
  return (
    <div role="img" aria-label={`Ocena: ${value} na 5`} className="flex gap-0.5">
      {STARS.map((star) => (
        <Star
          key={star}
          className={cn(
            "size-4",
            star <= value ? "fill-brand-violet text-brand-violet" : "text-muted-foreground/40"
          )}
        />
      ))}
    </div>
  );
}
