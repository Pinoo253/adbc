"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Camera, Clapperboard, PenTool } from "lucide-react";
import type { SiteStats } from "@/types";

const ease = [0.22, 1, 0.36, 1] as const;

const LINES = [
  { text: "WE CREATE,", cls: "text-navy" },
  { text: "WE CAPTURE,", cls: "text-navy" },
  { text: "WE INSPIRE.", cls: "text-brand" },
];

const FALLBACK_ICONS = [Camera, Clapperboard, PenTool, Camera];

export function Hero({
  description,
  images,
  stats,
}: {
  description: string;
  images: string[]; // maksimal 4 URL
  stats: SiteStats;
}) {
  const tiles = [
    "col-span-3 row-span-3",
    "col-span-2 row-span-2",
    "col-span-2 row-span-3",
    "col-span-3 row-span-2",
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="bg-grid absolute inset-0" aria-hidden />
      <div className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-brand/10 blur-3xl" aria-hidden />

      <div className="container-x relative grid items-center gap-12 pb-16 pt-12 sm:pt-16 lg:grid-cols-12 lg:gap-8 lg:pb-24 lg:pt-20">
        <div className="lg:col-span-7">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="eyebrow inline-flex items-center gap-2 rounded-full border border-brand/20 bg-white px-3.5 py-1.5"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
            Creative Community &amp; Digital Documentation
          </motion.p>

          <h1 className="mt-7 font-display text-[clamp(2.6rem,8.4vw,6.2rem)] font-extrabold leading-[0.95] tracking-[-0.04em]">
            {LINES.map((l, i) => (
              <span key={l.text} className="block overflow-hidden pb-1">
                <motion.span
                  className={`block ${l.cls}`}
                  initial={{ y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.85, delay: 0.1 + i * 0.12, ease }}
                >
                  {l.text}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease }}
            className="mt-8 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg"
          >
            {description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <Link href="/activities" className="btn btn-primary">
              Explore Activities <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/about#team" className="btn btn-outline">
              Discover Our Team
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.25, ease }}
          className="lg:col-span-5"
        >
          <div className="grid h-[380px] grid-cols-5 grid-rows-5 gap-3 sm:h-[480px] lg:h-[540px]">
            {tiles.map((cls, i) => {
              const src = images[i];
              const Icon = FALLBACK_ICONS[i];
              return (
                <div
                  key={i}
                  className={`${cls} relative overflow-hidden rounded-3xl ${
                    i === 0 ? "bg-brand" : i === 2 ? "bg-navy" : "bg-ice"
                  }`}
                >
                  {src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={src} alt="" className="h-full w-full object-cover" loading={i === 0 ? "eager" : "lazy"} />
                  ) : (
                    <div
                      className={`grid h-full w-full place-items-center ${
                        i === 0 || i === 2 ? "text-white/30" : "text-brand/30"
                      }`}
                    >
                      <Icon className="h-12 w-12" strokeWidth={1.3} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <div className="container-x relative pb-4">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 sm:grid-cols-4">
          {[
            ["Kegiatan", stats.activities],
            ["Proyek", stats.projects],
            ["Dokumentasi", stats.gallery],
            ["Prestasi", stats.achievements],
          ].map(([label, n]) => (
            <div key={label as string} className="bg-white px-6 py-6">
              <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">{label}</dt>
              <dd className="mt-1 font-display text-4xl font-extrabold text-navy">{n}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
