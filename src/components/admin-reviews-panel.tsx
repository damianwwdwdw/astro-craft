"use client";

import { Check, LogOut, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { StarRatingDisplay } from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { AdminReview } from "@/lib/reviews";

export function AdminReviewsPanel() {
  const router = useRouter();
  const [reviews, setReviews] = useState<AdminReview[] | null>(null);
  const [error, setError] = useState("");

  function load() {
    fetch("/api/admin/reviews")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setReviews(data.reviews);
        } else {
          setError(data.error ?? "Nie udało się wczytać opinii.");
        }
      })
      .catch(() => setError("Błąd połączenia."));
  }

  useEffect(load, []);

  async function approve(id: number) {
    await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "approved" }),
    });
    load();
  }

  async function remove(id: number) {
    await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    load();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  const pending = reviews?.filter((review) => review.status === "pending") ?? [];
  const approved = reviews?.filter((review) => review.status === "approved") ?? [];

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between gap-4">
        <p className="text-muted-foreground text-sm">
          {reviews === null
            ? "Wczytywanie..."
            : `${pending.length} oczekujących, ${approved.length} zatwierdzonych`}
        </p>
        <Button type="button" variant="outline" size="sm" onClick={logout}>
          <LogOut className="size-4" />
          Wyloguj
        </Button>
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <section className="flex flex-col gap-4">
        <h2 className="font-heading text-lg font-semibold">Oczekujące na zatwierdzenie</h2>
        {pending.length === 0 ? (
          <p className="text-muted-foreground text-sm">Brak oczekujących opinii.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {pending.map((review) => (
              <ReviewRow
                key={review.id}
                review={review}
                onApprove={() => approve(review.id)}
                onDelete={() => remove(review.id)}
              />
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-heading text-lg font-semibold">Zatwierdzone</h2>
        {approved.length === 0 ? (
          <p className="text-muted-foreground text-sm">Brak zatwierdzonych opinii.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {approved.map((review) => (
              <ReviewRow key={review.id} review={review} onDelete={() => remove(review.id)} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ReviewRow({
  review,
  onApprove,
  onDelete,
}: {
  review: AdminReview;
  onApprove?: () => void;
  onDelete: () => void;
}) {
  return (
    <Card>
      <CardContent className="flex items-start gap-4">
        {review.photoUrl && (
          <div className="bg-muted relative size-16 shrink-0 overflow-hidden rounded-lg">
            <Image src={review.photoUrl} alt="" fill className="object-cover" />
          </div>
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <p className="font-heading text-sm font-semibold">{review.name}</p>
            <StarRatingDisplay value={review.rating} />
          </div>
          <p className="text-sm leading-relaxed">{review.content}</p>
          <p className="text-muted-foreground text-xs">
            {new Date(review.createdAt).toLocaleString("pl-PL")}
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2">
          {onApprove && (
            <Button type="button" size="icon-sm" onClick={onApprove} aria-label="Zatwierdź">
              <Check className="size-4" />
            </Button>
          )}
          <Button
            type="button"
            variant="destructive"
            size="icon-sm"
            onClick={onDelete}
            aria-label="Usuń"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
