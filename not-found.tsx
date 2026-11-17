import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-ice/60 px-6 text-center">
      <div>
        <p className="font-display text-8xl font-extrabold text-brand">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold">Halaman tidak ditemukan</h1>
        <p className="mt-2 text-slate-600">Halaman yang Anda cari tidak ada atau sudah dipindahkan.</p>
        <Link href="/" className="btn btn-primary mt-8">
          Kembali ke beranda
        </Link>
      </div>
    </div>
  );
}
