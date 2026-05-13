"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Pump } from "@/types";
import { overallHealth, shortestRemaining } from "@/lib/health";
import { formatHours, pumpStatusLabel } from "@/lib/format";
import { PumpRenderer } from "./PumpRenderer";
import { HealthRing } from "./HealthRing";
import { StatusDot } from "./StatusDot";
import { MapPin } from "lucide-react";

export function PumpCard({ pump }: { pump: Pump }) {
  const health = pump.isThirdParty ? null : overallHealth(pump);
  const nextService = pump.isThirdParty ? null : shortestRemaining(pump);
  const isKsb = !pump.isThirdParty;

  return (
    <Link
      href={`/fleet/${pump.id}`}
      className="group block w-full text-left focus-visible:outline-none cursor-pointer"
    >
      <div
        className={cn(
          "relative rounded-3xl overflow-hidden",
          "bg-white/65 border border-black/[0.06] backdrop-blur-2xl",
          "shadow-[0_1px_0_0_rgba(255,255,255,0.7)_inset,0_8px_24px_-12px_rgba(40,40,60,0.16)]",
          "transition-[transform,box-shadow,border-color] duration-200 ease-out",
          "group-hover:-translate-y-1 group-hover:border-black/[0.10]",
          "group-hover:shadow-[0_1px_0_0_rgba(255,255,255,0.85)_inset,0_28px_60px_-18px_rgba(40,40,60,0.28),0_0_0_1px_rgba(255,194,51,0.12)]",
          "group-active:scale-[0.985]"
        )}
      >
        {isKsb && (
          <div
            className="absolute top-0 left-0 h-12 w-12 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at top left, rgba(255,194,51,0.42), transparent 70%)",
            }}
          />
        )}
        {!isKsb && (
          <div className="absolute top-3 right-3 px-1.5 h-5 inline-flex items-center rounded-md border border-black/[0.10] bg-white/80 text-[9px] font-semibold tracking-[0.18em] text-[#6E6E73]">
            3P
          </div>
        )}

        <div className="relative h-32 w-full bg-gradient-to-b from-white/45 to-transparent">
          <PumpRenderer
            variant={pump.imageVariant}
            isThirdParty={!isKsb}
            size="card"
            className="px-6 pt-2"
          />
        </div>

        <div className="px-5 pb-5 pt-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <h3 className="text-[15px] font-semibold text-[#1D1D1F] truncate">{pump.model}</h3>
                {!isKsb && (
                  <span className="text-[10px] text-[#86868B] uppercase tracking-[0.14em]">
                    {pump.manufacturer}
                  </span>
                )}
              </div>
              <p className="text-[12px] text-[#6E6E73] truncate mt-0.5">{pump.nickname}</p>
            </div>
            <StatusDot status={pump.status} withLabel={false} />
          </div>

          <div className="mt-4 flex items-center gap-4">
            {health !== null ? (
              <HealthRing percent={health} size={42} strokeWidth={3.5} />
            ) : (
              <div className="h-[42px] w-[42px] rounded-full border border-dashed border-black/15 flex items-center justify-center">
                <span className="text-[9px] text-[#A1A1A6] num">—</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span className="num text-[15px] font-semibold text-[#1D1D1F] tabular-nums">
                  {formatHours(pump.totalRunHours)}
                </span>
                <span className="text-[10px] text-[#86868B] uppercase tracking-[0.12em]">total</span>
              </div>
              <div className="mt-1 flex items-center gap-1 min-w-0">
                <MapPin className="h-3 w-3 text-[#A1A1A6] shrink-0" />
                <span className="text-[11px] text-[#6E6E73] truncate">{pump.location}</span>
              </div>
            </div>
          </div>

          <div className="hairline my-4 opacity-80" />

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#86868B]">
              {pump.isThirdParty ? "Component health unavailable" : "Next service in"}
            </span>
            <span
              className="num font-medium"
              style={{
                color: nextService
                  ? nextService.healthPercent < 35
                    ? "#D70015"
                    : nextService.healthPercent < 70
                      ? "#C77800"
                      : "#1D1D1F"
                  : "#A1A1A6",
              }}
            >
              {nextService
                ? `~${nextService.remainingHours.toLocaleString()} h`
                : pumpStatusLabel(pump.status)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
