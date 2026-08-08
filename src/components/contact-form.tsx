"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { AttachmentField } from "@/components/attachment-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ALLOWED_ATTACHMENT_TYPES } from "@/lib/attachment-limits";
import { useAttachmentUpload } from "@/lib/use-attachment-upload";

const ACCEPT = ALLOWED_ATTACHMENT_TYPES.join(",");

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "uploading" | "sending" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const attachments = useAttachmentUpload({
    handleUploadUrl: "/api/contact/upload",
    allowedTypes: ALLOWED_ATTACHMENT_TYPES,
  });

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email.trim() || !message.trim() || attachments.fileError) return;

    setErrorMessage("");

    try {
      let uploaded: { url: string; filename: string }[] = [];

      if (attachments.files.length > 0) {
        setStatus("uploading");
        uploaded = await attachments.uploadAll();
      }

      setStatus("sending");
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, attachments: uploaded }),
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
      attachments.reset();
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

          <AttachmentField
            id="contact-files"
            files={attachments.files}
            fileError={attachments.fileError}
            totalSize={attachments.totalSize}
            onFilesChange={attachments.handleFilesChange}
            onRemoveFile={attachments.removeFile}
            disabled={busy}
            accept={ACCEPT}
            hint="Zdjęcia (jpg, png, gif, webp, svg) lub PDF."
          />
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
        disabled={busy || !!attachments.fileError}
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
