import type { CartItem } from "@/lib/cart-context";

export function describeItem(item: CartItem): string {
  const parts: string[] = [];
  if (item.colorName) parts.push(`kolor: ${item.colorName}`);
  if (item.specs && item.specs.length > 0) {
    parts.push(item.specs.map((spec) => `${spec.label}: ${spec.value}`).join(", "));
  }
  return parts.join(", ");
}
