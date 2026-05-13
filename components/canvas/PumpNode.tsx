"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { PumpRenderer } from "@/components/fleet/PumpRenderer";
import { HealthRing } from "@/components/fleet/HealthRing";
import { StatusDot } from "@/components/fleet/StatusDot";
import { overallHealth } from "@/lib/health";
import { Power, Trash2 } from "lucide-react";
import { useCanvasStore } from "@/lib/store/canvas";
import { useFleetStore } from "@/lib/store/fleet";
import { SUBSECTION_COLORS } from "@/lib/subsections";
import type { SubsectionColor } from "@/types";
import { toast } from "sonner";

export type PumpNodeData = {
  pumpId: string;
  active: boolean;
  role?: "lead" | "standby";
  subsectionColor?: SubsectionColor;
};

export function PumpNode({ id, data, selected }: NodeProps) {
  const d = data as unknown as PumpNodeData;
  const pumps = useFleetStore((s) => s.pumps);
  const toggleActive = useCanvasStore((s) => s.toggleActive);
  const removeNode = useCanvasStore((s) => s.removeNode);

  const pump = pumps.find((p) => p.id === d.pumpId);
  if (!pump) {
    return (
      <div className="w-48 rounded-2xl p-3 border border-[#FF3B30]/30 bg-[#FF3B30]/10 text-[11px] text-[#1D1D1F]">
        Missing pump · {d.pumpId}
      </div>
    );
  }

  const health = pump.isThirdParty ? null : overallHealth(pump);
  const isKsb = !pump.isThirdParty;
  const active = d.active;
  const sub = d.subsectionColor ? SUBSECTION_COLORS[d.subsectionColor] : null;

  let border: string;
  let boxShadow: string;
  if (selected) {
    border = "1px solid rgba(255,194,51,0.85)";
    boxShadow = "0 0 0 4px rgba(255,194,51,0.22), 0 18px 40px -12px rgba(40,40,60,0.22)";
  } else if (sub) {
    border = `1px solid ${sub.border}`;
    boxShadow = `0 0 0 3px ${sub.ring}, 0 8px 24px -10px rgba(40,40,60,0.18)`;
  } else {
    border = "1px solid rgba(0,0,0,0.07)";
    boxShadow = "0 1px 0 rgba(255,255,255,0.85) inset, 0 8px 24px -10px rgba(40,40,60,0.18)";
  }

  return (
    <div className="group relative w-[228px]">
      <Handle id="t" type="source" position={Position.Top} style={{ top: -5 }} />
      <Handle id="r" type="source" position={Position.Right} style={{ right: -5 }} />
      <Handle id="b" type="source" position={Position.Bottom} style={{ bottom: -5 }} />
      <Handle id="l" type="source" position={Position.Left} style={{ left: -5 }} />

      <div
        className={`relative rounded-2xl overflow-hidden transition-all duration-200 ${active ? "" : "saturate-[0.5] opacity-90"}`}
        style={{
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          border,
          boxShadow,
        }}
      >
        {isKsb && (
          <div
            className="absolute top-0 left-0 h-8 w-8 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at top left, rgba(255,194,51,0.42), transparent 70%)",
            }}
          />
        )}
        {!isKsb && (
          <div className="absolute top-2 right-2 px-1 h-4 inline-flex items-center rounded-md border border-black/[0.10] bg-white/80 text-[8px] font-semibold tracking-[0.18em] text-[#6E6E73]">
            3P
          </div>
        )}

        <div className="relative h-16 w-full bg-gradient-to-b from-white/55 to-transparent flex items-center justify-center">
          <PumpRenderer
            variant={pump.imageVariant}
            isThirdParty={!isKsb}
            size="node"
            className="px-3"
          />
        </div>

        <div className="px-3 pb-3 pt-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[12px] font-semibold text-[#1D1D1F] truncate leading-tight">
                {pump.model}
              </div>
              <div className="text-[10px] text-[#6E6E73] truncate mt-0.5">{pump.nickname}</div>
            </div>
            {health !== null ? (
              <HealthRing percent={health} size={26} strokeWidth={2.5} showLabel={false} />
            ) : (
              <div className="h-[26px] w-[26px] rounded-full border border-dashed border-black/15" />
            )}
          </div>

          <div className="mt-2 flex items-center justify-between">
            <StatusDot status={pump.status} withLabel={false} />
            {d.role && (
              <span className="text-[8.5px] uppercase tracking-[0.2em] text-[#A1A1A6]">{d.role}</span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleActive(id);
              }}
              className={`h-6 w-6 inline-flex items-center justify-center rounded-full transition-all ${active ? "bg-[#FFC233]/22 text-[#C77800] border border-[#FFC233]/40" : "bg-black/[0.04] text-[#86868B] border border-black/[0.08]"}`}
              aria-label={active ? "Power off" : "Power on"}
              title={active ? "Running — click to set offline" : "Offline — click to start"}
            >
              <Power className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          removeNode(id);
          toast.success("Removed from map");
        }}
        className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white border border-black/[0.10] text-[#424245] hover:text-[#D70015] hover:border-[#FF3B30]/40 flex items-center justify-center shadow-[0_2px_6px_rgba(40,40,60,0.16)]"
        aria-label="Remove node"
      >
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  );
}
