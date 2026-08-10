"use client";

import { createContext, useCallback, useContext, useSyncExternalStore, type ReactNode } from "react";

export type CartItemSpec = { label: string; value: string };

export type CartItem = {
  id: string;
  productSlug: string;
  productTitle: string;
  productImage?: string;
  quantity: number;
  /** Wariant kolorystyczny (np. szukacz laserowy). */
  colorId?: string;
  colorName?: string;
  /** Specyfikacja produktu skonfigurowanego na miarę (np. maska Bahtinova). */
  specs?: CartItemSpec[];
};

type NewCartItem = Omit<CartItem, "quantity" | "id">;

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  addItem: (item: NewCartItem, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateColor: (id: string, newColorId: string, newColorName: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "astro-craft-cart";
const EMPTY_CART: CartItem[] = [];

// Identyfikator pozycji w koszyku: ten sam produkt + ten sam wariant (kolor
// albo identyczna specyfikacja) trafia do jednej linii (ilość rośnie),
// inny wariant/specyfikacja to osobna linia.
function computeItemId(item: NewCartItem): string {
  if (item.colorId) return `${item.productSlug}::color:${item.colorId}`;
  if (item.specs && item.specs.length > 0) {
    return `${item.productSlug}::specs:${item.specs.map((spec) => `${spec.label}=${spec.value}`).join("|")}`;
  }
  return item.productSlug;
}

// Module-level store: localStorage is the external system, cachedItems is our
// in-memory mirror of it. useSyncExternalStore needs getSnapshot() to return a
// referentially stable value until the underlying data actually changes.
let cachedItems: CartItem[] = EMPTY_CART;
let hasReadStorage = false;
const listeners = new Set<() => void>();

function readFromStorage(): CartItem[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as CartItem[]) : EMPTY_CART;
  } catch {
    return EMPTY_CART;
  }
}

function getSnapshot(): CartItem[] {
  if (!hasReadStorage) {
    cachedItems = readFromStorage();
    hasReadStorage = true;
  }
  return cachedItems;
}

function getServerSnapshot(): CartItem[] {
  return EMPTY_CART;
}

function setCart(next: CartItem[]) {
  cachedItems = next;
  hasReadStorage = true;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore unavailable storage
  }
  listeners.forEach((listener) => listener());
}

function subscribe(callback: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) hasReadStorage = false;
    callback();
  };
  listeners.add(callback);
  window.addEventListener("storage", handleStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", handleStorage);
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addItem: CartContextValue["addItem"] = useCallback((item, quantity = 1) => {
    const id = computeItemId(item);
    const current = getSnapshot();
    const existing = current.find((line) => line.id === id);
    const next = existing
      ? current.map((line) =>
          line.id === id ? { ...line, quantity: line.quantity + quantity } : line
        )
      : [...current, { ...item, id, quantity }];
    setCart(next);
  }, []);

  const removeItem: CartContextValue["removeItem"] = useCallback((id) => {
    const current = getSnapshot();
    setCart(current.filter((line) => line.id !== id));
  }, []);

  const updateQuantity: CartContextValue["updateQuantity"] = useCallback(
    (id, quantity) => {
      if (quantity <= 0) {
        removeItem(id);
        return;
      }
      const current = getSnapshot();
      setCart(current.map((line) => (line.id === id ? { ...line, quantity } : line)));
    },
    [removeItem]
  );

  const updateColor: CartContextValue["updateColor"] = useCallback(
    (id, newColorId, newColorName) => {
      const current = getSnapshot();
      const line = current.find((l) => l.id === id);
      if (!line || line.colorId === newColorId) return;

      const newId = computeItemId({
        productSlug: line.productSlug,
        productTitle: line.productTitle,
        productImage: line.productImage,
        colorId: newColorId,
        colorName: newColorName,
        specs: line.specs,
      });
      const target = current.find((l) => l.id === newId);

      const next = target
        ? current
            .filter((l) => l.id !== id)
            .map((l) => (l.id === newId ? { ...l, quantity: l.quantity + line.quantity } : l))
        : current.map((l) =>
            l.id === id ? { ...l, id: newId, colorId: newColorId, colorName: newColorName } : l
          );

      setCart(next);
    },
    []
  );

  const clearCart = useCallback(() => setCart(EMPTY_CART), []);

  const itemCount = items.reduce((total, line) => total + line.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, itemCount, addItem, removeItem, updateQuantity, updateColor, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
