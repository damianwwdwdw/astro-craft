"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "astro-craft-cookie-notice-dismissed";

// Ten sam wzorzec co w cart-context.tsx: moduł trzyma jedną, współdzieloną
// "prawdę" o stanie odrzucenia baneru, a useSyncExternalStore synchronizuje
// ją z Reactem bez setState w efekcie (i bez ryzyka mismatchu przy hydracji —
// server zawsze renderuje "odrzucony", więc SSR i pierwszy render klienta są
// identyczne; realny stan z localStorage doczytuje się od razu po hydracji).
let dismissed = false;
let hasRead = false;
const listeners = new Set<() => void>();

function readDismissed(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function getSnapshot(): boolean {
  if (!hasRead) {
    dismissed = readDismissed();
    hasRead = true;
  }
  return dismissed;
}

function getServerSnapshot(): boolean {
  return true;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function dismiss() {
  dismissed = true;
  hasRead = true;
  try {
    window.localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // ignore
  }
  listeners.forEach((listener) => listener());
}

export function CookieNotice() {
  const isDismissed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (isDismissed) return null;

  return (
    <div className="border-border bg-card/95 fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 px-6 py-4 text-center sm:flex-row sm:justify-between sm:text-left lg:px-8">
        <p className="text-muted-foreground text-sm leading-relaxed">
          Ta strona korzysta z niezbędnych plików cookie i lokalnego zapisu w przeglądarce (np. do
          działania koszyka) — bez śledzenia ani reklam.{" "}
          <Link href="/polityka-cookies" className="text-foreground underline underline-offset-2">
            Dowiedz się więcej
          </Link>
        </p>
        <Button
          type="button"
          size="sm"
          onClick={dismiss}
          className="from-brand-violet to-brand-periwinkle w-fit shrink-0 bg-gradient-to-br text-white"
        >
          Rozumiem
        </Button>
      </div>
    </div>
  );
}
