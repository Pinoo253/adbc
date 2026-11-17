import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/Hero";
import { SectionHeading } from "@/components/SectionHeading";
import { ActivityCard, AchievementRow, ProjectCard, TeamCard } from "@/components/cards";
import { EmptyState, MediaThumb } from "@/components/Media";
import { Reveal } from "@/components/Reveal";
import {
  getAchievements,
  getActivities,
  getCategories,
  getGallery,
  getProfile,
  getProjects,
  getStats,
  getTeam,
} from "@/lib/data";
import { DEFAULT_DISCIPLINES } from "@/lib/constants";

export default async function HomePage() {
  const [profile, stats, activities, projects, gallery, heroImages, achievements, team, projectCats] =
    await Promise.all([
      getProfile(),
      getStats(),
      getActivities(3),
      getProjects({ limit: 6, featuredFirst: true }),
      getGallery({ limit: 8 }),
      getGallery({ limit: 4, imagesOnly: true }),
      getAchievements(3),
      getTeam(4),
      getCategories("project"),
    ]);

  const heroUrls = heroImages.map((g) => g.url);
  if (profile.hero_image_url) heroUrls.unshift(profile.hero_image_url);

  const disciplines = projectCats.length ? projectCats.map((c) => c.name) : DEFAULT_DISCIPLINES;
  const marquee = [...disciplines, ...disciplines, ...disciplines, ...disciplines];

  return (
    <>
      <Hero description={profile.description ?? ""} images={heroUrls.slice(0, 4)} stats={stats} />

      {/* Marquee bidang kreatif */}
      <div className="mt-10 overflow-hidden bg-navy py-5" aria-hidden>
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
          {marquee.map((d, i) => (
            <span key={i} className="flex items-center gap-10 font-display text-xl font-bold text-white/90">
              {d}
              <span className="h-2 w-2 rounded-full bg-brand" />
            </span>
          ))}
        </div>
      </div>

      {/* Latest Activities */}
      <section className="container-x pt-24 sm:pt-32">
        <SectionHeading
          eyebrow="01 — Latest Activities"
          title="Jejak kegiatan terbaru kami."
          description="Dokumentasi event, workshop, dan pelatihan yang baru saja kami lalui."
          href="/activities"
        />
        <div className="mt-12">
          {activities.length === 0 ? (
            <EmptyState title="Belum ada kegiatan" description="Kegiatan akan tampil di sini setelah ditambahkan oleh admin." />
          ) : (
            <div className="grid gap-6 lg:grid-cols-12">
              <Reveal className="lg:col-span-7">
                <ActivityCard activity={activities[0]} large />
              </Reveal>
              <div className="grid gap-6 lg:col-span-5">
                {activities.slice(1).map((a, i) => (
                  <Reveal key={a.id} delay={0.1 * (i + 1)}>
                    <ActivityCard activity={a} />
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="mt-24 bg-navy py-24 sm:mt-32 sm:py-32">
        <div className="container-x">
          <SectionHeading
            dark
            eyebrow="02 — Featured Projects"
            title="Karya pilihan anggota."
            description="Desain, foto, video, dan konten digital yang lahir dari kolaborasi tim."
            href="/projects"
          />
          <div className="mt-12">
            {projects.length === 0 ? (
              <EmptyState title="Belum ada proyek" description="Karya akan tampil di sini setelah ditambahkan oleh admin." />
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((p, i) => (
                  <Reveal key={p.id} delay={(i % 3) * 0.08}>
                    <ProjectCard project={p} href="/projects" dark />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Our Gallery */}
      <section className="container-x pt-24 sm:pt-32">
        <SectionHeading
          eyebrow="03 — Our Gallery"
          title="Momen yang kami abadikan."
          href="/gallery"
          hrefLabel="Buka galeri"
        />
        <div className="mt-12">
          {gallery.length === 0 ? (
            <EmptyState title="Galeri masih kosong" description="Foto dan video akan tampil di sini setelah diunggah oleh admin." />
          ) : (
            <div className="columns-2 gap-3 sm:gap-4 lg:columns-4">
              {gallery.map((g) => (
                <Link
                  key={g.id}
                  href="/gallery"
                  className="group mb-3 block break-inside-avoid overflow-hidden rounded-2xl bg-ice sm:mb-4"
                  aria-label={g.title}
                >
                  <MediaThumb url={g.url} type={g.media_type} alt={g.title} className="transition duration-700 group-hover:scale-105" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Achievements */}
      <section className="container-x pt-24 sm:pt-32">
        <SectionHeading
          eyebrow="04 — Achievements"
          title="Prestasi yang membanggakan."
          href="/achievements"
        />
        <div className="mt-12 border-b border-slate-200">
          {achievements.length === 0 ? (
            <EmptyState title="Belum ada prestasi" description="Prestasi akan tampil di sini setelah ditambahkan oleh admin." />
          ) : (
            achievements.map((a) => <AchievementRow key={a.id} item={a} />)
          )}
        </div>
      </section>

      {/* About Our Team */}
      <section className="container-x pt-24 sm:pt-32">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow">05 — About Our Team</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold leading-[1.05] sm:text-5xl">
              Orang-orang di balik lensa.
            </h2>
            <p className="mt-5 leading-relaxed text-slate-600">{profile.description}</p>
            <Link href="/about" className="btn btn-dark mt-8">
              Kenali kami <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
          <div className="lg:col-span-8">
            {team.length === 0 ? (
              <EmptyState title="Belum ada data anggota" description="Anggota tim akan tampil di sini setelah ditambahkan oleh admin." />
            ) : (
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                {team.map((m, i) => (
                  <Reveal key={m.id} delay={i * 0.08}>
                    <TeamCard member={m} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
