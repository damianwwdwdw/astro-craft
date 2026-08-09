import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin-login-form";
import { AdminReviewsPanel } from "@/components/admin-reviews-panel";
import { isAdminRequest } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Panel opinii — Astro Craft",
  robots: { index: false, follow: false },
};

export default async function AdminOpiniePage() {
  const authorized = await isAdminRequest();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-6 py-16">
      <h1 className="font-heading text-2xl font-semibold">Panel opinii</h1>
      {authorized ? <AdminReviewsPanel /> : <AdminLoginForm />}
    </main>
  );
}
