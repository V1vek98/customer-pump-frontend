"use client";

import Link from "next/link";
import type { Pump } from "@/types";
import { PumpListRail } from "./PumpListRail";
import { PumpDetailPane } from "./PumpDetailPane";
import { usePumpKeyboardNav } from "./usePumpKeyboardNav";
import { GlassButton } from "@/components/primitives/GlassButton";
import { ArrowLeft } from "lucide-react";

type Props = {
  filtered: Pump[];
  selectedId: string;
  selected: Pump | undefined;
};

export function MasterDetail({ filtered, selectedId, selected }: Props) {
  usePumpKeyboardNav(filtered, selectedId);

  return (
    <div className="flex flex-col lg:flex-row gap-5">
      <PumpListRail filtered={filtered} selectedId={selectedId} />
      {selected ? (
        // `key` makes the pane remount on pump change, which (a) resets internal
        // state cleanly and (b) lets the CSS animation in the cross-section reset.
        <PumpDetailPane key={selected.id} pump={selected} />
      ) : (
        <MissingPumpState selectedId={selectedId} />
      )}
    </div>
  );
}

function MissingPumpState({ selectedId }: { selectedId: string }) {
  return (
    <div className="flex-1 min-w-0 rounded-3xl border border-dashed border-black/[0.10] bg-white/40 backdrop-blur-xl py-16 px-8 text-center">
      <div className="text-[11px] uppercase tracking-[0.18em] text-[#86868B] mb-2">
        Pump not found
      </div>
      <h3 className="text-[18px] font-semibold text-[#1D1D1F]">
        We couldn&apos;t find <span className="num">{selectedId}</span>
      </h3>
      <p className="text-sm text-[#6E6E73] mt-2 max-w-md mx-auto">
        It may have been removed, or this link is from another fleet. Pick a pump from the list, or
        head back to see everything.
      </p>
      <div className="mt-6">
        <Link href="/fleet">
          <GlassButton variant="glass">
            <ArrowLeft className="h-4 w-4" />
            Back to fleet
          </GlassButton>
        </Link>
      </div>
    </div>
  );
}
