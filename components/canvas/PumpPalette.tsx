"use client";

import { useMemo, useState } from "react";
import { useFleetStore } from "@/lib/store/fleet";
import { useCanvasStore } from "@/lib/store/canvas";
import { PumpRenderer } from "@/components/fleet/PumpRenderer";
import { HealthRing } from "@/components/fleet/HealthRing";
import { StatusDot } from "@/components/fleet/StatusDot";
import { overallHealth } from "@/lib/health";
import { Plus, Search, GripVertical } from "lucide-react";
import { GlassButton } from "@/components/primitives/GlassButton";

export function PumpPalette({ onAddThirdParty }: { onAddThirdParty: () => void }) {
  const pumps = useFleetStore((s) => s.pumps);
  const activeLayout = useCanvasStore((s) =>
    s.layouts.find((l) => l.id === s.activeLayoutId) ?? s.layouts[0]
  );
  const placedIds = useMemo(
    () => new Set(activeLayout?.nodes.map((n) => n.pumpId) ?? []),
    [activeLayout]
  );
  const [q, setQ] = useState("");

  const available = pumps.filter((p) => !placedIds.has(p.id));

  const filtered = available.filter((p) =>
    !q
      ? true
      : (
          p.model.toLowerCase().includes(q.toLowerCase()) ||
          (p.nickname ?? "").toLowerCase().includes(q.toLowerCase()) ||
          p.location.toLowerCase().includes(q.toLowerCase())
        )
  );

  const ksb = filtered.filter((p) => !p.isThirdParty);
  const third = filtered.filter((p) => p.isThirdParty);

  const onDragStart = (e: React.DragEvent, pumpId: string) => {
    e.dataTransfer.setData("application/giw-pump", pumpId);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <aside className="w-[280px] shrink-0 flex flex-col rounded-3xl glass overflow-hidden h-full">
      <div className="p-4 border-b border-black/[0.06]">
        <div className="text-[10px] uppercase tracking-[0.2em] text-[#86868B] mb-2">Palette</div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#A1A1A6]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Find a pump"
            className="w-full h-8 pl-8 pr-2 text-xs rounded-lg bg-white/65 border border-black/[0.08] text-[#1D1D1F] placeholder:text-[#A1A1A6] focus:outline-none focus:ring-2 focus:ring-[#0A84FF]/25 focus:border-[#0A84FF]/40"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        <section>
          <div className="px-1 mb-2 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.18em] text-[#C77800]">Your KSB pumps</span>
            <span className="num text-[10px] text-[#A1A1A6]">{ksb.length}</span>
          </div>
          <div className="space-y-1.5">
            {ksb.map((p) => (
              <PaletteItem key={p.id} pump={p} onDragStart={(e) => onDragStart(e, p.id)} />
            ))}
            {ksb.length === 0 && <EmptyTiny text={q ? "No matches" : "None yet"} />}
          </div>
        </section>

        <section>
          <div className="px-1 mb-2 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.18em] text-[#6E6E73]">Third-party</span>
            <span className="num text-[10px] text-[#A1A1A6]">{third.length}</span>
          </div>
          <div className="space-y-1.5">
            {third.map((p) => (
              <PaletteItem key={p.id} pump={p} onDragStart={(e) => onDragStart(e, p.id)} />
            ))}
            {third.length === 0 && <EmptyTiny text={q ? "No matches" : "None yet"} />}
          </div>
        </section>
      </div>

      <div className="p-3 border-t border-black/[0.06]">
        <GlassButton variant="glass" size="sm" className="w-full" onClick={onAddThirdParty}>
          <Plus className="h-3.5 w-3.5" />
          Add third-party pump
        </GlassButton>
      </div>
    </aside>
  );
}

function PaletteItem({
  pump,
  onDragStart,
}: {
  pump: ReturnType<typeof useFleetStore.getState>["pumps"][number];
  onDragStart: (e: React.DragEvent) => void;
}) {
  const isKsb = !pump.isThirdParty;
  const health = isKsb ? overallHealth(pump) : null;
  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="group relative pl-1.5 pr-2 py-2 rounded-xl bg-white/55 border border-black/[0.06] hover:border-black/[0.12] hover:bg-white/85 cursor-grab active:cursor-grabbing transition-colors flex items-center gap-2"
    >
      <GripVertical className="h-3 w-3 text-[#C8C8CD] group-hover:text-[#86868B] shrink-0" />
      <div className="h-9 w-9 shrink-0 rounded-md bg-white/70 border border-black/[0.06] overflow-hidden flex items-center justify-center">
        <PumpRenderer variant={pump.imageVariant} isThirdParty={!isKsb} size="node" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[12px] font-medium text-[#1D1D1F] truncate leading-tight">{pump.model}</div>
        <div className="text-[10px] text-[#86868B] truncate mt-0.5">{pump.nickname}</div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {health !== null ? (
          <HealthRing percent={health} size={22} strokeWidth={2.5} showLabel={false} />
        ) : (
          <StatusDot status={pump.status} withLabel={false} />
        )}
      </div>
    </div>
  );
}

function EmptyTiny({ text }: { text: string }) {
  return (
    <div className="px-2 py-3 text-[11px] text-[#A1A1A6] text-center rounded-lg border border-dashed border-black/[0.08]">
      {text}
    </div>
  );
}
