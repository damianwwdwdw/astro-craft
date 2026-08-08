"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-card relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
        <Image
          src={images[active]}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Zdjęcie ${index + 1}`}
              className={cn(
                "bg-card relative aspect-square overflow-hidden rounded-lg ring-2 transition-colors",
                active === index ? "ring-brand-violet" : "ring-transparent hover:ring-brand-lavender/40"
              )}
            >
              <Image src={src} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
