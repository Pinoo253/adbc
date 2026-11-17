import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { BUCKET } from "./constants";
import type { MediaType } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: string | null | undefined,
  opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" },
) {
  if (!date) return "";
  const d = new Date(date.length <= 10 ? `${date}T00:00:00` : date);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("id-ID", opts).format(d);
}

export function splitLines(text: string | null | undefined): string[] {
  return (text ?? "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

export function getYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  return m ? m[1] : null;
}

export function isVideoUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return !!getYouTubeId(url) || /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url);
}

export function inferMediaType(url: string): MediaType {
  return isVideoUrl(url) ? "video" : "image";
}

export function normalizeUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

/** Ambil path objek storage dari URL publik bucket kita (null bila URL eksternal). */
export function storagePathFromUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const i = url.indexOf(marker);
  if (i === -1) return null;
  return decodeURIComponent(url.slice(i + marker.length).split("?")[0]);
}
