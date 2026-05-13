"use client";

import { Search, Bell } from "lucide-react";
import { SegmentedNav } from "./SegmentedNav";
import { Wordmark } from "./Wordmark";
import { useFleetStore } from "@/lib/store/fleet";

export function TopNav() {
  const customerName = useFleetStore((s) => s.customerName);

  return (
    <header className="sticky top-0 z-40">
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#F5F5F7]/90 via-[#F5F5F7]/60 to-transparent backdrop-blur-md pointer-events-none" />
      <div className="relative mx-auto max-w-[1600px] px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Wordmark />
          <div className="h-5 w-px bg-black/[0.10]" />
          <div className="hidden md:inline-flex items-center gap-2 h-7 px-3 rounded-full bg-white/70 border border-black/[0.07] backdrop-blur-xl shadow-[0_1px_0_0_rgba(255,255,255,0.7)_inset,0_1px_2px_rgba(40,40,60,0.06)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#30B65C]" />
            <span className="text-[11px] text-[#1D1D1F] font-medium">{customerName}</span>
          </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2">
          <SegmentedNav />
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-label="Search"
            className="h-9 w-9 inline-flex items-center justify-center rounded-full bg-white/70 border border-black/[0.07] text-[#424245] hover:text-[#1D1D1F] hover:bg-white/95 transition-colors backdrop-blur-xl"
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            aria-label="Notifications"
            className="relative h-9 w-9 inline-flex items-center justify-center rounded-full bg-white/70 border border-black/[0.07] text-[#424245] hover:text-[#1D1D1F] hover:bg-white/95 transition-colors backdrop-blur-xl"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#FFC233]" />
          </button>
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#1D1D1F] to-[#424245] flex items-center justify-center text-[11px] font-medium text-white shadow-[0_1px_0_0_rgba(255,255,255,0.12)_inset,0_2px_8px_-2px_rgba(0,0,0,0.18)]">
            GC
          </div>
        </div>
      </div>
    </header>
  );
}
