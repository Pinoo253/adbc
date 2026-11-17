"use client";

import { useCallback, useMemo, useState } from "react";
import { ImageIcon } from "lucide-react";
import { Lightbox } from "./Lightbox";
import { EmptyState, MediaThumb } from "./Media";
import { cn } from "@/lib/utils";
import type { GalleryItem } from "@/types";

type TypeFilter = "all" | "image" | "video";

export function GalleryExplorer({
  items,
  showFilters = true,
}: {
  items: GalleryItem[];
  showFilters?: boolean;
}) {
  const [activity, setActivity] = useState<string>("all");
  const [type, setType] = useState<TypeFilter>("all");
  const [index, setIndex] = useState<number | null>(null);

  const activities = useMemo(() => {
    const map = new Map<string, string>();
    items.forEach((i) => i.activity && map.set(i.activity.id, i.activity.title));
    return Array.from(map, ([id, title]) => ({ id, title }));
  }, [items]);

  const filtered = useMemo(
    () =>
      items.filter(
        (i) => (activity === "all" || i.activity_id === activity) && (type === "all" || i.media_type === type),
      ),
    [items, activity, type],
  );

  const close = useCallback(() => setIndex(null), []);

  return (
    <div>
      {showFilters && items.length > 0 && (
        <div className="mb-10 flex flex-col gap-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter jenis media">
            {(
              [
                ["all", "Semua"],
                ["image", "Foto"],
                ["video", "Video"],
              ] as const
            ).map(([v, label]) => (
              <button
                key={v}
                type="button"
                onClick={() => setType(v)}
                className={cn("chip", type === v && "chip-active")}
              >
                {label}
              </button>
            ))}
          </div>
          {activities.length > 0 && (
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter kegiatan">
              <button
                type="button"
                onClick={() => setActivity("all")}
                className={cn("chip", activity === "all" && "chip-active")}
              >
                Semua kegiatan
              </button>
              {activities.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setActivity(a.id)}
                  className={cn("chip", activity === a.id && "chip-active")}
                >
                  {a.title}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="Belum ada dokumentasi"
          description={
            items.length === 0
              ? "Foto dan video akan tampil di sini setelah diunggah oleh admin."
              : "Tidak ada media yang cocok dengan filter ini."
          }
        />
      ) : (
        <div className="columns-2 gap-3 sm:gap-4 lg:columns-3 xl:columns-4">
          {filtered.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setIndex(i)}
              className="group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl bg-ice text-left sm:mb-4"
              aria-label={`Buka ${item.title}`}
            >
              <MediaThumb
                url={item.url}
                type={item.media_type}
                alt={item.title}
                className="transition duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/80 to-transparent p-3 pt-10 text-xs font-medium text-white opacity-0 transition duration-300 group-hover:opacity-100">
                {item.title}
              </span>
            </button>
          ))}
        </div>
      )}

      <Lightbox items={filtered} index={index} onClose={close} onIndex={setIndex} />
    </div>
  );
}
