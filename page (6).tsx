import type { Metadata } from "next";
import { PageHeader } from "@/components/SectionHeading";
import { GalleryExplorer } from "@/components/GalleryExplorer";
import { getGallery } from "@/lib/data";

export const metadata: Metadata = { title: "Gallery" };

export default async function GalleryPage() {
  const items = await getGallery();
  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="Galeri foto & video."
        description="Kumpulan dokumentasi visual dari seluruh kegiatan ADB CREATIVE TEAM. Klik untuk melihat lebih besar."
      />
      <section className="container-x py-16 sm:py-20">
        <GalleryExplorer items={items} />
      </section>
    </>
  );
}
