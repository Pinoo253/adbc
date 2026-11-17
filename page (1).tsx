"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Lock } from "lucide-react";
import { Logo } from "@/components/Logo";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError || !data.user) {
        setError("Email atau password salah.");
        return;
      }
      const { data: admin, error: adminError } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", data.user.id)
        .maybeSingle();
      if (adminError) {
        await supabase.auth.signOut();
        setError("Tabel admins belum tersedia. Jalankan supabase/schema.sql terlebih dulu.");
        return;
      }
      if (!admin) {
        await supabase.auth.signOut();
        setError("Akun ini bukan admin. Hubungi pengelola untuk didaftarkan.");
        return;
      }
      const next = new URLSearchParams(window.location.search).get("next");
      router.replace(next && next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-ice/60 px-5 py-10">
      <div className="bg-grid absolute inset-0" aria-hidden />
      <div className="relative w-full max-w-md">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand">
          <ArrowLeft className="h-4 w-4" /> Kembali ke website
        </Link>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
          <Logo />
          <h1 className="mt-8 font-display text-2xl font-extrabold">Login Admin</h1>
          <p className="mt-1 text-sm text-slate-500">Masuk untuk mengelola konten website.</p>

          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            <div>
              <label htmlFor="email" className="label">Email</label>
              <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
            </div>
            <div>
              <label htmlFor="password" className="label">Password</label>
              <input id="password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" />
            </div>
            {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}
            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              {loading ? "Memproses…" : "Masuk"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
