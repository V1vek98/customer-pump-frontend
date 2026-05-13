"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Pump } from "@/types";
import { overallHealth } from "@/lib/health";
import { formatHours } from "@/lib/format";
import { PumpRenderer } from "./PumpRenderer";
import { StatusDot } from "./StatusDot";
import { healthColorHex } from "@/lib/health";

type Props = {
  filtered: Pump[];
  selectedId: string | undefined;
};

export function PumpListRail({ filtered, selectedId }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Scroll the selected row into view (no animation; keep it instant).
  useEffect(() => {
    const root = containerRef.current;
    if (!root || !selectedId) return;
    const row = root.querySelector<HTMLElement>(`[data-pump-id="${selectedId}"]`);
    row?.scrollIntoView({ block: "nearest" });
  }, [selectedId]);

  return (
    <aside
      ref={containerRef}
      className="hidden lg:block lg:w-[320px] xl:w-[360px] shrink-0 sticky self-start overflow-y-auto rounded-3xl bg-white/55 border border-black/[0.06] backdrop-blur-xl shadow-[0_1px_0_0_rgba(255,255,255,0.7)_inset]"
      style={{ top: "8rem", maxHeight: "calc(100dvh - 9rem)" }}
    >
      <div className="px-3 py-3 border-b border-black/[0.06] sticky top-0 bg-white/70 backdrop-blur-xl z-10">
        <div className="text-[10px] uppercase tracking-[0.18em] text-[#86868B] px-1">
          {filtered.length} {filtered.length === 1 ? "pump" : "pumps"}
        </div>
      </div>
      <ul className="p-2 space-y-1">
        {filtered.map((p) => (
          <RailRow
            key={p.id}
            pump={p}
            isSelected={p.id === selectedId}
            onSelect={(id) => router.replace(`/fleet/${id}`, { scroll: false })}
          />
        ))}
        {filtered.length === 0 && (
          <li className="px-3 py-6 text-center text-[12px] text-[#86868B]">
            No pumps match those filters.
          </li>
        )}
      </ul>
    </aside>
  );
}

function RailRow({
  pump,
  isSelected,
  onSelect,
}: {
  pump: Pump;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  const isKsb = !pump.isThirdParty;
  const health = isKsb ? overallHealth(pump) : null;
  const color = health !== null ? healthColorHex(health) : "#A1A1A6";

  return (
    <li>
      <a
        href={`/fleet/${pump.id}`}
        data-pump-id={pump.id}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
          e.preventDefault();
          onSelect(pump.id);
        }}
        className={cn(
          "group relative flex items-center gap-3 px-2.5 py-2 rounded-xl transition-colors cursor-pointer",
          isSelected
            ? "bg-white/90 border border-black/[0.08] shadow-[0_1px_0_0_rgba(255,255,255,0.85)_inset,0_4px_14px_-6px_rgba(40,40,60,0.18)]"
            : "border border-transparent hover:bg-white/55"
        )}
      >
        {isSelected && (
          <span
            aria-hidden
            className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full"
            style={{ background: isKsb ? "#E6A810" : "#86868B" }}
          />
        )}

        <div className="shrink-0 h-9 w-12 rounded-md bg-gradient-to-br from-white/80 to-white/40 border border-black/[0.05] overflow-hidden flex items-center justify-center">
          <PumpRenderer
            variant={pump.imageVariant}
            isThirdParty={!isKsb}
            size="thumb"
            className=""
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[13px] font-semibold text-[#1D1D1F] truncate">
              {pump.model}
            </span>
            {!isKsb && (
              <span className="text-[9px] font-semibold tracking-[0.14em] text-[#6E6E73] uppercase">
                3P
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[10px] text-[#86868B] truncate mt-0.5">
            <span className="num">{formatHours(pump.totalRunHours)}</span>
            <span className="opacity-50">·</span>
            <span className="truncate">{pump.location}</span>
          </div>
          {health !== null ? (
            <div className="mt-1.5 h-[3px] rounded-full bg-black/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full transition-[width] duration-300"
                style={{ width: `${health}%`, background: color }}
              />
            </div>
          ) : (
            <div className="mt-1.5 h-[3px] rounded-full bg-black/[0.04] border border-dashed border-black/[0.10]" />
          )}
        </div>

        <div className="shrink-0">
          <StatusDot status={pump.status} withLabel={false} />
        </div>
      </a>
    </li>
  );
}
