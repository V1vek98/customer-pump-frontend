"use client";

import { cn } from "@/lib/utils";
import type { PumpComponent, ComponentName } from "@/types";
import { healthLevel, healthColorHex } from "@/lib/health";
import { HealthRing } from "./HealthRing";
import { WearBar } from "./WearBar";
import { motion } from "framer-motion";

type Props = {
  component: PumpComponent;
  onHover?: (name: ComponentName | null) => void;
  onClick?: () => void;
};

export function ComponentRow({ component, onHover, onClick }: Props) {
  const level = healthLevel(component.healthPercent);
  const color = healthColorHex(component.healthPercent);

  return (
    <motion.button
      onMouseEnter={() => onHover?.(component.name)}
      onMouseLeave={() => onHover?.(null)}
      onFocus={() => onHover?.(component.name)}
      onBlur={() => onHover?.(null)}
      onClick={onClick}
      whileHover={{ x: 2 }}
      className={cn(
        "group relative w-full text-left rounded-2xl px-4 py-3.5 transition-colors",
        "border border-black/[0.06] bg-white/55 hover:bg-white/80 hover:border-black/[0.10]",
        "flex items-center gap-4 cursor-pointer"
      )}
    >
      <span
        aria-hidden
        className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full"
        style={{
          background: level !== "good" ? color : "transparent",
          boxShadow: level !== "good" ? `0 0 4px ${color}aa` : "none",
        }}
      />

      <HealthRing percent={component.healthPercent} size={36} strokeWidth={3} />

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium text-[#1D1D1F] truncate">{component.displayName}</span>
          <span className="num text-[10px] text-[#A1A1A6] font-mono truncate">{component.partNumber}</span>
        </div>
        <div className="mt-1.5">
          <WearBar percent={component.healthPercent} />
        </div>
      </div>

      <div className="text-right shrink-0 w-28">
        <div
          className="num text-[13px] font-semibold tabular-nums"
          style={{ color: level === "good" ? "#1D1D1F" : color }}
        >
          {component.remainingHours.toLocaleString()} h
        </div>
        <div className="text-[10px] text-[#86868B] uppercase tracking-[0.12em] mt-0.5">left</div>
      </div>
    </motion.button>
  );
}
