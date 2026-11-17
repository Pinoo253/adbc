import Link from "next/link";
import { Instagram, Mail, MapPin, Phone, Youtube, Music2 } from "lucide-react";
import { Logo } from "./Logo";
import { NAV_LINKS } from "@/lib/constants";
import { normalizeUrl } from "@/lib/utils";
import type { Profile } from "@/types";

export function Footer({ profile }: { profile: Profile }) {
  const socials = [
    { href: normalizeUrl(profile.instagram), label: "Instagram", Icon: Instagram },
    { href: normalizeUrl(profile.youtube), label: "YouTube", Icon: Youtube },
    { href: normalizeUrl(profile.tiktok), label: "TikTok", Icon: Music2 },
  ].filter((s) => s.href);

  return (
    <footer className="mt-24 bg-navy text-slate-300">
      <div className="container-x grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo light />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-slate-400">{profile.tagline}</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-400">
            We create, we capture, we inspire.
          </p>
          {socials.length > 0 && (
            <div className="mt-6 flex gap-2">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white transition hover:border-brand hover:bg-brand"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        <nav className="md:col-span-3" aria-label="Footer">
          <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">Menu</h3>
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm md:grid-cols-1">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">Kontak</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {profile.email && (
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <a href={`mailto:${profile.email}`} className="break-all transition hover:text-white">
                  {profile.email}
                </a>
              </li>
            )}
            {profile.phone && (
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <span>{profile.phone}</span>
              </li>
            )}
            {profile.address && (
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <span>{profile.address}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-start justify-between gap-2 py-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} ADB CREATIVE TEAM. All rights reserved.</p>
          <Link href="/admin" className="transition hover:text-white">
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
