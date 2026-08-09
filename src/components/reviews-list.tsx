"use client";

import { Quote } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ReviewForm } from "@/components/review-form";
import { StarRatingDisplay } from "@/components/star-rating";
import { Card, CardContent } from "@/components/ui/card";
import type { Review } from "@/lib/reviews";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ReviewsList() {
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/reviews")
      .then((response) => response.json())
      .then((data) => {
        if (cancelled) return;
        if (data.success) {
          setReviews(data.reviews);
        } else {
          setLoadError(true);
        }
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function handleSubmitted(review: Review) {
    setReviews((current) => [review, ...(current ?? [])]);
  }

  return (
    <div className="flex flex-col gap-12">
      <ReviewForm onSubmitted={handleSubmitted} />

      {reviews === null ? (
        loadError ? (
          <p className="text-muted-foreground text-center text-sm">
            Nie udało się wczytać opinii. Spróbuj odświeżyć stronę.
          </p>
        ) : (
          <p className="text-muted-foreground text-center text-sm">Wczytywanie opinii...</p>
        )
      ) : reviews.length === 0 ? (
        <p className="text-muted-foreground text-center text-sm">
          Brak opinii — bądź pierwszą osobą, która się podzieli wrażeniami!
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <Card key={review.id} className="h-full">
              <CardContent className="flex h-full flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <Quote className="text-brand-periwinkle size-5 shrink-0" />
                  <StarRatingDisplay value={review.rating} />
                </div>

                {review.photoUrl && (
                  <div className="bg-muted relative aspect-video w-full overflow-hidden rounded-lg">
                    <Image
                      src={review.photoUrl}
                      alt={`Zdjęcie do opinii — ${review.name}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <p className="text-sm leading-relaxed">{review.content}</p>

                <div className="mt-auto flex items-center justify-between pt-2">
                  <p className="font-heading text-sm font-semibold">{review.name}</p>
                  <p className="text-muted-foreground text-xs">{formatDate(review.createdAt)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
