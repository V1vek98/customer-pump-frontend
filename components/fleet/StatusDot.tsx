"use client";

import { cn } from "@/lib/utils";
import type { PumpStatus } from "@/types";

const COLOR: Record<PumpStatus, string> = {
  running: "#30B65C",
  standby: "#FF9F0A",
  offline: "#A1A1A6",
  maintenance: "#FF3B30",
};

const PULSE: Record<PumpStatus, string> = {
  running: "pulse-soft 2.2s ease-in-out infinite",
  standby: "pulse-slow 3.6s ease-in-out infinite",
  offline: "none",
  maintenance: "pulse-soft 1.4s ease-in-out infinite",
};

const LABEL: Record<PumpStatus, string> = {
  running: "Running",
  standby: "Standby",
  offline: "Offline",
  maintenance: "Maintenance",
};

export function StatusDot({
  status,
  withLabel = true,
  className,
}: {
  status: PumpStatus;
  withLabel?: boolean;
  className?: string;
}) {
  const color = COLOR[status];
  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="relative inline-flex h-2 w-2">
        <span
          className="absolute inset-0 rounded-full"
          style={{ background: color, animation: PULSE[status] }}
        />
        <span
          className="relative h-2 w-2 rounded-full"
          style={{ background: color, boxShadow: `0 0 8px ${color}aa` }}
        />
      </span>
      {withLabel && (
        <span className="text-[11px] font-medium text-[#424245] tracking-wide">
          {LABEL[status]}
        </span>
      )}
    </div>
  );
}
