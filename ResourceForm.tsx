"use client";

import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { FileField } from "./FileField";
import { MAX_UPLOAD_MB } from "@/lib/constants";
import type { Field, ResourceConfig } from "@/lib/admin-config";
import type { MediaType } from "@/types";

export type FormValues = Record<string, unknown>;
export type RelationOptions = Record<string, { value: string; label: string }[]>;

function optionsFor(field: Field, relations: RelationOptions) {
  if (field.type === "relation") return relations[field.name] ?? [];
  return field.options ?? [];
}

export function ResourceForm({
  config,
  initial,
  relations,
  isNew,
  saving,
  onCancel,
  onSubmit,
}: {
  config: ResourceConfig;
  initial: FormValues;
  relations: RelationOptions;
  isNew: boolean;
  saving: boolean;
  onCancel: () => void;
  onSubmit: (values: FormValues, bulkFiles: File[]) => void;
}) {
  const [values, setValues] = useState<FormValues>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bulk, setBulk] = useState<File[]>([]);
  const bulkInput = useRef<HTMLInputElement>(null);

  const bulkMode = !!config.bulkUpload && isNew;
  const set = (name: string, v: unknown) => setValues((p) => ({ ...p, [name]: v }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    for (const f of config.fields) {
      if (bulkMode && (f.type === "media" || f.name === f.mediaTypeField)) continue;
      if (bulkMode && f.name === "media_type") continue;
      if (!f.required) continue;
      const v = values[f.name];
      if (v === undefined || v === null || String(v).trim() === "") {
        setError(`"${f.label}" wajib diisi.`);
        return;
      }
    }
    if (bulkMode && bulk.length === 0) {
      setError("Pilih minimal satu foto atau video.");
      return;
    }
    onSubmit(values, bulk);
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {config.fields.map((f) => {
          // Mode unggah banyak: field file & jenis media diganti pemilih multi-file.
          if (bulkMode && f.type === "media") {
            return (
              <div key={f.name} className="sm:col-span-2">
                <span className="label">Foto / video (boleh banyak sekaligus) *</span>
                <input
                  ref={bulkInput}
                  type="file"
                  multiple
                  accept="image/*,video/mp4,video/webm,video/quicktime"
                  className="sr-only"
                  onChange={(e) => setBulk(Array.from(e.target.files ?? []))}
                />
                <button type="button" onClick={() => bulkInput.current?.click()} className="btn btn-outline btn-sm">
                  <Upload className="h-4 w-4" /> Pilih file
                </button>
                <p className="mt-2 text-xs text-slate-500">Maks. {MAX_UPLOAD_MB} MB per file. Judul akan diberi nomor otomatis bila lebih dari satu.</p>
                {bulk.length > 0 && (
                  <ul className="mt-3 max-h-40 space-y-1 overflow-y-auto rounded-xl bg-slate-50 p-3 text-xs">
                    {bulk.map((file, i) => (
                      <li key={i} className="flex items-center justify-between gap-3">
                        <span className="truncate">{file.name}</span>
                        <button
                          type="button"
                          aria-label={`Hapus ${file.name}`}
                          onClick={() => setBulk((b) => b.filter((_, j) => j !== i))}
                          className="text-slate-400 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          }
          if (bulkMode && f.name === "media_type") return null;

          const full = f.type === "textarea" || f.type === "checkbox" || ["image", "video", "file", "media"].includes(f.type);
          const id = `f-${f.name}`;
          const v = values[f.name];

          return (
            <div key={f.name} className={full ? "sm:col-span-2" : ""}>
              {f.type === "checkbox" ? (
                <label className="flex cursor-pointer items-center gap-3 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={!!v}
                    onChange={(e) => set(f.name, e.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-brand focus:ring-brand"
                  />
                  {f.label}
                </label>
              ) : (
                <>
                  <label htmlFor={id} className="label">
                    {f.label}
                    {f.required && " *"}
                  </label>
                  {f.type === "textarea" ? (
                    <textarea id={id} rows={4} value={String(v ?? "")} onChange={(e) => set(f.name, e.target.value)} className="input resize-y" />
                  ) : f.type === "select" || f.type === "relation" ? (
                    <select
                      id={id}
                      value={String(v ?? "")}
                      onChange={(e) => set(f.name, e.target.value)}
                      className="input"
                    >
                      <option value="">{f.type === "relation" ? "— Tidak ada —" : "Pilih…"}</option>
                      {optionsFor(f, relations).map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : ["image", "video", "file", "media"].includes(f.type) ? (
                    <FileField
                      field={f}
                      value={String(v ?? "")}
                      onBusy={setBusy}
                      onChange={(url: string, mt?: MediaType) => {
                        setValues((p) => ({
                          ...p,
                          [f.name]: url,
                          ...(f.mediaTypeField && mt ? { [f.mediaTypeField]: mt } : {}),
                        }));
                      }}
                    />
                  ) : (
                    <input
                      id={id}
                      type={f.type === "number" ? "number" : f.type === "date" ? "date" : f.type === "url" ? "url" : "text"}
                      value={String(v ?? "")}
                      placeholder={f.placeholder}
                      onChange={(e) => set(f.name, e.target.value)}
                      className="input"
                    />
                  )}
                  {f.help && <p className="mt-1.5 text-xs text-slate-500">{f.help}</p>}
                </>
              )}
            </div>
          );
        })}
      </div>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
        <button type="button" onClick={onCancel} className="btn btn-outline" disabled={saving}>
          Batal
        </button>
        <button type="submit" className="btn btn-primary" disabled={saving || busy}>
          {(saving || busy) && <Loader2 className="h-4 w-4 animate-spin" />}
          {busy ? "Menunggu upload…" : saving ? "Menyimpan…" : "Simpan"}
        </button>
      </div>
    </form>
  );
}
