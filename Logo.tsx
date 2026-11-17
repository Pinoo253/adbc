import { Aperture } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white shadow-glow">
        <Aperture className="h-5 w-5" strokeWidth={2.2} />
      </span>
      <span className={cn("font-display leading-none", light ? "text-white" : "text-navy")}>
        <span className="block text-[17px] font-extrabold tracking-tight">ADB</span>
        <span className="mt-0.5 block text-[8.5px] font-semibold tracking-[0.3em]">CREATIVE TEAM</span>
      </span>
    </span>
  );
}
