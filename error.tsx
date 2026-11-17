"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container-x grid place-items-center py-32 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-red-50 text-red-500">
        <AlertTriangle className="h-7 w-7" />
      </span>
      <h1 className="mt-6 font-display text-3xl font-extrabold">Terjadi kendala memuat halaman</h1>
      <p className="mt-3 max-w-lg text-sm text-slate-600">
        {process.env.NODE_ENV === "development"
          ? error.message
          : "Data tidak dapat dimuat saat ini. Periksa koneksi Anda lalu coba lagi."}
      </p>
      <button onClick={reset} className="btn btn-primary mt-8">
        <RotateCcw className="h-4 w-4" /> Coba lagi
      </button>
    </div>
  );
}
