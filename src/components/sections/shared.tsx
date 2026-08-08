import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const CONTAINER = "mx-auto w-full max-w-6xl px-6 lg:px-8";

export function SectionHeading({
  eyebrow,
  title,
  description,
  comingSoon = false,
  align = "center",
  className,
}: {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  comingSoon?: boolean;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      <p className="text-xs font-semibold tracking-[0.32em] text-brand-lavender uppercase">
        {eyebrow}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <h2 className="font-heading text-3xl font-semibold text-balance sm:text-4xl">
          {title}
        </h2>
        {comingSoon && (
          <Badge className="bg-brand-periwinkle/20 text-brand-lavender">
            Wkrótce
          </Badge>
        )}
      </div>
      {description && (
        <p
          className={cn(
            "text-muted-foreground max-w-2xl text-base leading-relaxed",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
