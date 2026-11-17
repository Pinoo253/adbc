"use client";

import { useMemo, useState } from "react";
import { Trophy } from "lucide-react";
import { AchievementRow } from "./cards";
import { EmptyState } from "./Media";
import { ACHIEVEMENT_LEVELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Achievement } from "@/types";

export function AchievementsList({ items }: { items: Achievement[] }) {
  const [level, setLevel] = useState("all");

  const levels = useMemo(() => {
    const present = new Set(items.map((i) => i.level));
    const known = ACHIEVEMENT_LEVELS.filter((l) => present.has(l));
    const extra = Array.from(present).filter((l) => !(ACHIEVEMENT_LEVELS as readonly string[]).includes(l));
    return [...known, ...extra];
  }, [items]);

  const filtered = items.filter((i) => level === "all" || i.level === level);

  return (
    <div>
      {levels.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter tingkat">
          <button type="button" onClick={() => setLevel("all")} className={cn("chip", level === "all" && "chip-active")}>
            Semua tingkat
          </button>
          {levels.map((l) => (
            <button key={l} type="button" onClick={() => setLevel(l)} className={cn("chip", level === l && "chip-active")}>
              {l}
            </button>
          ))}
        </div>
      )}
      {filtered.length === 0 ? (
        <EmptyState icon={Trophy} title="Belum ada prestasi" description="Prestasi akan tampil di sini setelah ditambahkan oleh admin." />
      ) : (
        <div className="border-b border-slate-200">
          {filtered.map((a) => (
            <AchievementRow key={a.id} item={a} />
          ))}
        </div>
      )}
    </div>
  );
}
