import Link from "next/link";
import { ArrowUpRight, CalendarDays, Camera, Instagram, MapPin, Trophy } from "lucide-react";
import { Cover } from "./Media";
import { cn, formatDate, normalizeUrl } from "@/lib/utils";
import type { Achievement, Activity, Project, TeamMember } from "@/types";

export function ActivityCard({ activity, large = false }: { activity: Activity; large?: boolean }) {
  return (
    <Link
      href={`/activities/${activity.id}`}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition duration-500 hover:-translate-y-1 hover:border-brand/40 hover:shadow-soft",
      )}
    >
      <div className={cn("relative overflow-hidden", large ? "aspect-[16/11] sm:aspect-[16/10]" : "aspect-[4/3]")}>
        <Cover
          src={activity.cover_url}
          alt={activity.title}
          icon={Camera}
          className="h-full w-full transition duration-700 group-hover:scale-105"
        />
        {activity.category && (
          <span className="badge absolute left-4 top-4 bg-white/95 backdrop-blur">{activity.category.name}</span>
        )}
        <span className="absolute bottom-4 right-4 grid h-10 w-10 translate-y-2 place-items-center rounded-full bg-brand text-white opacity-0 shadow-glow transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-brand" />
            {formatDate(activity.date)}
          </span>
          {activity.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-brand" />
              {activity.location}
            </span>
          )}
        </div>
        <h3 className={cn("mt-3 font-display font-bold leading-snug", large ? "text-2xl sm:text-3xl" : "text-lg")}>
          {activity.title}
        </h3>
        {activity.description && (
          <p className={cn("mt-2 text-sm leading-relaxed text-slate-600", large ? "line-clamp-3" : "line-clamp-2")}>
            {activity.description}
          </p>
        )}
      </div>
    </Link>
  );
}

export function ProjectCard({
  project,
  onOpen,
  href,
  dark = false,
}: {
  project: Project;
  onOpen?: (p: Project) => void;
  href?: string;
  dark?: boolean;
}) {
  const inner = (
    <>
      <div className="relative aspect-[4/5] overflow-hidden">
        <Cover
          src={project.image_url}
          alt={project.title}
          className="h-full w-full transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/5 to-transparent" />
        {project.category && (
          <span className="badge absolute left-4 top-4 bg-white/95 backdrop-blur">{project.category.name}</span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <h3 className="font-display text-lg font-bold leading-snug">{project.title}</h3>
          <p className="mt-1 text-xs text-white/75">
            {project.creator} · {formatDate(project.published_at, { month: "short", year: "numeric" })}
          </p>
        </div>
      </div>
    </>
  );
  const cls = cn(
    "group relative block w-full overflow-hidden rounded-3xl text-left transition duration-500 hover:-translate-y-1",
    dark ? "ring-1 ring-white/10 hover:ring-brand" : "border border-slate-200 hover:border-brand/40 hover:shadow-soft",
  );
  if (href) {
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" onClick={() => onOpen?.(project)} className={cls}>
      {inner}
    </button>
  );
}

export function AchievementRow({ item }: { item: Achievement }) {
  const cert = item.certificate_url;
  return (
    <article className="group grid gap-6 border-t border-slate-200 py-8 transition-colors hover:bg-ice/40 md:grid-cols-12 md:px-4">
      <div className="md:col-span-3">
        <p className="font-mono text-xs uppercase tracking-widest text-slate-500">{formatDate(item.date)}</p>
        <span className="badge mt-3">{item.level}</span>
      </div>
      <div className="md:col-span-6">
        <h3 className="flex items-start gap-3 font-display text-xl font-bold leading-snug sm:text-2xl">
          <Trophy className="mt-1 h-5 w-5 shrink-0 text-brand" />
          {item.title}
        </h3>
        <p className="mt-1 text-sm font-semibold text-brand">{item.competition}</p>
        {item.description && <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.description}</p>}
        {cert && (
          <a
            href={cert}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy underline-offset-4 hover:text-brand hover:underline"
          >
            Lihat sertifikat <ArrowUpRight className="h-4 w-4" />
          </a>
        )}
      </div>
      <div className="md:col-span-3">
        {item.image_url && (
          <div className="overflow-hidden rounded-2xl">
            <Cover
              src={item.image_url}
              alt={`Dokumentasi ${item.title}`}
              className="aspect-[4/3] w-full transition duration-700 group-hover:scale-105"
            />
          </div>
        )}
      </div>
    </article>
  );
}

export function TeamCard({ member }: { member: TeamMember }) {
  const ig = member.instagram
    ? member.instagram.startsWith("@")
      ? `https://instagram.com/${member.instagram.slice(1)}`
      : normalizeUrl(member.instagram)
    : null;
  return (
    <div className="group">
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-ice">
        <Cover
          src={member.photo_url}
          alt={member.name}
          className="h-full w-full transition duration-700 group-hover:scale-105"
        />
        {ig && (
          <a
            href={ig}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Instagram ${member.name}`}
            className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white text-brand opacity-0 shadow-soft transition group-hover:opacity-100 focus-visible:opacity-100"
          >
            <Instagram className="h-4 w-4" />
          </a>
        )}
      </div>
      <h3 className="mt-4 font-display text-base font-bold">{member.name}</h3>
      <p className="text-sm text-brand">{member.role}</p>
      {member.bio && <p className="mt-1 line-clamp-2 text-xs text-slate-500">{member.bio}</p>}
    </div>
  );
}
