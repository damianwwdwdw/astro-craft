"use client";

import { upload } from "@vercel/blob/client";
import { AlertCircle, CheckCircle2, Gift, Paperclip, X } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { StarRatingInput } from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE_BYTES } from "@/lib/attachment-limits";

const ACCEPT = ALLOWED_IMAGE_TYPES.join(",");
const MAX_FILE_MB = MAX_FILE_SIZE_BYTES / (1024 * 1024);

function formatSize(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ReviewForm() {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [status, setStatus] = useState<
    "idle" | "uploading" | "sending" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const allowedTypes: readonly string[] = ALLOWED_IMAGE_TYPES;

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setPhotoError("");

    if (!allowedTypes.includes(file.type)) {
      setPhotoError(`Niedozwolony format pliku: ${file.name}`);
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setPhotoError(`Plik za duży: ${file.name} (maks. ${MAX_FILE_MB} MB)`);
      return;
    }

    setPhoto(file);
  }

  const busy = status === "uploading" || status === "sending";

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim() || !content.trim() || rating < 1 || photoError) return;

    setErrorMessage("");

    try {
      let photoUrl: string | null = null;

      if (photo) {
        setStatus("uploading");
        const blob = await upload(photo.name, photo, {
          access: "public",
          handleUploadUrl: "/api/reviews/upload",
          contentType: photo.type,
        });
        photoUrl = blob.url;
      }

      setStatus("sending");
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, content, rating, photoUrl }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        setStatus("error");
        setErrorMessage(data.error ?? "Nie udało się dodać opinii.");
        return;
      }

      setStatus("success");
      setName("");
      setContent("");
      setRating(0);
      setPhoto(null);
    } catch {
      setStatus("error");
      setErrorMessage("Nie udało się przesłać opinii. Spróbuj ponownie.");
    }
  }

  if (status === "success") {
    return (
      <Card className="mx-auto w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <CheckCircle2 className="text-brand-violet size-8" />
          <p className="font-heading font-semibold">Dziękuję za opinię!</p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Pojawi się publicznie po zatwierdzeniu.
          </p>
          <Button type="button" variant="outline" onClick={() => setStatus("idle")}>
            Dodaj kolejną opinię
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-md flex-col gap-6">
      <div className="border-brand-violet/30 bg-brand-violet/10 flex items-start gap-3 rounded-2xl border p-4">
        <Gift className="text-brand-violet mt-0.5 size-5 shrink-0" />
        <p className="text-sm leading-relaxed">
          Dodaj opinię wraz ze zdjęciem produktu i zgarnij{" "}
          <span className="font-semibold">rabat 10% na kolejne zamówienie</span> — wystarczy
          wspomnieć o tym przy składaniu zamówienia.
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="review-name">Imię *</Label>
            <Input
              id="review-name"
              required
              value={name}
              disabled={busy}
              onChange={(event) => setName(event.target.value)}
              placeholder="np. Jan Kowalski"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Ocena *</Label>
            <StarRatingInput value={rating} onChange={setRating} disabled={busy} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="review-content">Treść opinii *</Label>
            <Textarea
              id="review-content"
              required
              value={content}
              disabled={busy}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Podziel się wrażeniami..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="review-photo">Zdjęcie (opcjonalnie)</Label>
            <Input
              id="review-photo"
              type="file"
              accept={ACCEPT}
              disabled={busy}
              onChange={handlePhotoChange}
            />
            {photo && !photoError && (
              <div className="bg-muted/50 flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs">
                <Paperclip className="text-muted-foreground size-3.5 shrink-0" />
                <span className="min-w-0 flex-1 truncate">{photo.name}</span>
                <span className="text-muted-foreground shrink-0">{formatSize(photo.size)}</span>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setPhoto(null)}
                  aria-label={`Usuń ${photo.name}`}
                  className="text-muted-foreground hover:text-destructive shrink-0"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            )}
            <p
              className={
                photoError ? "text-destructive text-xs" : "text-muted-foreground text-xs"
              }
            >
              {photoError || `Zdjęcia (jpg, png, gif, webp). Maks. ${MAX_FILE_MB} MB.`}
            </p>
          </div>
        </CardContent>
      </Card>

      {status === "error" && (
        <div className="text-destructive flex items-center gap-2 text-sm">
          <AlertCircle className="size-4 shrink-0" />
          {errorMessage}
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={busy || !!photoError || !name.trim() || !content.trim() || rating < 1}
        className="from-brand-violet to-brand-periwinkle w-fit self-center bg-gradient-to-br px-8 py-3 text-white"
      >
        {busy
          ? status === "uploading"
            ? "Przesyłanie zdjęcia..."
            : "Wysyłanie..."
          : "Dodaj opinię"}
      </Button>
    </form>
  );
}
