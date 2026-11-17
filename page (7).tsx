import type { Metadata } from "next";
import { PageHeader } from "@/components/SectionHeading";
import { ActivitiesExplorer } from "@/components/ActivitiesExplorer";
import { getActivities, getCategories } from "@/lib/data";

export const metadata: Metadata = { title: "Activities" };

export default async function ActivitiesPage() {
  const [activities, categories] = await Promise.all([getActivities(), getCategories("activity")]);
  return (
    <>
      <PageHeader
        eyebrow="Activities"
        title="Dokumentasi kegiatan."
        description="Setiap event, workshop, dan pelatihan kami arsipkan lengkap dengan foto dan video."
      />
      <section className="container-x py-16 sm:py-20">
        <ActivitiesExplorer activities={activities} categories={categories} />
      </section>
    </>
  );
}
