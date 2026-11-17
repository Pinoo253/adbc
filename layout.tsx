import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { AdminSidebar, SignOutButton } from "@/components/admin/AdminSidebar";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: admin } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();

  if (!admin) {
    return (
      <div className="grid min-h-screen place-items-center bg-ice/60 px-6 text-center">
        <div className="max-w-md">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-50 text-amber-600">
            <ShieldAlert className="h-6 w-6" />
          </span>
          <h1 className="mt-6 font-display text-2xl font-extrabold">Akun belum terdaftar sebagai admin</h1>
          <p className="mt-3 text-sm text-slate-600">
            Anda masuk sebagai <span className="font-semibold">{user.email}</span>, tetapi akun ini belum ada di tabel
            admins. Daftarkan lewat SQL Editor Supabase (lihat README).
          </p>
          <SignOutButton className="btn btn-primary mt-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <AdminSidebar email={user.email ?? ""} />
      <main className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">{children}</main>
    </div>
  );
}
