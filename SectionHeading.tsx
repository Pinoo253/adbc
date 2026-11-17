import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  hrefLabel = "Lihat semua",
  dark = false,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  href?: string;
  hrefLabel?: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <Reveal className={cn("flex flex-col justify-between gap-6 md:flex-row md:items-end", className)}>
      <div className="max-w-2xl">
        <p className={cn("eyebrow", dark && "text-blue-300")}>{eyebrow}</p>
        <h2
          className={cn(
            "mt-3 font-display text-3xl font-extrabold leading-[1.05] sm:text-4xl lg:text-5xl",
            dark ? "text-white" : "text-navy",
          )}
        >
          {title}
        </h2>
        {description && (
          <p className={cn("mt-4 text-base leading-relaxed", dark ? "text-slate-400" : "text-slate-600")}>
            {description}
          </p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className={cn(
            "group inline-flex shrink-0 items-center gap-2 text-sm font-semibold",
            dark ? "text-white" : "text-navy",
          )}
        >
          <span className="border-b border-current pb-0.5">{hrefLabel}</span>
          <span className="grid h-8 w-8 place-items-center rounded-full bg-brand text-white transition group-hover:rotate-45">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </Link>
      )}
    </Reveal>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-slate-100 bg-ice/60">
      <div className="bg-grid absolute inset-0" aria-hidden />
      <div className="container-x relative py-16 sm:py-24">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl font-extrabold leading-[1] sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          {description && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">{description}</p>}
          {children}
        </Reveal>
      </div>
    </section>
  );
}
