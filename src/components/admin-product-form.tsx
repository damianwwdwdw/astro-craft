"use client";

import { Check } from "lucide-react";
import Image from "next/image";
import { useState, type FormEvent } from "react";
import { AttachmentField } from "@/components/attachment-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ALLOWED_IMAGE_TYPES } from "@/lib/attachment-limits";
import { CATEGORIES } from "@/lib/categories";
import { STANDARD_COLORS } from "@/lib/products";
import { useAttachmentUpload } from "@/lib/use-attachment-upload";
import { cn } from "@/lib/utils";

const SELECTABLE_CATEGORIES = CATEGORIES.filter((c) => c.slug !== "wszystko" && !c.href);

export function AdminProductForm({ onCreated }: { onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [categorySlug, setCategorySlug] = useState(SELECTABLE_CATEGORIES[0]?.slug ?? "");
  const [excerpt, setExcerpt] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [colorsEnabled, setColorsEnabled] = useState(false);
  const [colorIds, setColorIds] = useState<string[]>([]);
  const [customFieldEnabled, setCustomFieldEnabled] = useState(false);
  const [customFieldLabel, setCustomFieldLabel] = useState("");
  const [customFieldType, setCustomFieldType] = useState<"text" | "number">("text");
  const [customFieldMin, setCustomFieldMin] = useState("");
  const [customFieldMax, setCustomFieldMax] = useState("");
  const [status, setStatus] = useState<"idle" | "uploading" | "sending" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const photos = useAttachmentUpload({
    handleUploadUrl: "/api/admin/products/upload",
    allowedTypes: ALLOWED_IMAGE_TYPES,
  });

  const busy = status === "uploading" || status === "sending";

  function toggleColor(id: string) {
    setColorIds((current) =>
      current.includes(id) ? current.filter((c) => c !== id) : [...current, id]
    );
  }

  const parsedMin = Number(customFieldMin);
  const parsedMax = Number(customFieldMax);
  const numericRangeValid =
    customFieldMin.trim() !== "" &&
    customFieldMax.trim() !== "" &&
    Number.isFinite(parsedMin) &&
    Number.isFinite(parsedMax) &&
    parsedMin <= parsedMax;

  const canSubmit =
    !busy &&
    title.trim() !== "" &&
    excerpt.trim() !== "" &&
    description.trim() !== "" &&
    categorySlug !== "" &&
    photos.files.length > 0 &&
    !photos.fileError &&
    (!customFieldEnabled ||
      (customFieldLabel.trim() !== "" && (customFieldType === "text" || numericRangeValid)));

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;

    setErrorMessage("");

    try {
      setStatus("uploading");
      const uploaded = await photos.uploadAll();

      setStatus("sending");
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          categorySlug,
          excerpt,
          description,
          features: features.split("\n"),
          images: uploaded.map((f) => f.url),
          colorIds: colorsEnabled ? colorIds : [],
          customFieldLabel: customFieldEnabled ? customFieldLabel : null,
          customFieldType,
          customFieldMin: customFieldType === "number" ? parsedMin : null,
          customFieldMax: customFieldType === "number" ? parsedMax : null,
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        setStatus("error");
        setErrorMessage(data.error ?? "Nie udało się dodać produktu.");
        return;
      }

      setTitle("");
      setExcerpt("");
      setDescription("");
      setFeatures("");
      setColorsEnabled(false);
      setColorIds([]);
      setCustomFieldEnabled(false);
      setCustomFieldLabel("");
      setCustomFieldType("text");
      setCustomFieldMin("");
      setCustomFieldMax("");
      photos.reset();
      setStatus("idle");
      onCreated();
    } catch {
      setStatus("error");
      setErrorMessage("Nie udało się przesłać danych. Spróbuj ponownie.");
    }
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <p className="font-heading font-semibold">Dodaj ogłoszenie</p>

          <div className="flex flex-col gap-2">
            <Label htmlFor="product-title">Tytuł *</Label>
            <Input
              id="product-title"
              required
              value={title}
              disabled={busy}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="np. Uchwyt na latarkę czołową"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="product-category">Kategoria *</Label>
            <select
              id="product-category"
              required
              value={categorySlug}
              disabled={busy}
              onChange={(event) => setCategorySlug(event.target.value)}
              className="border-input h-8 w-full rounded-lg border bg-transparent px-2.5 text-sm outline-none disabled:opacity-50"
            >
              {SELECTABLE_CATEGORIES.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="product-excerpt">Krótki opis (skrót) *</Label>
            <Input
              id="product-excerpt"
              required
              value={excerpt}
              disabled={busy}
              onChange={(event) => setExcerpt(event.target.value)}
              placeholder="Jedno zdanie widoczne na karcie w sklepie"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="product-description">Pełny opis *</Label>
            <Textarea
              id="product-description"
              required
              value={description}
              disabled={busy}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Opis produktu. Puste linie oddzielają akapity."
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="product-features">Cechy (opcjonalnie, jedna na linię)</Label>
            <Textarea
              id="product-features"
              value={features}
              disabled={busy}
              onChange={(event) => setFeatures(event.target.value)}
              placeholder={"np.\nWydruk na miarę\nOdporny na wilgoć"}
            />
          </div>

          <AttachmentField
            id="product-photos"
            files={photos.files}
            fileError={photos.fileError}
            totalSize={photos.totalSize}
            onFilesChange={photos.handleFilesChange}
            onRemoveFile={photos.removeFile}
            disabled={busy}
            accept={ALLOWED_IMAGE_TYPES.join(",")}
            hint="Zdjęcia produktu (jpg, png, gif, webp) — pierwsze będzie zdjęciem głównym."
          />

          <div className="flex items-center gap-2">
            <Checkbox
              id="product-colors-enabled"
              checked={colorsEnabled}
              onCheckedChange={() => setColorsEnabled((v) => !v)}
              disabled={busy}
            />
            <Label htmlFor="product-colors-enabled">Kolory do wyboru</Label>
          </div>

          {colorsEnabled && (
            <div className="flex flex-wrap gap-2">
              {STANDARD_COLORS.map((color) => {
                const selected = colorIds.includes(color.id);
                return (
                  <button
                    key={color.id}
                    type="button"
                    disabled={busy}
                    aria-pressed={selected}
                    title={color.name}
                    onClick={() => toggleColor(color.id)}
                    className={cn(
                      "bg-card relative size-9 shrink-0 overflow-hidden rounded-full ring-2 transition-colors",
                      selected ? "ring-brand-violet" : "ring-border hover:ring-brand-lavender/50"
                    )}
                  >
                    <Image src={color.swatch} alt={color.name} fill className="object-cover" />
                    {selected && (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Check className="size-3.5 text-white drop-shadow" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Checkbox
              id="product-custom-field-enabled"
              checked={customFieldEnabled}
              onCheckedChange={() => setCustomFieldEnabled((v) => !v)}
              disabled={busy}
            />
            <Label htmlFor="product-custom-field-enabled">Pole do wypełnienia przez klienta</Label>
          </div>

          {customFieldEnabled && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="product-custom-field-label">Etykieta pola *</Label>
                <Input
                  id="product-custom-field-label"
                  required
                  value={customFieldLabel}
                  disabled={busy}
                  onChange={(event) => setCustomFieldLabel(event.target.value)}
                  placeholder="np. Podaj średnicę tuby (mm)"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="product-custom-field-type">Typ pola</Label>
                <select
                  id="product-custom-field-type"
                  value={customFieldType}
                  disabled={busy}
                  onChange={(event) => setCustomFieldType(event.target.value as "text" | "number")}
                  className="border-input h-8 w-full rounded-lg border bg-transparent px-2.5 text-sm outline-none disabled:opacity-50"
                >
                  <option value="text">Tekstowe</option>
                  <option value="number">Liczbowe (z zakresem)</option>
                </select>
              </div>

              {customFieldType === "number" && (
                <div className="flex gap-4">
                  <div className="flex flex-1 flex-col gap-2">
                    <Label htmlFor="product-custom-field-min">Minimum *</Label>
                    <Input
                      id="product-custom-field-min"
                      type="number"
                      required
                      value={customFieldMin}
                      disabled={busy}
                      onChange={(event) => setCustomFieldMin(event.target.value)}
                      placeholder="np. 20"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <Label htmlFor="product-custom-field-max">Maksimum *</Label>
                    <Input
                      id="product-custom-field-max"
                      type="number"
                      required
                      value={customFieldMax}
                      disabled={busy}
                      onChange={(event) => setCustomFieldMax(event.target.value)}
                      placeholder="np. 250"
                    />
                  </div>
                </div>
              )}
              {customFieldType === "number" && !numericRangeValid && (
                <p className="text-muted-foreground -mt-2 text-xs">
                  Podaj zakres w jednostce z etykiety (np. milimetrach) — minimum nie może być
                  większe od maksimum.
                </p>
              )}
            </div>
          )}

          {status === "error" && <p className="text-destructive text-sm">{errorMessage}</p>}

          <Button
            type="submit"
            disabled={!canSubmit}
            className="from-brand-violet to-brand-periwinkle w-fit bg-gradient-to-br px-6 py-3 text-white"
          >
            {status === "uploading"
              ? "Przesyłanie zdjęć..."
              : status === "sending"
                ? "Zapisywanie..."
                : "Dodaj ogłoszenie"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
