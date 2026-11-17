"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { removeStoredFiles } from "@/lib/storage";
import { FileField } from "./FileField";
import type { Field } from "@/lib/admin-config";

type Values = Record<string, string>;

const TEXT_FIELDS: { name: string; label: string; area?: boolean; hint?: string; placeholder?: string }[] = [
  { name: "name", label: "Nama ekskul" },
  { name: "tagline", label: "Tagline" },
  { name: "description", label: "Profil / deskripsi singkat", area: true },
  { name: "history", label: "Sejarah singkat", area: true },
  { name: "vision", label: "Visi", area: true },
  { name: "mission", label: "Misi", area: true, hint: "Satu poin per baris." },
  { name: "goals", label: "Tujuan organisasi", area: true, hint: "Satu poin per baris." },
  { name: "email", label: "Email" },
  { name: "phone", label: "Telepon / WhatsApp" },
  { name: "address", label: "Alamat / lokasi" },
  { name: "instagram", label: "Instagram (URL)", placeholder: "https://instagram.com/…" },
  { name: "youtube", label: "YouTube (URL)", placeholder: "https://youtube.com/@…" },
  { name: "tiktok", label: "TikTok (URL)", placeholder: "https://tiktok.com/@…" },
];

const HERO_FIELD: Field = { name: "hero_image_url", label: "Foto utama hero", type: "image", folder: "profile" };

export function ProfileForm() {
  const supabase = useRef(createClient()).current;
  const [values, setValues] = useState<Values>({});
  const [original, setOriginal] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", 1).maybeSingle();
      if (error) setLoadError(error.message);
      else {
        const v: Values = {};
        [...TEXT_FIELDS.map((f) => f.name), "hero_image_url"].forEach((k) => (v[k] = (data?.[k] as string) ?? ""));
        setValues(v);
        setOriginal(v.hero_image_url);
      }
      setLoading(false);
    })();
  }, [supabase]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    const payload: Record<string, unknown> = { id: 1 };
    for (const [k, v] of Object.entries(values)) payload[k] = v.trim() === "" ? null : v.trim();
    if (!payload.name) payload.name = "ADB CREATIVE TEAM";

    const { error } = await supabase.from("profiles").upsert(payload);
    if (error) {
      setMsg({
        ok: false,
        text: /row-level security/i.test(error.message)
          ? "Akses ditolak: akun ini belum terdaftar sebagai admin."
          : error.message,
      });
    } else {
      if (original && original !== values.hero_image_url) await removeStoredFiles(supabase, [original]);
      setOriginal(values.hero_image_url);
      setMsg({ ok: true, text: "Profil ekskul berhasil disimpan dan sudah tampil di website." });
    }
    setSaving(false);
  }

  if (loading)
    return (
      <div className="grid place-items-center py-24 text-slate-500" role="status">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
        <p className="mt-3 text-sm">Memuat profil…</p>
      </div>
    );

  if (loadError)
    return <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">Gagal memuat profil: {loadError}</div>;

  return (
    <form onSubmit={onSubmit} className="max-w-3xl">
      <h1 className="font-display text-3xl font-extrabold">Profil Ekskul</h1>
      <p className="mt-1 text-sm text-slate-500">Informasi ini tampil di beranda, halaman About, kontak, dan footer.</p>

      <div className="mt-8 space-y-5 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
        {TEXT_FIELDS.map((f) => (
          <div key={f.name}>
            <label htmlFor={f.name} className="label">{f.label}</label>
            {f.area ? (
              <textarea id={f.name} rows={4} value={values[f.name] ?? ""} onChange={(e) => setValues((p) => ({ ...p, [f.name]: e.target.value }))} className="input resize-y" />
            ) : (
              <input id={f.name} value={values[f.name] ?? ""} placeholder={f.placeholder} onChange={(e) => setValues((p) => ({ ...p, [f.name]: e.target.value }))} className="input" />
            )}
            {f.hint && <p className="mt-1.5 text-xs text-slate-500">{f.hint}</p>}
          </div>
        ))}
        <div>
          <span className="label">{HERO_FIELD.label}</span>
          <FileField
            field={HERO_FIELD}
            value={values.hero_image_url ?? ""}
            onBusy={setBusy}
            onChange={(url) => setValues((p) => ({ ...p, hero_image_url: url }))}
          />
        </div>
      </div>

      {msg && (
        <p
          role="status"
          className={`mt-5 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ${msg.ok ? "bg-ice text-brand-700" : "bg-red-50 text-red-700"}`}
        >
          {msg.ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          {msg.text}
        </p>
      )}

      <button type="submit" disabled={saving || busy} className="btn btn-primary mt-6">
        {saving || busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {busy ? "Menunggu upload…" : saving ? "Menyimpan…" : "Simpan perubahan"}
      </button>
    </form>
  );
}
