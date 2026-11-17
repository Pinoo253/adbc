"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  ExternalLink,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  Palette,
  Settings2,
  Tags,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/activities", label: "Kegiatan", Icon: CalendarDays },
  { href: "/admin/projects", label: "Proyek", Icon: Palette },
  { href: "/admin/gallery", label: "Galeri", Icon: Images },
  { href: "/admin/achievements", label: "Prestasi", Icon: Trophy },
  { href: "/admin/team_members", label: "Anggota", Icon: Users },
  { href: "/admin/categories", label: "Kategori", Icon: Tags },
  { href: "/admin/profile", label: "Profil Ekskul", Icon: Settings2 },
];

export function SignOutButton({ className, children }: { className?: string; children?: React.ReactNode }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      className={className}
      onClick={async () => {
        setBusy(true);
        await createClient().auth.signOut();
        router.replace("/admin/login");
        router.refresh();
      }}
    >
      {children ?? (
        <>
          <LogOut className="h-4 w-4" /> Keluar
        </>
      )}
    </button>
  );
}

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  const nav = (
    <>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Menu admin">
        {ITEMS.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
              active(href) ? "bg-brand text-white shadow-glow" : "text-slate-300 hover:bg-white/10 hover:text-white",
            )}
          >
            <Icon className="h-4 w-4" /> {label}
          </Link>
        ))}
      </nav>
      <div className="space-y-2 border-t border-white/10 p-4">
        <Link href="/" target="_blank" className="flex items-center gap-2 text-sm text-slate-300 hover:text-white">
          <ExternalLink className="h-4 w-4" /> Lihat website
        </Link>
        <p className="truncate text-xs text-slate-500">{email}</p>
        <SignOutButton className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white disabled:opacity-50" />
      </div>
    </>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-navy lg:flex">
        <div className="border-b border-white/10 p-5">
          <Logo light />
        </div>
        {nav}
      </aside>

      {/* Mobile */}
      <div className="sticky top-0 z-40 flex items-center justify-between bg-navy px-4 py-3 lg:hidden">
        <Logo light />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Tutup menu" : "Buka menu"}
          className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 top-[60px] z-30 flex flex-col bg-navy lg:hidden">{nav}</div>
      )}
    </>
  );
}
