"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { VideoPlayer } from "./Media";
import type { GalleryItem } from "@/types";

export function Lightbox({
  items,
  index,
  onClose,
  onIndex,
}: {
  items: GalleryItem[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const item = index !== null ? items[index] : null;
  const count = items.length;

  useEffect(() => {
    if (index === null) return;
    const current: number = index;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex((current + 1) % count);
      if (e.key === "ArrowLeft") onIndex((current - 1 + count) % count);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [index, count, onClose, onIndex]);

  return (
    <AnimatePresence>
      {item && index !== null && (
        <motion.div
          key="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col bg-navy/95 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
          onClick={onClose}
        >
          <div className="flex items-center justify-between p-4 text-white sm:p-6" onClick={(e) => e.stopPropagation()}>
            <p className="font-mono text-xs tracking-widest text-white/60">
              {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup"
              className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:bg-brand"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20">
            {items.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Sebelumnya"
                  onClick={(e) => {
                    e.stopPropagation();
                    onIndex((index - 1 + items.length) % items.length);
                  }}
                  className="absolute left-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-brand sm:left-6"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Berikutnya"
                  onClick={(e) => {
                    e.stopPropagation();
                    onIndex((index + 1) % items.length);
                  }}
                  className="absolute right-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-brand sm:right-6"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="flex max-h-full w-full max-w-5xl items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {item.media_type === "video" ? (
                <VideoPlayer url={item.url} className="max-h-[70vh] rounded-2xl" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt={item.title} className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain" />
              )}
            </motion.div>
          </div>

          <div className="p-5 text-center text-white sm:p-8" onClick={(e) => e.stopPropagation()}>
            <p className="font-display text-lg font-bold">{item.title}</p>
            {item.activity && <p className="mt-1 text-sm text-white/60">{item.activity.title}</p>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
