import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Camera, MapPin } from "lucide-react";
import { Cover, VideoPlayer } from "@/components/Media";
import { GalleryExplorer } from "@/components/GalleryExplorer";
import { getActivity, getGallery } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const a = await getActivity(params.id);
  return { title: a?.title ?? "Kegiatan" };
}

export default async function ActivityDetailPage({ params }: { params: { id: string } }) {
  const activity = await getActivity(params.id);
  if (!activity) notFound();
  const media = await getGallery({ activityId: activity.id });

  return (
    <article className="container-x py-10 sm:py-16">
      <Link href="/activities" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand">
        <ArrowLeft className="h-4 w-4" /> Semua kegiatan
      </Link>

      <header className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          {activity.category && <span className="badge">{activity.category.name}</span>}
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.02] sm:text-6xl">{activity.title}</h1>
        </div>
        <dl className="space-y-2 text-sm text-slate-600 lg:col-span-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-brand" />
            <dd>{formatDate(activity.date)}</dd>
          </div>
          {activity.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand" />
              <dd>{activity.location}</dd>
            </div>
          )}
        </dl>
      </header>

      <div className="mt-10 overflow-hidden rounded-3xl">
        <Cover src={activity.cover_url} alt={activity.title} icon={Camera} className="aspect-[16/8] w-full" />
      </div>

      {activity.description && (
        <p className="mt-10 max-w-3xl whitespace-pre-line text-lg leading-relaxed text-slate-700">
          {activity.description}
        </p>
      )}

      {activity.video_url && (
        <section className="mt-14">
          <p className="eyebrow">Video Kegiatan</p>
          <div className="mt-5 overflow-hidden rounded-3xl">
            <VideoPlayer url={activity.video_url} />
          </div>
        </section>
      )}

      {media.length > 0 && (
        <section className="mt-16">
          <p className="eyebrow">Foto &amp; Video</p>
          <div className="mt-5">
            <GalleryExplorer items={media} showFilters={false} />
          </div>
        </section>
      )}
    </article>
  );
}
