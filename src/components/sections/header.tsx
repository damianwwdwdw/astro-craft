"use client";

import { Mail, Menu, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CONTAINER } from "@/components/sections/shared";
import { useCart } from "@/lib/cart-context";

const NAV_LINKS = [
  { href: "/sklep", label: "Sklep" },
  { href: "/#o-nas", label: "O mnie" },
  { href: "/#proces", label: "Jak to działa" },
  { href: "/#galeria", label: "Realizacje" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <header className="border-border/60 sticky top-0 z-20 border-b bg-brand-bg-deep/70 backdrop-blur-md">
      <div className={`${CONTAINER} flex h-16 items-center justify-between`}>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={mobileOpen ? "Zamknij menu" : "Otwórz menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className="text-muted-foreground hover:text-foreground flex size-9 items-center justify-center rounded-lg md:hidden"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>

          <Link
            href="/"
            className="flex items-center"
            onClick={() => {
              if (typeof window !== "undefined") window.scrollTo({ top: 0 });
            }}
          >
            <Image src="/logo.png" alt="Astro Craft" width={200} height={128} className="h-9 w-auto" priority />
          </Link>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/sklep"
            className="text-muted-foreground hover:text-foreground flex h-9 items-center rounded-lg px-2 text-sm font-medium md:hidden"
          >
            Sklep
          </Link>
          <Link
            href="/koszyk"
            aria-label="Koszyk"
            className="text-muted-foreground hover:text-foreground relative flex size-9 items-center justify-center rounded-lg"
          >
            <ShoppingCart className="size-5" />
            {itemCount > 0 && (
              <span className="from-brand-violet to-brand-periwinkle absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-gradient-to-br text-[10px] font-semibold text-white">
                {itemCount}
              </span>
            )}
          </Link>
          <Button
            size="icon"
            nativeButton={false}
            render={<Link href="/#kontakt" aria-label="Skontaktuj się" />}
          >
            <Mail className="size-4" />
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-border/60 border-t md:hidden">
          <nav className={`${CONTAINER} flex flex-col py-3`}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-muted-foreground hover:text-foreground border-border/40 border-b py-3 text-sm font-medium transition-colors last:border-b-0"
              >
                {link.label}
              </Link>
            ))}
            <Button
              nativeButton={false}
              render={<Link href="/#kontakt" />}
              onClick={() => setMobileOpen(false)}
              className="mt-3"
            >
              Skontaktuj się
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
