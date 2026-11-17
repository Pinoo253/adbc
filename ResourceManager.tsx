"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Film, Loader2, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { FILE_FIELD_TYPES, RESOURCES, type Field, type ResourceKey } from "@/lib/admin-config";
import { removeStoredFiles, uploadFile } from "@/lib/storage";
import { formatDate, inferMediaType, isVideoUrl } from "@/lib/utils";
import { Modal } from "./Modal";
import { ResourceForm, type FormValues, type RelationOptions } from "./ResourceForm";

type Row = Record<string, unknown> & { id: string };
type Toast = { type: "ok" | "err"; text: string } | null;

export function ResourceManager({ resourceKey }: { resourceKey: ResourceKey }) {
  const config = RESOURCES[resourceKey];
  const supabase = useRef(createClient()).current;

  const [rows, setRows] = useState<Row[]>([]);
  const [relations, setRelations] = useState<RelationOptions>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<Row | null>(null);
  const [deletingBusy, setDeletingBusy] = useState(false);
  const [toast, setToast] = useState<Toast>(null);

  const notify = useCallback((type: "ok" | "err", text: string) => {
    setToast({ type, text });
    window.setTimeout(() => setToast(null), 4500);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    const { data, error } = await supabase
      .from(config.key)
      .select("*")
      .order(config.orderBy.column, { ascending: config.orderBy.ascending });
    if (error) setLoadError(error.message);
    else setRows((data ?? []) as Row[]);

    // Opsi untuk field relasi (kategori / kegiatan)
    const rel: RelationOptions = {};
    for (const f of config.fields) {
      if (f.type !== "relation" || !f.relation) continue;
      if (f.relation === "activities") {
        const r = await supabase.from("activities").select("id,title").order("date", { ascending: false });
        rel[f.name] = (r.data ?? []).map((a: { id: string; title: string }) => ({ value: a.id, label: a.title }));
      } else {
        const type = f.relation === "activity-categories" ? "activity" : "project";
        const r = await supabase.from("categories").select("id,name").eq("type", type).order("name");
        rel[f.name] = (r.data ?? []).map((c: { id: string; name: string }) => ({ value: c.id, label: c.name }));
      }
    }
    setRelations(rel);
    setLoading(false);
  }, [supabase, config]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((r) =>
      config.searchFields.some((f) => String(r[f] ?? "").toLowerCase().includes(term)),
    );
  }, [rows, q, config]);

  const fieldByName = useMemo(() => Object.fromEntries(config.fields.map((f) => [f.name, f])), [config]);

  function display(fieldName: string, row: Row): string {
    const f: Field | undefined = fieldByName[fieldName];
    const v = row[fieldName];
    if (v === null || v === undefined || v === "") return "";
    if (f?.type === "date") return formatDate(String(v), { day: "numeric", month: "short", year: "numeric" });
    if (f?.type === "relation") return relations[fieldName]?.find((o) => o.value === v)?.label ?? "";
    if (f?.type === "select") return f.options?.find((o) => o.value === v)?.label ?? String(v);
    return String(v);
  }

  function initialValues(row: Row | "new"): FormValues {
    if (row === "new") return { ...(config.defaults ?? {}) };
    const out: FormValues = {};
    for (const f of config.fields) out[f.name] = row[f.name] ?? (f.type === "checkbox" ? false : "");
    return out;
  }

  function clean(values: FormValues): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    for (const f of config.fields) {
      let v = values[f.name];
      if (f.type === "checkbox") v = !!v;
      else if (f.type === "number") v = v === "" || v === undefined ? 0 : Number(v);
      else if (typeof v === "string") {
        v = v.trim();
        if (v === "" && !f.required) v = null;
      } else if (v === undefined) v = null;
      out[f.name] = v;
    }
    return out;
  }

  async function handleSubmit(values: FormValues, bulkFiles: File[]) {
    setSaving(true);
    try {
      if (editing === "new" && config.bulkUpload && bulkFiles.length > 0) {
        // Gallery: satu baris per file
        const base = clean({ ...values, url: "x", media_type: "image" });
        const title = String(base.title ?? "").trim();
        const payload: Record<string, unknown>[] = [];
        for (let i = 0; i < bulkFiles.length; i++) {
          const file = bulkFiles[i];
          const url = await uploadFile(supabase, file, "gallery");
          payload.push({
            ...base,
            title: bulkFiles.length > 1 ? `${title} ${i + 1}` : title,
            url,
            media_type: file.type.startsWith("video/") ? "video" : "image",
          });
        }
        const { error } = await supabase.from(config.key).insert(payload);
        if (error) {
          await removeStoredFiles(supabase, payload.map((p) => p.url as string));
          throw error;
        }
        notify("ok", `${payload.length} file berhasil ditambahkan.`);
      } else {
        const payload = clean(values);
        if (config.key === "gallery" && typeof payload.url === "string") {
          payload.media_type = inferMediaType(payload.url) === "video" || isVideoUrl(payload.url) ? "video" : payload.media_type;
        }
        if (editing === "new") {
          const { error } = await supabase.from(config.key).insert(payload);
          if (error) throw error;
          notify("ok", `${capitalize(config.singular)} berhasil ditambahkan.`);
        } else if (editing) {
          const { error } = await supabase.from(config.key).update(payload).eq("id", editing.id);
          if (error) throw error;
          // Bersihkan file lama yang sudah diganti/dihapus
          const stale = config.fields
            .filter((f) => FILE_FIELD_TYPES.includes(f.type))
            .map((f) => (editing[f.name] && editing[f.name] !== payload[f.name] ? String(editing[f.name]) : null));
          await removeStoredFiles(supabase, stale);
          notify("ok", `${capitalize(config.singular)} berhasil diperbarui.`);
        }
      }
      setEditing(null);
      await load();
    } catch (e) {
      notify("err", messageOf(e));
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setDeletingBusy(true);
    try {
      const { error } = await supabase.from(config.key).delete().eq("id", deleting.id);
      if (error) throw error;
      await removeStoredFiles(
        supabase,
        config.fields.filter((f) => FILE_FIELD_TYPES.includes(f.type)).map((f) => String(deleting[f.name] ?? "")),
      );
      notify("ok", `${capitalize(config.singular)} berhasil dihapus.`);
      setDeleting(null);
      await load();
    } catch (e) {
      notify("err", messageOf(e));
    } finally {
      setDeletingBusy(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold">Kelola {config.label}</h1>
          <p className="mt-1 text-sm text-slate-500">{config.description}</p>
        </div>
        <button type="button" onClick={() => setEditing("new")} className="btn btn-primary shrink-0">
          <Plus className="h-4 w-4" /> Tambah {config.singular}
        </button>
      </div>

      <div className="relative mt-8 max-w-sm">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Cari ${config.singular}…`}
          aria-label={`Cari ${config.singular}`}
          className="input pl-11"
        />
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="grid place-items-center rounded-3xl border border-slate-200 bg-white py-20 text-slate-500" role="status">
            <Loader2 className="h-6 w-6 animate-spin text-brand" />
            <p className="mt-3 text-sm">Memuat data…</p>
          </div>
        ) : loadError ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            <p className="font-semibold">Gagal memuat data</p>
            <p className="mt-1">{loadError}</p>
            <button onClick={load} className="btn btn-outline btn-sm mt-4">Coba lagi</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-500">
            {rows.length === 0 ? `Belum ada data ${config.singular}. Klik "Tambah ${config.singular}" untuk memulai.` : "Tidak ada hasil pencarian."}
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 overflow-hidden rounded-3xl border border-slate-200 bg-white">
            {filtered.map((row) => {
              const thumb = config.thumbField ? String(row[config.thumbField] ?? "") : "";
              const isVid = thumb && (row.media_type === "video" || isVideoUrl(thumb));
              const meta = config.metaFields.map((m) => display(m, row)).filter(Boolean).join(" · ");
              return (
                <li key={row.id} className="flex items-center gap-4 p-4">
                  {config.thumbField && (
                    <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-ice text-brand/50 sm:h-16 sm:w-16">
                      {thumb && !isVid ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={thumb} alt="" className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        <Film className="h-5 w-5" />
                      )}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{String(row[config.titleField] ?? "")}</p>
                    {meta && <p className="mt-0.5 truncate text-xs text-slate-500">{meta}</p>}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => setEditing(row)}
                      aria-label={`Edit ${String(row[config.titleField] ?? "")}`}
                      className="grid h-9 w-9 place-items-center rounded-full text-slate-600 transition hover:bg-ice hover:text-brand"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(row)}
                      aria-label={`Hapus ${String(row[config.titleField] ?? "")}`}
                      className="grid h-9 w-9 place-items-center rounded-full text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {editing && (
        <Modal
          wide
          title={editing === "new" ? `Tambah ${config.singular}` : `Edit ${config.singular}`}
          onClose={() => !saving && setEditing(null)}
        >
          <ResourceForm
            key={editing === "new" ? "new" : editing.id}
            config={config}
            initial={initialValues(editing)}
            relations={relations}
            isNew={editing === "new"}
            saving={saving}
            onCancel={() => setEditing(null)}
            onSubmit={handleSubmit}
          />
        </Modal>
      )}

      {deleting && (
        <Modal title="Hapus data?" onClose={() => !deletingBusy && setDeleting(null)}>
          <div className="flex gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-red-50 text-red-600">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <p className="text-sm leading-relaxed text-slate-600">
              <span className="font-semibold text-navy">{String(deleting[config.titleField] ?? "")}</span> akan dihapus
              permanen beserta file yang terunggah. Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button className="btn btn-outline" onClick={() => setDeleting(null)} disabled={deletingBusy}>
              Batal
            </button>
            <button
              className="btn bg-red-600 text-white hover:bg-red-700"
              onClick={confirmDelete}
              disabled={deletingBusy}
            >
              {deletingBusy && <Loader2 className="h-4 w-4 animate-spin" />} Hapus
            </button>
          </div>
        </Modal>
      )}

      {toast && (
        <div
          role="status"
          className={`fixed bottom-5 right-5 z-[120] flex max-w-sm items-start gap-3 rounded-2xl px-5 py-4 text-sm font-medium text-white shadow-soft ${
            toast.type === "ok" ? "bg-navy" : "bg-red-600"
          }`}
        >
          {toast.type === "ok" ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" /> : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />}
          <span>{toast.text}</span>
          <button onClick={() => setToast(null)} aria-label="Tutup" className="ml-1 opacity-70 hover:opacity-100">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function messageOf(e: unknown): string {
  if (e && typeof e === "object" && "message" in e) {
    const msg = String((e as { message: unknown }).message);
    if (/row-level security|permission denied/i.test(msg)) {
      return "Akses ditolak: akun ini belum terdaftar sebagai admin (lihat README langkah 4).";
    }
    return msg;
  }
  return "Terjadi kesalahan. Coba lagi.";
}
