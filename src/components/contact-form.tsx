"use client";

import { upload } from "@vercel/blob/client";
import { AlertCircle, CheckCircle2, Paperclip, X } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ALLOWED_ATTACHMENT_TYPES,
  MAX_FILE_SIZE_BYTES,
  MAX_TOTAL_SIZE_BYTES,
} from "@/lib/attachment-limits";
import { cn } from "@/lib/utils";

const ACCEPT = ALLOWED_ATTACHMENT_TYPES.join(",");

function formatSize(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");
  const [status, setStatus] = useState<
    "idle" | "uploading" | "sending" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  function handleFilesChange(event: ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (picked.length === 0) return;

    setFileError("");

    const allowedTypes: readonly string[] = ALLOWED_ATTACHMENT_TYPES;
    const invalidType = picked.find((file) => !allowedTypes.includes(file.type));
    if (invalidType) {
      setFileError(`Niedozwolony format pliku: ${invalidType.name}`);
      return;
    }

    const tooBig = picked.find((file) => file.size > MAX_FILE_SIZE_BYTES);
    if (tooBig) {
      setFileError(`Plik za duży: ${tooBig.name} (maks. 10 MB na plik)`);
      return;
    }

    const newTotal = totalSize + picked.reduce((sum, file) => sum + file.size, 0);
    if (newTotal > MAX_TOTAL_SIZE_BYTES) {
      setFileError("Łączny rozmiar załączników nie może przekraczać 20 MB.");
      return;
    }

    setFiles((current) => [...current, ...picked]);
  }

  function removeFile(index: number) {
    setFiles((current) => current.filter((_, i) => i !== index));
    setFileError("");
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email.trim() || !message.trim() || fileError) return;

    setErrorMessage("");

    try {
      let attachments: { url: string; filename: string }[] = [];

      if (files.length > 0) {
        setStatus("uploading");
        const uploaded = await Promise.all(
          files.map((file) =>
            upload(file.name, file, {
              access: "public",
              handleUploadUrl: "/api/contact/upload",
              contentType: file.type,
            })
          )
        );
        attachments = uploaded.map((blob, index) => ({
          url: blob.url,
          filename: files[index].name,
        }));
      }

      setStatus("sending");
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, attachments }),
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
      setMessage("");
      setFiles([]);
    } catch {
      setStatus("error");
      setErrorMessage("Nie udało się przesłać załączników. Spróbuj ponownie.");
    }
  }

  if (status === "success") {
    return (
      <Card className="mx-auto w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <CheckCircle2 className="text-brand-violet size-8" />
          <p className="font-heading font-semibold">Wiadomość wysłana</p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Dziękuję za wiadomość — odezwę się najszybciej jak to możliwe.
          </p>
          <Button type="button" variant="outline" onClick={() => setStatus("idle")}>
            Wyślij kolejną wiadomość
          </Button>
        </CardContent>
      </Card>
    );
  }

  const busy = status === "uploading" || status === "sending";

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-md flex-col gap-6">
      <Card>
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-name">Imię</Label>
            <Input
              id="contact-name"
              value={name}
              disabled={busy}
              onChange={(event) => setName(event.target.value)}
              placeholder="np. Jan Kowalski"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-email">E-mail *</Label>
            <Input
              id="contact-email"
              type="email"
              required
              value={email}
              disabled={busy}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="np. jan@example.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-message">Wiadomość *</Label>
            <Textarea
              id="contact-message"
              required
              value={message}
              disabled={busy}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Napisz, w czym mogę pomóc..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-files">Załączniki</Label>
            <Input
              id="contact-files"
              type="file"
              multiple
              accept={ACCEPT}
              disabled={busy}
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
                      disabled={busy}
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
            <p className={cn("text-xs", fileError ? "text-destructive" : "text-muted-foreground")}>
              {fileError
                ? fileError
                : files.length > 0
                  ? `${files.length} ${files.length === 1 ? "plik" : "pliki"}, ${formatSize(totalSize)} / 20 MB`
                  : "Zdjęcia (jpg, png, gif, webp, svg) lub PDF. Maks. 10 MB na plik, 20 MB łącznie."}
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
        disabled={busy || !!fileError}
        className="from-brand-violet to-brand-periwinkle w-fit self-center bg-gradient-to-br px-8 py-3 text-white"
      >
        {status === "uploading"
          ? "Przesyłanie plików..."
          : status === "sending"
            ? "Wysyłanie..."
            : "Wyślij"}
      </Button>
    </form>
  );
}
