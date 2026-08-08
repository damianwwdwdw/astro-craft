"use client";

import { Paperclip, X } from "lucide-react";
import type { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MAX_FILE_SIZE_BYTES, MAX_TOTAL_SIZE_BYTES } from "@/lib/attachment-limits";
import { cn } from "@/lib/utils";

const MAX_FILE_MB = MAX_FILE_SIZE_BYTES / (1024 * 1024);
const MAX_TOTAL_MB = MAX_TOTAL_SIZE_BYTES / (1024 * 1024);

function formatSize(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AttachmentField({
  id,
  files,
  fileError,
  totalSize,
  onFilesChange,
  onRemoveFile,
  disabled,
  accept,
  hint,
}: {
  id: string;
  files: File[];
  fileError: string;
  totalSize: number;
  onFilesChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  disabled: boolean;
  accept?: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>Załączniki</Label>
      <Input
        id={id}
        type="file"
        multiple
        accept={accept}
        disabled={disabled}
        onChange={onFilesChange}
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
              <span className="text-muted-foreground shrink-0">{formatSize(file.size)}</span>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onRemoveFile(index)}
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
            ? `${files.length} ${files.length === 1 ? "plik" : "pliki"}, ${formatSize(totalSize)} / ${MAX_TOTAL_MB} MB`
            : (hint ?? `Maks. ${MAX_FILE_MB} MB na plik, ${MAX_TOTAL_MB} MB łącznie.`)}
      </p>
    </div>
  );
}
