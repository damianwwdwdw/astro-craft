import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { OrbitStar } from "@/components/sections/orbit-star";
import { CONTAINER } from "@/components/sections/shared";

export function Hero() {
  return (
    <section className={`${CONTAINER} flex flex-col items-center gap-10 pt-20 pb-24 text-center sm:pt-28`}>
      <div className="relative flex aspect-square w-full max-w-[280px] items-center justify-center overflow-hidden">
        <div className="border-brand-lavender/30 absolute inset-0 rounded-full border border-dashed" />

        {/* Star orbiting the ring */}
        <div className="animate-orbit absolute inset-0">
          <div className="animate-orbit-counter absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <OrbitStar />
          </div>
        </div>

        <div className="bg-brand-paper relative w-3/4 rounded-2xl px-6 py-5 shadow-[0_20px_60px_-15px_rgba(124,92,252,0.55),0_8px_24px_-8px_rgba(0,0,0,0.5)]">
          {/* Uniform white outline for the tube, regardless of edge angle (see .tube-outline in globals.css) */}
          <svg width="0" height="0" className="absolute" aria-hidden>
            <defs>
              <filter id="tubeOutlineFilter" x="-50%" y="-50%" width="200%" height="200%">
                <feMorphology in="SourceAlpha" operator="dilate" radius="1.4" result="dilated" />
                <feFlood floodColor="#fbfaff" result="color" />
                <feComposite in="color" in2="dilated" operator="in" result="outline" />
                <feMerge>
                  <feMergeNode in="outline" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>
          {/*
            Two-layer logo: the base has the telescope tube erased (see
            public/logo-hero-base.png), and the tube is a separate cutout
            (public/logo-hero-tube.png) rotated around the eyepiece-ring
            pivot so it tracks the orbiting star above. Position/size here
            are percentages of the base image derived from the pixel
            geometry of logo.png — keep in sync if the logo asset changes.
          */}
          <div className="relative w-full" style={{ aspectRatio: "400 / 255" }}>
            <Image
              src="/logo-hero-base.png"
              alt="Astro Craft"
              fill
              className="object-contain"
              priority
            />
            <div
              className="animate-logo-tube-track absolute"
              style={{
                left: "4.77%",
                top: "15.87%",
                width: "28.66%",
                height: "29.41%",
                transformOrigin: "46.75% 78.23%",
              }}
            >
              <Image
                src="/logo-hero-tube.png"
                alt=""
                fill
                className="tube-outline object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      <p className="text-brand-lavender text-xs font-semibold tracking-[0.32em] uppercase">
        Druk 3D dla astronomii
      </p>
      <h1 className="font-heading max-w-2xl text-4xl font-semibold text-balance sm:text-5xl">
        Od pomysłu do gwiazd — drukujemy akcesoria dla Twojego teleskopu.
      </h1>
      <p className="text-muted-foreground max-w-xl text-lg leading-relaxed">
        Astro Craft projektuje i drukuje w 3D dedykowane akcesoria dla
        miłośników astronomii — uchwyty, adaptery, osłony przeciwrosowe i
        elementy na indywidualne zamówienie, dopasowane do Twojego sprzętu.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" nativeButton={false} render={<Link href="/sklep" />}>
          Zobacz ofertę
        </Button>
        <Button
          size="lg"
          variant="outline"
          nativeButton={false}
          render={<a href="#kontakt" />}
        >
          Zapytaj o wycenę
        </Button>
      </div>
    </section>
  );
}
