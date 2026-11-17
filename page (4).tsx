import type { Metadata } from "next";
import { PageHeader } from "@/components/SectionHeading";
import { ProjectsExplorer } from "@/components/ProjectsExplorer";
import { getCategories, getProjects } from "@/lib/data";

export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const [projects, categories] = await Promise.all([getProjects({ featuredFirst: true }), getCategories("project")]);
  return (
    <>
      <PageHeader
        eyebrow="Creative Projects"
        title="Karya anggota."
        description="Desain grafis, fotografi, videografi, editing video, konten digital, dan proyek kreatif lainnya."
      />
      <section className="container-x py-16 sm:py-20">
        <ProjectsExplorer projects={projects} categories={categories} />
      </section>
    </>
  );
}
