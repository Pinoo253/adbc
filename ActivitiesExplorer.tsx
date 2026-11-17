"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Search } from "lucide-react";
import { ActivityCard } from "./cards";
import { EmptyState } from "./Media";
import { cn } from "@/lib/utils";
import type { Activity, Category } from "@/types";

export function ActivitiesExplorer({
  activities,
  categories,
}: {
  activities: Activity[];
  categories: Category[];
}) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return activities.filter((a) => {
      if (cat !== "all" && a.category_id !== cat) return false;
      if (!term) return true;
      return [a.title, a.location, a.description, a.category?.name]
        .filter(Boolean)
        .some((s) => s!.toLowerCase().includes(term));
    });
  }, [activities, q, cat]);

  return (
    <div>
      <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari kegiatan, lokasi, atau kata kunci…"
            aria-label="Cari kegiatan"
            className="input rounded-full pl-11"
          />
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter kategori">
          <button type="button" onClick={() => setCat("all")} className={cn("chip", cat === "all" && "chip-active")}>
            Semua
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCat(c.id)}
              className={cn("chip", cat === c.id && "chip-active")}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-6 font-mono text-xs uppercase tracking-widest text-slate-500">
        {filtered.length} kegiatan
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Kegiatan tidak ditemukan"
          description={
            activities.length === 0
              ? "Belum ada kegiatan yang dipublikasikan."
              : "Coba kata kunci lain atau pilih kategori berbeda."
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <ActivityCard key={a.id} activity={a} />
          ))}
        </div>
      )}
    </div>
  );
}
