import type { Profile } from "@/types";

export const BUCKET = "media";
export const MAX_UPLOAD_MB = 50;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/activities", label: "Activities" },
  { href: "/projects", label: "Projects" },
  { href: "/gallery", label: "Gallery" },
  { href: "/achievements", label: "Achievements" },
  { href: "/contact", label: "Contact" },
] as const;

export const ACHIEVEMENT_LEVELS = [
  "Sekolah",
  "Kecamatan",
  "Kabupaten/Kota",
  "Provinsi",
  "Nasional",
  "Internasional",
] as const;

export const DEFAULT_DISCIPLINES = [
  "Desain Grafis",
  "Fotografi",
  "Videografi",
  "Editing Video",
  "Konten Digital",
];

/** Dipakai bila baris profil di database masih kosong. Edit dari dashboard admin. */
export const DEFAULT_PROFILE: Profile = {
  id: 1,
  name: "ADB CREATIVE TEAM",
  tagline: "Creative Community & Digital Documentation",
  description:
    "ADB CREATIVE TEAM adalah komunitas ekstrakurikuler yang mendokumentasikan kegiatan, merayakan karya, dan menumbuhkan kreativitas anggotanya.",
  history:
    "Sejarah singkat ekskul belum diisi. Admin dapat mengubahnya dari dashboard (menu Profil Ekskul).",
  vision: "Visi ekskul belum diisi.",
  mission: "Misi ekskul belum diisi.",
  goals: "Tujuan ekskul belum diisi.",
  email: null,
  phone: null,
  address: null,
  instagram: null,
  youtube: null,
  tiktok: null,
  hero_image_url: null,
};
