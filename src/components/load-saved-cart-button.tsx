"use client";

import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart, type CartItem } from "@/lib/cart-context";

export function LoadSavedCartButton({ items }: { items: CartItem[] }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function handleLoad() {
    setLoading(true);
    for (const item of items) {
      addItem(
        {
          productSlug: item.productSlug,
          productTitle: item.productTitle,
          productImage: item.productImage,
          colorId: item.colorId,
          colorName: item.colorName,
          specs: item.specs,
        },
        item.quantity
      );
    }
    router.push("/koszyk");
  }

  return (
    <Button
      type="button"
      onClick={handleLoad}
      disabled={loading}
      className="from-brand-violet to-brand-periwinkle w-fit bg-gradient-to-br px-6 py-3 text-white"
    >
      <ShoppingCart className="size-4" />
      Wczytaj do koszyka
    </Button>
  );
}
