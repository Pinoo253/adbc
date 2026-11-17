"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Palette, Search, X } from "lucide-react";
import { ProjectCard } from "./cards";
import { Cover, EmptyState, VideoPlayer } from "./Media";
import { cn, formatDate, normalizeUrl } from "@/lib/utils";
import type { Category, Project } from "@/types";

export function ProjectsExplorer({ projects, categories }: { projects: Project[]; categories: Category[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [open, setOpen] = useState<Project | null>(null);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return projects.filter((p) => {
      if (cat !== "all" && p.category_id !== cat) return false;
      if (!term) return true;
      return [p.title, p.creator, p.description, p.category?.name]
        .filter(Boolean)
        .some((s) => s!.toLowerCase().includes(term));
    });
  }, [projects, q, cat]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const link = normalizeUrl(open?.link_url);

  return (
    <div>
      <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari judul, pembuat, atau kata kunci…"
            aria-label="Cari proyek"
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

      {filtered.length === 0 ? (
        <EmptyState
          icon={Palette}
          title="Proyek tidak ditemukan"
          description={projects.length === 0 ? "Belum ada karya yang dipublikasikan." : "Coba kata kunci atau kategori lain."}
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} onOpen={setOpen} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-navy/80 p-4 backdrop-blur-sm"
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
            aria-label={open.title}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative my-8 w-full max-w-3xl overflow-hidden rounded-3xl bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setOpen(null)}
                aria-label="Tutup"
                className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow-soft transition hover:bg-brand hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
              {open.video_url ? (
                <VideoPlayer url={open.video_url} />
              ) : (
                <Cover src={open.image_url} alt={open.title} className="max-h-[60vh] min-h-[220px] w-full" />
              )}
              <div className="p-6 sm:p-8">
                {open.category && <span className="badge">{open.category.name}</span>}
                <h3 className="mt-3 font-display text-2xl font-extrabold sm:text-3xl">{open.title}</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Oleh <span className="font-semibold text-navy">{open.creator}</span> · {formatDate(open.published_at)}
                </p>
                {open.description && (
                  <p className="mt-5 whitespace-pre-line leading-relaxed text-slate-600">{open.description}</p>
                )}
                {link && (
                  <a href={link} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-6">
                    Kunjungi karya <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
