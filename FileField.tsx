"use client";

import { useRef, useState } from "react";
import { FileText, Link2, Loader2, Trash2, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { uploadFile } from "@/lib/storage";
import { VideoPlayer } from "@/components/Media";
import { inferMediaType, isVideoUrl } from "@/lib/utils";
import type { Field } from "@/lib/admin-config";
import type { MediaType } from "@/types";

const ACCEPT: Record<string, string> = {
  image: "image/*",
  video: "video/mp4,video/webm,video/quicktime",
  media: "image/*,video/mp4,video/webm,video/quicktime",
  file: "image/*,application/pdf",
};

export function FileField({
  field,
  value,
  onChange,
  onBusy,
}: {
  field: Field;
  value: string;
  onChange: (url: string, mediaType?: MediaType) => void;
  onBusy: (busy: boolean) => void;
}) {
  const supabase = useRef(createClient()).current;
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrl, setShowUrl] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setUploading(true);
    onBusy(true);
    try {
      const url = await uploadFile(supabase, file, field.folder ?? "misc");
      onChange(url, file.type.startsWith("video/") ? "video" : "image");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload gagal.");
    } finally {
      setUploading(false);
      onBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  const isPdf = /\.pdf(\?.*)?$/i.test(value);
  const showVideo = value && (field.type === "video" || (field.type === "media" && isVideoUrl(value)));

  return (
    <div className="space-y-3">
      {value && (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          {showVideo ? (
            <VideoPlayer url={value} className="max-h-64" />
          ) : isPdf ? (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 text-sm font-semibold text-brand"
            >
              <FileText className="h-5 w-5" /> Buka dokumen PDF
            </a>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Pratinjau" className="max-h-64 w-full object-contain" />
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={input}
          type="file"
          accept={ACCEPT[field.type] ?? "*/*"}
          className="sr-only"
          onChange={(e) => handleFile(e.target.files?.[0])}
          id={`file-${field.name}`}
        />
        <button type="button" disabled={uploading} onClick={() => input.current?.click()} className="btn btn-outline btn-sm">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? "Mengunggah…" : value ? "Ganti file" : "Unggah file"}
        </button>
        <button type="button" onClick={() => setShowUrl((v) => !v)} className="btn btn-outline btn-sm">
          <Link2 className="h-4 w-4" /> Pakai URL
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="btn btn-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" /> Hapus
          </button>
        )}
      </div>

      {showUrl && (
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value, field.mediaTypeField ? inferMediaType(e.target.value) : undefined)}
          placeholder="https://… (gambar, video, atau link YouTube)"
          className="input"
        />
      )}
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
