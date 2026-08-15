"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, Trash2, ImagePlus } from "lucide-react";

export function ImageDropzone({
  name,
  preview,
  onFiles,
  onRemove,
  multiple = false,
  aspectClassName = "aspect-square",
  hint,
  className = "",
}: {
  name?: string;
  preview?: string | null;
  onFiles: (files: File[]) => void;
  onRemove?: () => void;
  multiple?: boolean;
  aspectClassName?: string;
  hint?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    onFiles(Array.from(fileList));
  }

  return (
    <div>
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (inputRef.current) inputRef.current.files = e.dataTransfer.files;
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      className={`group relative flex ${aspectClassName} cursor-pointer flex-col items-center justify-center gap-1.5 overflow-hidden rounded-2xl border-2 border-dashed p-3 text-center transition-colors ${
        dragging
          ? "border-brand-primary bg-brand-tint"
          : "border-brand-border bg-brand-tint/40 hover:border-brand-primary/60"
      } ${className}`}
    >
      {preview ? (
        <>
          <Image src={preview} alt="" fill sizes="200px" className="object-cover" />
          {onRemove && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (inputRef.current) inputRef.current.value = "";
                onRemove();
              }}
              aria-label="Remover imagem"
              className="absolute right-2 top-2 z-10 rounded-full bg-black/60 p-1.5 text-white hover:bg-red-500"
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
            <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-brand-text">
              <Upload className="h-3.5 w-3.5" strokeWidth={2} />
              Trocar
            </span>
          </div>
        </>
      ) : (
        <>
          <ImagePlus className="h-6 w-6 text-brand-muted" strokeWidth={1.5} />
          <p className="text-[11px] leading-snug text-brand-muted">
            Arraste a imagem aqui ou{" "}
            <span className="font-semibold text-brand-primary">clique para escolher</span>
          </p>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
    {hint && <p className="mt-1.5 text-[11px] leading-relaxed text-brand-muted">{hint}</p>}
    </div>
  );
}
