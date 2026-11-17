import { ACHIEVEMENT_LEVELS } from "./constants";

export type FieldType =
  | "text"
  | "textarea"
  | "date"
  | "number"
  | "select"
  | "relation"
  | "image"
  | "video"
  | "file"
  | "media"
  | "checkbox"
  | "url";

export type RelationSource = "activity-categories" | "project-categories" | "activities";

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  relation?: RelationSource;
  help?: string;
  placeholder?: string;
  folder?: string;
  /** Field select yang otomatis diisi (image/video) saat file diunggah/URL ditempel. */
  mediaTypeField?: string;
}

export type ResourceKey =
  | "activities"
  | "projects"
  | "gallery"
  | "achievements"
  | "team_members"
  | "categories";

export interface ResourceConfig {
  key: ResourceKey;
  label: string;
  singular: string;
  description: string;
  icon: "CalendarDays" | "Palette" | "Images" | "Trophy" | "Users" | "Tags";
  orderBy: { column: string; ascending: boolean };
  titleField: string;
  metaFields: string[];
  thumbField?: string;
  searchFields: string[];
  fields: Field[];
  defaults?: Record<string, unknown>;
  /** Upload banyak file sekaligus saat menambah data (satu baris per file). */
  bulkUpload?: boolean;
}

const mediaTypeOptions = [
  { value: "image", label: "Foto" },
  { value: "video", label: "Video" },
];

export const RESOURCES: Record<ResourceKey, ResourceConfig> = {
  activities: {
    key: "activities",
    label: "Kegiatan",
    singular: "kegiatan",
    description: "Dokumentasi event, workshop, dan aktivitas ekskul.",
    icon: "CalendarDays",
    orderBy: { column: "date", ascending: false },
    titleField: "title",
    metaFields: ["date", "location", "category_id"],
    thumbField: "cover_url",
    searchFields: ["title", "location", "description"],
    fields: [
      { name: "title", label: "Judul kegiatan", type: "text", required: true },
      { name: "date", label: "Tanggal", type: "date", required: true },
      { name: "location", label: "Lokasi", type: "text" },
      { name: "category_id", label: "Kategori", type: "relation", relation: "activity-categories" },
      { name: "description", label: "Deskripsi", type: "textarea" },
      { name: "cover_url", label: "Foto sampul kegiatan", type: "image", folder: "activities" },
      {
        name: "video_url",
        label: "Video kegiatan",
        type: "video",
        folder: "activities",
        help: "Unggah file (maks. 50 MB) atau tempel link YouTube.",
      },
    ],
    defaults: { date: new Date().toISOString().slice(0, 10) },
  },
  projects: {
    key: "projects",
    label: "Proyek",
    singular: "proyek",
    description: "Karya anggota: desain, foto, video, dan konten digital.",
    icon: "Palette",
    orderBy: { column: "published_at", ascending: false },
    titleField: "title",
    metaFields: ["creator", "published_at", "category_id"],
    thumbField: "image_url",
    searchFields: ["title", "creator", "description"],
    fields: [
      { name: "title", label: "Judul proyek", type: "text", required: true },
      { name: "creator", label: "Pembuat", type: "text", required: true },
      { name: "published_at", label: "Tanggal publikasi", type: "date", required: true },
      { name: "category_id", label: "Kategori", type: "relation", relation: "project-categories" },
      { name: "description", label: "Deskripsi", type: "textarea" },
      { name: "image_url", label: "Gambar proyek", type: "image", folder: "projects" },
      { name: "video_url", label: "Video (opsional)", type: "video", folder: "projects" },
      { name: "link_url", label: "Tautan karya (opsional)", type: "url", placeholder: "https://…" },
      { name: "is_featured", label: "Tampilkan sebagai Featured Project di beranda", type: "checkbox" },
    ],
    defaults: { published_at: new Date().toISOString().slice(0, 10), is_featured: false },
  },
  gallery: {
    key: "gallery",
    label: "Galeri",
    singular: "dokumentasi",
    description: "Foto dan video dokumentasi. Bisa unggah banyak file sekaligus.",
    icon: "Images",
    orderBy: { column: "created_at", ascending: false },
    titleField: "title",
    metaFields: ["media_type", "activity_id"],
    thumbField: "url",
    searchFields: ["title"],
    bulkUpload: true,
    fields: [
      { name: "title", label: "Judul / keterangan", type: "text", required: true },
      { name: "activity_id", label: "Kegiatan terkait", type: "relation", relation: "activities" },
      { name: "url", label: "Foto / video", type: "media", required: true, folder: "gallery", mediaTypeField: "media_type" },
      { name: "media_type", label: "Jenis media", type: "select", options: mediaTypeOptions, required: true },
    ],
    defaults: { media_type: "image" },
  },
  achievements: {
    key: "achievements",
    label: "Prestasi",
    singular: "prestasi",
    description: "Penghargaan dan juara kompetisi.",
    icon: "Trophy",
    orderBy: { column: "date", ascending: false },
    titleField: "title",
    metaFields: ["competition", "level", "date"],
    thumbField: "image_url",
    searchFields: ["title", "competition", "description"],
    fields: [
      { name: "title", label: "Nama penghargaan", type: "text", required: true, placeholder: "Juara 1 …" },
      { name: "competition", label: "Nama kompetisi", type: "text", required: true },
      {
        name: "level",
        label: "Tingkat kompetisi",
        type: "select",
        required: true,
        options: ACHIEVEMENT_LEVELS.map((l) => ({ value: l, label: l })),
      },
      { name: "date", label: "Tanggal", type: "date", required: true },
      { name: "description", label: "Deskripsi pencapaian", type: "textarea" },
      { name: "image_url", label: "Foto dokumentasi", type: "image", folder: "achievements" },
      { name: "certificate_url", label: "Sertifikat (gambar / PDF)", type: "file", folder: "certificates" },
    ],
    defaults: { date: new Date().toISOString().slice(0, 10), level: "Sekolah" },
  },
  team_members: {
    key: "team_members",
    label: "Anggota",
    singular: "anggota",
    description: "Struktur kepengurusan dan anggota tim.",
    icon: "Users",
    orderBy: { column: "sort_order", ascending: true },
    titleField: "name",
    metaFields: ["role", "division"],
    thumbField: "photo_url",
    searchFields: ["name", "role", "division"],
    fields: [
      { name: "name", label: "Nama", type: "text", required: true },
      { name: "role", label: "Jabatan", type: "text", required: true, placeholder: "Ketua, Sekretaris, Anggota…" },
      { name: "division", label: "Divisi", type: "text", placeholder: "Inti, Fotografi, Videografi, Desain…", help: "Anggota dengan divisi yang sama dikelompokkan di halaman About." },
      { name: "bio", label: "Bio singkat", type: "textarea" },
      { name: "photo_url", label: "Foto", type: "image", folder: "team" },
      { name: "instagram", label: "Instagram", type: "text", placeholder: "@username" },
      { name: "sort_order", label: "Urutan tampil", type: "number", help: "Angka kecil tampil lebih dulu." },
      { name: "is_active", label: "Aktif (tampil di website)", type: "checkbox" },
    ],
    defaults: { sort_order: 0, is_active: true },
  },
  categories: {
    key: "categories",
    label: "Kategori",
    singular: "kategori",
    description: "Kategori untuk kegiatan dan proyek (dipakai sebagai filter).",
    icon: "Tags",
    orderBy: { column: "name", ascending: true },
    titleField: "name",
    metaFields: ["type"],
    searchFields: ["name"],
    fields: [
      { name: "name", label: "Nama kategori", type: "text", required: true },
      {
        name: "type",
        label: "Dipakai untuk",
        type: "select",
        required: true,
        options: [
          { value: "activity", label: "Kegiatan" },
          { value: "project", label: "Proyek" },
        ],
      },
    ],
    defaults: { type: "activity" },
  },
};

export const RESOURCE_KEYS = Object.keys(RESOURCES) as ResourceKey[];

export function isResourceKey(k: string): k is ResourceKey {
  return k in RESOURCES;
}

export const FILE_FIELD_TYPES: FieldType[] = ["image", "video", "file", "media"];
