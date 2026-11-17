import Link from "next/link";
import { ArrowUpRight, CalendarDays, Images, Palette, Plus, Trophy, Users } from "lucide-react";
import { getActivities, getGallery, getProjects, getStats } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [stats, activities, projects, gallery] = await Promise.all([
    getStats(),
    getActivities(5),
    getProjects({ limit: 5 }),
    getGallery({ limit: 6 }),
  ]);

  const cards = [
    { label: "Total Kegiatan", value: stats.activities, href: "/admin/activities", Icon: CalendarDays },
    { label: "Total Proyek", value: stats.projects, href: "/admin/projects", Icon: Palette },
    { label: "Total Dokumentasi", value: stats.gallery, href: "/admin/gallery", Icon: Images },
    { label: "Total Prestasi", value: stats.achievements, href: "/admin/achievements", Icon: Trophy },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">Ringkasan konten ADB CREATIVE TEAM. Perubahan langsung tampil di website publik.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {cards.map(({ label, value, href, Icon }) => (
          <Link
            key={label}
            href={href}
            className="group rounded-3xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-soft sm:p-6"
          >
            <div className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-ice text-brand transition group-hover:bg-brand group-hover:text-white">
                <Icon className="h-5 w-5" />
              </span>
              <ArrowUpRight className="h-4 w-4 text-slate-300 transition group-hover:text-brand" />
            </div>
            <p className="mt-5 font-display text-4xl font-extrabold">{value}</p>
            <p className="mt-1 text-xs font-medium text-slate-500">{label}</p>
          </Link>
        ))}
      </div>

      <Link
        href="/admin/team_members"
        className="mt-4 flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-6 py-4 transition hover:border-brand/40"
      >
        <span className="flex items-center gap-3 text-sm font-medium">
          <Users className="h-4 w-4 text-brand" /> Anggota tim terdaftar
        </span>
        <span className="font-display text-xl font-extrabold">{stats.members}</span>
      </Link>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Kegiatan terbaru</h2>
            <Link href="/admin/activities" className="inline-flex items-center gap-1 text-sm font-semibold text-brand">
              <Plus className="h-4 w-4" /> Tambah
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-slate-100">
            {activities.length === 0 && <li className="py-6 text-sm text-slate-500">Belum ada kegiatan.</li>}
            {activities.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                <span className="truncate font-medium">{a.title}</span>
                <span className="shrink-0 text-xs text-slate-500">{formatDate(a.date, { day: "numeric", month: "short", year: "numeric" })}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Proyek terbaru</h2>
            <Link href="/admin/projects" className="inline-flex items-center gap-1 text-sm font-semibold text-brand">
              <Plus className="h-4 w-4" /> Tambah
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-slate-100">
            {projects.length === 0 && <li className="py-6 text-sm text-slate-500">Belum ada proyek.</li>}
            {projects.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                <span className="truncate font-medium">{p.title}</span>
                <span className="shrink-0 text-xs text-slate-500">{p.creator}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Dokumentasi terbaru</h2>
          <Link href="/admin/gallery" className="inline-flex items-center gap-1 text-sm font-semibold text-brand">
            <Plus className="h-4 w-4" /> Unggah
          </Link>
        </div>
        {gallery.length === 0 ? (
          <p className="py-6 text-sm text-slate-500">Belum ada foto atau video.</p>
        ) : (
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {gallery.map((g) => (
              <div key={g.id} className="aspect-square overflow-hidden rounded-xl bg-ice">
                {g.media_type === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={g.url} alt={g.title} className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <div className="grid h-full place-items-center text-xs font-semibold text-brand">VIDEO</div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
