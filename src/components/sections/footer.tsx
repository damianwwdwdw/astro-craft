import Image from "next/image";
import { CONTAINER } from "@/components/sections/shared";

export function Footer() {
  return (
    <footer className="border-brand-lavender/10 border-t py-10">
      <div className={`${CONTAINER} flex flex-col items-center gap-4 text-center`}>
        <Image src="/logo.png" alt="Astro Craft" width={200} height={128} className="h-9 w-auto" />
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} Astro Craft. Wszelkie prawa zastrzeżone.
        </p>
      </div>
    </footer>
  );
}
