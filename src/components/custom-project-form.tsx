"use client";

import { AlertCircle, CheckCircle2, Paperclip, X } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Must match MAX_TOTAL_SIZE_BYTES in src/app/api/custom-order/route.ts
const MAX_TOTAL_SIZE_BYTES = 4 * 1024 * 1024;

function formatSize(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function CustomProjectForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const overLimit = totalSize > MAX_TOTAL_SIZE_BYTES;

  function handleFilesChange(event: ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(event.target.files ?? []);
    setFiles((current) => [...current, ...picked]);
    event.target.value = "";
  }

  function removeFile(index: number) {
    setFiles((current) => current.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email.trim() || !description.trim() || overLimit) return;

    setStatus("submitting");
    setErrorMessage("");

    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    formData.set("description", description);
    files.forEach((file) => formData.append("attachments", file));

    try {
      const response = await fetch("/api/custom-order", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        setStatus("error");
        setErrorMessage(data.error ?? "Nie udało się wysłać wiadomości.");
        return;
      }

      setStatus("success");
      setName("");
      setEmail("");
      setDescription("");
      setFiles([]);
    } catch {
      setStatus("error");
      setErrorMessage("Błąd połączenia. Spróbuj ponownie.");
    }
  }

  if (status === "success") {
    return (
      <Card className="mx-auto max-w-xl">
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <CheckCircle2 className="text-brand-violet size-8" />
          <p className="font-heading font-semibold">Wiadomość wysłana</p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Dziękuję za przesłanie projektu — odpowiem w przeciągu 48h.
          </p>
          <Button type="button" variant="outline" onClick={() => setStatus("idle")}>
            Wyślij kolejne zapytanie
          </Button>
        </CardContent>
      </Card>
    );
  }

  const submitting = status === "submitting";

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-xl flex-col gap-6">
      <Card>
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="order-name">Imię</Label>
            <Input
              id="order-name"
              value={name}
              disabled={submitting}
              onChange={(event) => setName(event.target.value)}
              placeholder="np. Jan Kowalski"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="order-email">E-mail *</Label>
            <Input
              id="order-email"
              type="email"
              required
              value={email}
              disabled={submitting}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="np. jan@example.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="order-description">Opis projektu *</Label>
            <Textarea
              id="order-description"
              required
              value={description}
              disabled={submitting}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Opisz element, który chcesz zamówić — wymiary, przeznaczenie, do jakiego sprzętu pasuje..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="order-files">Załączniki</Label>
            <Input
              id="order-files"
              type="file"
              multiple
              disabled={submitting}
              onChange={handleFilesChange}
            />
            {files.length > 0 && (
              <ul className="flex flex-col gap-1.5">
                {files.map((file, index) => (
                  <li
                    key={`${file.name}-${file.lastModified}-${index}`}
                    className="bg-muted/50 flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs"
                  >
                    <Paperclip className="text-muted-foreground size-3.5 shrink-0" />
                    <span className="min-w-0 flex-1 truncate">{file.name}</span>
                    <span className="text-muted-foreground shrink-0">
                      {formatSize(file.size)}
                    </span>
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => removeFile(index)}
                      aria-label={`Usuń ${file.name}`}
                      className="text-muted-foreground hover:text-destructive shrink-0"
                    >
                      <X className="size-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <p className={cn("text-xs", overLimit ? "text-destructive" : "text-muted-foreground")}>
              {files.length > 0
                ? `${files.length} ${files.length === 1 ? "plik" : "pliki"}, ${formatSize(totalSize)} / 4 MB`
                : "Maks. 4 MB łącznie."}
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
        disabled={submitting || overLimit}
        className="from-brand-violet to-brand-periwinkle w-fit self-center bg-gradient-to-br px-8 py-3 text-white"
      >
        {submitting ? "Wysyłanie..." : "Wyślij"}
      </Button>
    </form>
  );
}
