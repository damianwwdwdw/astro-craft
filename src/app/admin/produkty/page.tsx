import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin-login-form";
import { AdminProductsPanel } from "@/components/admin-products-panel";
import { isAdminRequest } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Panel produktów — Astro Craft",
  robots: { index: false, follow: false },
};

export default async function AdminProduktyPage() {
  const authorized = await isAdminRequest();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-6 py-16">
      <h1 className="font-heading text-2xl font-semibold">Panel produktów</h1>
      {authorized ? <AdminProductsPanel /> : <AdminLoginForm />}
    </main>
  );
}
