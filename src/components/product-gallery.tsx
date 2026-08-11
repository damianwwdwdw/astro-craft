"use client";

import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!lightboxOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setLightboxOpen(false);
      if (event.key === "ArrowRight") setActive((current) => (current + 1) % images.length);
      if (event.key === "ArrowLeft") {
        setActive((current) => (current - 1 + images.length) % images.length);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxOpen, images.length]);

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        aria-label={`Powiększ: ${title}`}
        className="group bg-card relative aspect-[4/3] w-full overflow-hidden rounded-2xl"
      >
        <Image src={images[active]} alt={title} fill className="object-contain" priority />
        <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
          <ZoomIn className="size-8 text-white" />
        </span>
      </button>

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
              <Image src={src} alt="" fill className="object-contain" />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            aria-label="Zamknij"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="size-5" />
          </button>

          {images.length > 1 && (
            <button
              type="button"
              aria-label="Poprzednie zdjęcie"
              onClick={(event) => {
                event.stopPropagation();
                setActive((current) => (current - 1 + images.length) % images.length);
              }}
              className="absolute left-2 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
            >
              <ChevronLeft className="size-6" />
            </button>
          )}

          <div className="relative h-[80vh] w-full max-w-4xl" onClick={(event) => event.stopPropagation()}>
            <Image src={images[active]} alt={title} fill className="object-contain" />
          </div>

          {images.length > 1 && (
            <button
              type="button"
              aria-label="Następne zdjęcie"
              onClick={(event) => {
                event.stopPropagation();
                setActive((current) => (current + 1) % images.length);
              }}
              className="absolute right-2 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
            >
              <ChevronRight className="size-6" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
