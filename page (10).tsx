import type { Metadata } from "next";
import { PageHeader } from "@/components/SectionHeading";
import { AchievementsList } from "@/components/AchievementsList";
import { getAchievements } from "@/lib/data";

export const metadata: Metadata = { title: "Achievements" };

export default async function AchievementsPage() {
  const items = await getAchievements();
  return (
    <>
      <PageHeader
        eyebrow="Achievements"
        title="Prestasi & penghargaan."
        description="Pencapaian anggota di berbagai kompetisi, dari tingkat sekolah hingga internasional."
      />
      <section className="container-x py-16 sm:py-20">
        <AchievementsList items={items} />
      </section>
    </>
  );
}
