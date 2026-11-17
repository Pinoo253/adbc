import type { Metadata } from "next";
import { Instagram, Mail, MapPin, Music2, Phone, Youtube } from "lucide-react";
import { PageHeader } from "@/components/SectionHeading";
import { ContactForm } from "@/components/ContactForm";
import { getProfile } from "@/lib/data";
import { normalizeUrl } from "@/lib/utils";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const p = await getProfile();
  const rows = [
    p.email && { Icon: Mail, label: "Email", value: p.email, href: `mailto:${p.email}` },
    p.phone && { Icon: Phone, label: "Telepon", value: p.phone, href: `tel:${p.phone.replace(/\s/g, "")}` },
    p.address && { Icon: MapPin, label: "Lokasi", value: p.address, href: undefined },
    p.instagram && { Icon: Instagram, label: "Instagram", value: p.instagram.replace(/^https?:\/\/(www\.)?/, ""), href: normalizeUrl(p.instagram)! },
    p.youtube && { Icon: Youtube, label: "YouTube", value: p.youtube.replace(/^https?:\/\/(www\.)?/, ""), href: normalizeUrl(p.youtube)! },
    p.tiktok && { Icon: Music2, label: "TikTok", value: p.tiktok.replace(/^https?:\/\/(www\.)?/, ""), href: normalizeUrl(p.tiktok)! },
  ].filter(Boolean) as { Icon: typeof Mail; label: string; value: string; href?: string }[];

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Mari berkolaborasi."
        description="Punya pertanyaan, ide kolaborasi, atau ingin bergabung? Hubungi kami."
      />
      <section className="container-x grid gap-10 py-16 sm:py-20 lg:grid-cols-12">
        <ul className="space-y-3 lg:col-span-5">
          {rows.map(({ Icon, label, value, href }) => {
            const body = (
              <>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ice text-brand transition group-hover:bg-brand group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block font-mono text-[11px] uppercase tracking-widest text-slate-500">{label}</span>
                  <span className="block break-words text-sm font-semibold">{value}</span>
                </span>
              </>
            );
            return (
              <li key={label}>
                {href ? (
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-brand/40"
                  >
                    {body}
                  </a>
                ) : (
                  <div className="group flex items-center gap-4 rounded-2xl border border-slate-200 p-4">{body}</div>
                )}
              </li>
            );
          })}
          {rows.length === 0 && (
            <li className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
              Informasi kontak belum diisi oleh admin.
            </li>
          )}
        </ul>
        <div className="lg:col-span-7">
          <ContactForm email={p.email} />
        </div>
      </section>
    </>
  );
}
