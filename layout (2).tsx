import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getProfile } from "@/lib/data";

// Selalu ambil data terbaru agar perubahan admin langsung tampil di website publik.
export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
      >
        Lewati ke konten
      </a>
      <Navbar />
      <main id="main">{children}</main>
      <Footer profile={profile} />
    </>
  );
}
