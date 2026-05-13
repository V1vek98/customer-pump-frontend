"use client";

import { Layers } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  blastView: boolean;
  onChange: (next: boolean) => void;
  className?: string;
};

export function PumpBlastToggle({ blastView, onChange, className }: Props) {
  return (
    <button
      type="button"
      aria-pressed={blastView}
      aria-label={blastView ? "Collapse blast view" : "Show blast view"}
      onClick={() => onChange(!blastView)}
      className={cn(
        "group relative inline-flex items-center gap-1.5 h-8 px-3 rounded-full select-none",
        "text-[11px] font-medium tracking-tight transition-all duration-200 ease-out",
        "backdrop-blur-xl",
        "active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A84FF]/55 focus-visible:ring-offset-2 focus-visible:ring-offset-white/0",
        blastView
          ? "bg-[#1D1D1F] text-white border border-black/30 shadow-[0_1px_0_0_rgba(255,255,255,0.18)_inset,0_6px_18px_-6px_rgba(40,40,60,0.32)]"
          : "bg-white/72 text-[#1D1D1F] border border-black/[0.08] hover:bg-white/90 hover:border-black/[0.14] shadow-[0_1px_0_0_rgba(255,255,255,0.85)_inset,0_2px_8px_-2px_rgba(40,40,60,0.10)]",
        className
      )}
    >
      <Layers
        className={cn(
          "h-3.5 w-3.5 transition-transform duration-200",
          blastView ? "rotate-[8deg]" : "rotate-0 group-hover:-rotate-[6deg]"
        )}
      />
      <span>{blastView ? "Assembled" : "Blast view"}</span>
    </button>
  );
}
