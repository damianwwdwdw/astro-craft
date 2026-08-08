"use client";

import { upload } from "@vercel/blob/client";
import { useState, type ChangeEvent } from "react";
import { MAX_FILE_SIZE_BYTES, MAX_TOTAL_SIZE_BYTES } from "@/lib/attachment-limits";

export type UploadedAttachment = { url: string; filename: string };

const MAX_FILE_MB = MAX_FILE_SIZE_BYTES / (1024 * 1024);
const MAX_TOTAL_MB = MAX_TOTAL_SIZE_BYTES / (1024 * 1024);

export function useAttachmentUpload({
  handleUploadUrl,
  allowedTypes,
}: {
  handleUploadUrl: string;
  /** Gdy pominięte, dozwolony jest dowolny typ pliku. */
  allowedTypes?: readonly string[];
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  function handleFilesChange(event: ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (picked.length === 0) return;

    setFileError("");

    if (allowedTypes) {
      const invalidType = picked.find((file) => !allowedTypes.includes(file.type));
      if (invalidType) {
        setFileError(`Niedozwolony format pliku: ${invalidType.name}`);
        return;
      }
    }

    const tooBig = picked.find((file) => file.size > MAX_FILE_SIZE_BYTES);
    if (tooBig) {
      setFileError(`Plik za duży: ${tooBig.name} (maks. ${MAX_FILE_MB} MB na plik)`);
      return;
    }

    const newTotal = totalSize + picked.reduce((sum, file) => sum + file.size, 0);
    if (newTotal > MAX_TOTAL_SIZE_BYTES) {
      setFileError(`Łączny rozmiar załączników nie może przekraczać ${MAX_TOTAL_MB} MB.`);
      return;
    }

    setFiles((current) => [...current, ...picked]);
  }

  function removeFile(index: number) {
    setFiles((current) => current.filter((_, i) => i !== index));
    setFileError("");
  }

  function reset() {
    setFiles([]);
    setFileError("");
  }

  async function uploadAll(): Promise<UploadedAttachment[]> {
    if (files.length === 0) return [];
    const uploaded = await Promise.all(
      files.map((file) =>
        upload(file.name, file, {
          access: "public",
          handleUploadUrl,
          contentType: file.type,
        })
      )
    );
    return uploaded.map((blob, index) => ({ url: blob.url, filename: files[index].name }));
  }

  return { files, fileError, totalSize, handleFilesChange, removeFile, reset, uploadAll };
}
