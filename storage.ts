import type { SupabaseClient } from "@supabase/supabase-js";
import { BUCKET, MAX_UPLOAD_MB } from "./constants";
import { storagePathFromUrl } from "./utils";

export async function uploadFile(supabase: SupabaseClient, file: File, folder: string): Promise<string> {
  if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
    throw new Error(`"${file.name}" melebihi batas ${MAX_UPLOAD_MB} MB. Kompres file atau gunakan link YouTube untuk video.`);
  }
  const ext = (file.name.split(".").pop() || "bin").toLowerCase();
  const base =
    file.name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "file";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${base}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw new Error(`Upload gagal: ${error.message}`);
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

/** Hapus file dari storage bila URL-nya milik bucket kita. Best-effort (tidak melempar error). */
export async function removeStoredFiles(supabase: SupabaseClient, urls: (string | null | undefined)[]) {
  const paths = urls.map(storagePathFromUrl).filter((p): p is string => !!p);
  if (paths.length === 0) return;
  await supabase.storage.from(BUCKET).remove(paths);
}
