"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

// Menangkap error pada layout (mis. database belum disiapkan / env belum diisi).
export default function RootError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="grid min-h-screen place-items-center bg-ice/60 px-6 text-center">
      <div className="max-w-lg">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-red-50 text-red-500">
          <AlertTriangle className="h-7 w-7" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-extrabold">Website belum dapat memuat data</h1>
        <p className="mt-3 text-sm text-slate-600">
          {process.env.NODE_ENV === "development"
            ? error.message
            : "Periksa konfigurasi Supabase (.env.local) dan pastikan supabase/schema.sql sudah dijalankan, lalu coba lagi."}
        </p>
        <button onClick={reset} className="btn btn-primary mt-8">
          <RotateCcw className="h-4 w-4" /> Coba lagi
        </button>
      </div>
    </div>
  );
}
