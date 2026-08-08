"use client";

import { createContext, useCallback, useContext, useSyncExternalStore, type ReactNode } from "react";

export type CartItem = {
  productSlug: string;
  productTitle: string;
  productImage: string;
  colorId: string;
  colorName: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productSlug: string, colorId: string) => void;
  updateQuantity: (productSlug: string, colorId: string, quantity: number) => void;
  updateColor: (
    productSlug: string,
    oldColorId: string,
    newColorId: string,
    newColorName: string
  ) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "astro-craft-cart";
const EMPTY_CART: CartItem[] = [];

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
    const current = getSnapshot();
    const existing = current.find(
      (line) => line.productSlug === item.productSlug && line.colorId === item.colorId
    );
    const next = existing
      ? current.map((line) =>
          line === existing ? { ...line, quantity: line.quantity + quantity } : line
        )
      : [...current, { ...item, quantity }];
    setCart(next);
  }, []);

  const removeItem: CartContextValue["removeItem"] = useCallback((productSlug, colorId) => {
    const current = getSnapshot();
    setCart(
      current.filter((line) => !(line.productSlug === productSlug && line.colorId === colorId))
    );
  }, []);

  const updateQuantity: CartContextValue["updateQuantity"] = useCallback(
    (productSlug, colorId, quantity) => {
      if (quantity <= 0) {
        removeItem(productSlug, colorId);
        return;
      }
      const current = getSnapshot();
      setCart(
        current.map((line) =>
          line.productSlug === productSlug && line.colorId === colorId
            ? { ...line, quantity }
            : line
        )
      );
    },
    [removeItem]
  );

  const updateColor: CartContextValue["updateColor"] = useCallback(
    (productSlug, oldColorId, newColorId, newColorName) => {
      if (oldColorId === newColorId) return;
      const current = getSnapshot();
      const line = current.find(
        (l) => l.productSlug === productSlug && l.colorId === oldColorId
      );
      if (!line) return;

      const target = current.find(
        (l) => l.productSlug === productSlug && l.colorId === newColorId
      );

      const next = target
        ? current
            .filter((l) => l !== line)
            .map((l) => (l === target ? { ...l, quantity: l.quantity + line.quantity } : l))
        : current.map((l) =>
            l === line ? { ...l, colorId: newColorId, colorName: newColorName } : l
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
