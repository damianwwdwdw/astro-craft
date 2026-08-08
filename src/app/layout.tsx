import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Starfield } from "@/components/starfield";
import { CartProvider } from "@/lib/cart-context";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Astro Craft — druk 3D dla astronomii",
  description:
    "Astro Craft projektuje i drukuje w 3D akcesoria dla miłośników astronomii — od uchwytów po dedykowane adaptery.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pl"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Starfield />
        <div className="relative z-10 flex min-h-full flex-1 flex-col">
          <CartProvider>{children}</CartProvider>
        </div>
      </body>
    </html>
  );
}
