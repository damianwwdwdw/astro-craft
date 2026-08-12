"use client";

import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type GalleryImage = { src: string; alt: string };

const SWIPE_THRESHOLD_PX = 40;
const THUMB_SCROLL_PX = 240;

export function GalleryLightbox({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const thumbRailRef = useRef<HTMLDivElement | null>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const touchStartX = useRef<number | null>(null);

  function goPrev() {
    setActive((current) => (current - 1 + images.length) % images.length);
  }

  function goNext() {
    setActive((current) => (current + 1) % images.length);
  }

  function onFeaturedTouchStart(event: React.TouchEvent) {
    touchStartX.current = event.touches[0].clientX;
  }

  function onFeaturedTouchEnd(event: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const deltaX = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (deltaX > SWIPE_THRESHOLD_PX) goPrev();
    else if (deltaX < -SWIPE_THRESHOLD_PX) goNext();
  }

  function scrollThumbs(direction: 1 | -1) {
    thumbRailRef.current?.scrollBy({ left: direction * THUMB_SCROLL_PX, behavior: "smooth" });
  }

  useEffect(() => {
    const rail = thumbRailRef.current;
    const thumb = thumbRefs.current[active];
    if (!rail || !thumb) return;
    // Scroll only the thumbnail rail itself (not scrollIntoView, which can also
    // scroll the page if the gallery section isn't fully in view yet).
    const railRect = rail.getBoundingClientRect();
    const thumbRect = thumb.getBoundingClientRect();
    const offset = thumbRect.left - railRect.left - (railRect.width - thumbRect.width) / 2;
    rail.scrollBy({ left: offset, behavior: "smooth" });
  }, [active]);

  useEffect(() => {
    if (lightboxIndex === null) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowRight") {
        setLightboxIndex((current) => (current === null ? current : (current + 1) % images.length));
      }
      if (event.key === "ArrowLeft") {
        setLightboxIndex((current) =>
          current === null ? current : (current - 1 + images.length) % images.length
        );
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxIndex, images.length]);

  return (
    <>
      <div className="mt-14 flex flex-col gap-3">
        <div
          className="group bg-card relative aspect-[4/3] w-full touch-pan-y overflow-hidden rounded-2xl"
          onTouchStart={onFeaturedTouchStart}
          onTouchEnd={onFeaturedTouchEnd}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(active)}
            aria-label={`Powiększ: ${images[active].alt}`}
            className="absolute inset-0"
          >
            <Image src={images[active].src} alt={images[active].alt} fill className="object-cover" priority />
            <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
              <ZoomIn className="size-8 text-white" />
            </span>
          </button>

          <button
            type="button"
            aria-label="Poprzednie zdjęcie"
            onClick={(event) => {
              event.stopPropagation();
              goPrev();
            }}
            className="absolute top-1/2 left-2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60 sm:left-4"
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            type="button"
            aria-label="Następne zdjęcie"
            onClick={(event) => {
              event.stopPropagation();
              goNext();
            }}
            className="absolute top-1/2 right-2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60 sm:right-4"
          >
            <ChevronRight className="size-6" />
          </button>
        </div>

        <p className="text-muted-foreground text-center text-sm">{images[active].alt}</p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Przewiń miniatury w lewo"
            onClick={() => scrollThumbs(-1)}
            className="text-muted-foreground hover:text-foreground flex size-8 shrink-0 items-center justify-center rounded-full"
          >
            <ChevronLeft className="size-5" />
          </button>

          <div
            ref={thumbRailRef}
            className="scrollbar-none flex flex-1 gap-3 overflow-x-auto scroll-smooth pb-1"
          >
            {images.map((image, index) => (
              <button
                key={image.src}
                ref={(el) => {
                  thumbRefs.current[index] = el;
                }}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Pokaż: ${image.alt}`}
                className={cn(
                  "bg-card relative size-20 shrink-0 overflow-hidden rounded-lg ring-2 transition-colors",
                  active === index ? "ring-brand-violet" : "ring-transparent hover:ring-brand-lavender/40"
                )}
              >
                <Image src={image.src} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>

          <button
            type="button"
            aria-label="Przewiń miniatury w prawo"
            onClick={() => scrollThumbs(1)}
            className="text-muted-foreground hover:text-foreground flex size-8 shrink-0 items-center justify-center rounded-full"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            aria-label="Zamknij"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="size-5" />
          </button>

          <button
            type="button"
            aria-label="Poprzednie zdjęcie"
            onClick={(event) => {
              event.stopPropagation();
              setLightboxIndex((current) =>
                current === null ? current : (current - 1 + images.length) % images.length
              );
            }}
            className="absolute left-2 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
          >
            <ChevronLeft className="size-6" />
          </button>

          <div
            className="flex h-[80vh] w-full max-w-4xl flex-col gap-3"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative min-h-0 flex-1">
              <Image
                src={images[lightboxIndex].src}
                alt={images[lightboxIndex].alt}
                fill
                className="object-contain"
              />
            </div>
            <p className="shrink-0 text-center text-sm text-white/80">{images[lightboxIndex].alt}</p>
          </div>

          <button
            type="button"
            aria-label="Następne zdjęcie"
            onClick={(event) => {
              event.stopPropagation();
              setLightboxIndex((current) =>
                current === null ? current : (current + 1) % images.length
              );
            }}
            className="absolute right-2 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
          >
            <ChevronRight className="size-6" />
          </button>
        </div>
      )}
    </>
  );
}
