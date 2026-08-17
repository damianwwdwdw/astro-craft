"use client";

import { Check, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";

export function SaveCartButton() {
  const { items } = useCart();
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  useEffect(() => {
    if (status !== "success" && status !== "error") return;
    const timeout = window.setTimeout(() => setStatus("idle"), 2500);
    return () => window.clearTimeout(timeout);
  }, [status]);

  if (items.length === 0) return null;

  async function handleShare() {
    setStatus("saving");
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        setStatus("error");
        return;
      }

      const link = `${window.location.origin}/koszyk/${data.token}`;
      await navigator.clipboard.writeText(link);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Udostępnij koszyk"
        onClick={handleShare}
        disabled={status === "saving"}
      >
        {status === "success" ? <Check className="size-4" /> : <Share2 className="size-4" />}
      </Button>
      {(status === "success" || status === "error") && (
        <span
          className={`absolute top-full left-1/2 mt-2 w-max -translate-x-1/2 rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap shadow-sm ${
            status === "success"
              ? "bg-brand-violet text-white"
              : "bg-destructive text-white"
          }`}
        >
          {status === "success" ? "Link skopiowany!" : "Nie udało się zapisać koszyka."}
        </span>
      )}
    </div>
  );
}
