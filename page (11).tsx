import type { Metadata } from "next";
import { Camera, Clapperboard, Globe2, Megaphone, PenTool, Sparkles, Target } from "lucide-react";
import { PageHeader } from "@/components/SectionHeading";
import { TeamCard } from "@/components/cards";
import { EmptyState } from "@/components/Media";
import { Reveal } from "@/components/Reveal";
import { getCategories, getProfile, getTeam } from "@/lib/data";
import { DEFAULT_DISCIPLINES } from "@/lib/constants";
import { splitLines } from "@/lib/utils";
import type { TeamMember } from "@/types";

export const metadata: Metadata = { title: "About" };

const ICONS = [PenTool, Camera, Clapperboard, Sparkles, Megaphone, Globe2];

export default async function AboutPage() {
  const [profile, team, cats] = await Promise.all([getProfile(), getTeam(), getCategories("project")]);

  const missions = splitLines(profile.mission);
  const goals = splitLines(profile.goals);
  const fields = cats.length ? cats.map((c) => c.name) : DEFAULT_DISCIPLINES;

  // Kelompokkan struktur per divisi sesuai urutan sort_order.
  const groups = new Map<string, TeamMember[]>();
  team.forEach((m) => {
    const key = m.division?.trim() || "Anggota";
    groups.set(key, [...(groups.get(key) ?? []), m]);
  });

  return (
    <>
      <PageHeader eyebrow="About Us" title="Komunitas kreatif yang tumbuh bersama." description={profile.tagline ?? undefined} />

      {/* Profil & Sejarah */}
      <section className="container-x grid gap-14 py-20 sm:py-28 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow">Profil</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">{profile.name}</h2>
          <p className="mt-5 whitespace-pre-line leading-relaxed text-slate-600">{profile.description}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="eyebrow">Sejarah Singkat</p>
          <p className="mt-5 whitespace-pre-line leading-relaxed text-slate-600">{profile.history}</p>
        </Reveal>
      </section>

      {/* Visi Misi Tujuan */}
      <section className="bg-navy py-20 text-white sm:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow text-blue-300">Visi</p>
            <p className="mt-4 font-display text-2xl font-bold leading-snug sm:text-3xl">“{profile.vision}”</p>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-4">
            <p className="eyebrow text-blue-300">Misi</p>
            <ol className="mt-4 space-y-4">
              {missions.map((m, i) => (
                <li key={i} className="flex gap-4 text-sm leading-relaxed text-slate-300">
                  <span className="font-mono text-brand">{String(i + 1).padStart(2, "0")}</span>
                  {m}
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal delay={0.2} className="lg:col-span-3">
            <p className="eyebrow text-blue-300">Tujuan</p>
            <ul className="mt-4 space-y-4">
              {goals.map((g, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-slate-300">
                  <Target className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  {g}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Bidang kreativitas */}
      <section className="container-x py-20 sm:py-28">
        <Reveal>
          <p className="eyebrow">Bidang Kreativitas</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-extrabold sm:text-5xl">
            Apa yang kami kembangkan.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fields.map((f, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <Reveal key={f} delay={(i % 3) * 0.08}>
                <div className="group h-full rounded-3xl border border-slate-200 p-7 transition duration-500 hover:-translate-y-1 hover:border-brand/40 hover:bg-ice/60">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ice text-brand transition group-hover:bg-brand group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-6 font-display text-xl font-bold">{f}</h3>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Struktur kepengurusan */}
      <section id="team" className="scroll-mt-24 bg-ice/60 py-20 sm:py-28">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">Struktur Kepengurusan</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-extrabold sm:text-5xl">Tim kami.</h2>
          </Reveal>
          {team.length === 0 ? (
            <div className="mt-12">
              <EmptyState title="Belum ada data anggota" description="Struktur kepengurusan akan tampil di sini setelah diisi oleh admin." />
            </div>
          ) : (
            <div className="mt-12 space-y-14">
              {Array.from(groups, ([division, members]) => (
                <div key={division}>
                  <h3 className="mb-6 flex items-center gap-4 font-mono text-xs uppercase tracking-[0.22em] text-slate-500">
                    {division}
                    <span className="h-px flex-1 bg-slate-300" />
                  </h3>
                  <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
                    {members.map((m) => (
                      <TeamCard key={m.id} member={m} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
