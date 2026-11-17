import { ImageIcon, Play } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn, getYouTubeId } from "@/lib/utils";

/** Gambar penutup dengan placeholder bila belum ada foto. */
export function Cover({
  src,
  alt,
  className,
  icon: Icon = ImageIcon,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  icon?: LucideIcon;
}) {
  if (!src) {
    return (
      <div
        className={cn(
          "grid place-items-center bg-gradient-to-br from-ice via-blue-100 to-blue-200 text-brand/40",
          className,
        )}
        role="img"
        aria-label={alt}
      >
        <Icon className="h-10 w-10" />
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" decoding="async" className={cn("object-cover", className)} />;
}

/** Pemutar video: YouTube (embed) atau file langsung dari Supabase Storage. */
export function VideoPlayer({ url, className }: { url: string; className?: string }) {
  const yt = getYouTubeId(url);
  if (yt) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${yt}`}
        title="Video"
        loading="lazy"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        className={cn("aspect-video w-full border-0 bg-navy", className)}
      />
    );
  }
  return <video src={url} controls preload="metadata" playsInline className={cn("aspect-video w-full bg-navy", className)} />;
}

/** Thumbnail untuk grid: foto, atau video (poster YouTube / frame pertama). */
export function MediaThumb({
  url,
  type,
  alt,
  className,
}: {
  url: string;
  type: "image" | "video";
  alt: string;
  className?: string;
}) {
  if (type === "image") {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt={alt} loading="lazy" decoding="async" className={cn("h-auto w-full", className)} />;
  }
  const yt = getYouTubeId(url);
  return (
    <div className={cn("relative aspect-video w-full overflow-hidden bg-navy", className)}>
      {yt ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`https://img.youtube.com/vi/${yt}/hqdefault.jpg`} alt={alt} loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <video src={`${url}#t=0.1`} preload="metadata" muted playsInline className="h-full w-full object-cover" />
      )}
      <span className="absolute inset-0 grid place-items-center bg-navy/20">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-white/90 text-brand shadow-soft">
          <Play className="ml-0.5 h-6 w-6 fill-current" />
        </span>
      </span>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  icon: Icon = ImageIcon,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="grid place-items-center rounded-3xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-20 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-ice text-brand">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-5 font-display text-xl font-bold">{title}</h3>
      {description && <p className="mt-2 max-w-md text-sm text-slate-500">{description}</p>}
    </div>
  );
}
