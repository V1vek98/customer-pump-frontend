"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { Pump, ComponentName, PumpComponent } from "@/types";
import { overallHealth } from "@/lib/health";
import { formatDate, formatRelative } from "@/lib/format";
import { PumpRenderer } from "./PumpRenderer";
import { PumpBlastToggle } from "./pump";
import { HealthRing } from "./HealthRing";
import { StatusDot } from "./StatusDot";
import { ComponentRow } from "./ComponentRow";
import { RunHoursSparkline } from "./RunHoursSparkline";
import { GlassButton } from "@/components/primitives/GlassButton";
import { PumpInspectorDrawer } from "./PumpInspectorDrawer";
import { MapPin, Wrench, FileText, Sparkles, ChevronRight } from "lucide-react";
import { toast } from "sonner";

type Props = { pump: Pump };

export function PumpDetailPane({ pump }: Props) {
  const [highlighted, setHighlighted] = useState<ComponentName | null>(null);
  const [inspector, setInspector] = useState<PumpComponent | null>(null);
  const [blastView, setBlastView] = useState<boolean>(false);

  const isKsb = !pump.isThirdParty;
  const health = isKsb ? overallHealth(pump) : null;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (inspector) return; // let the drawer handle its own Escape
      if (blastView || highlighted) {
        e.stopPropagation();
        setBlastView(false);
        setHighlighted(null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [blastView, highlighted, inspector]);

  return (
    <div className="relative flex-1 min-w-0">
      <div className="relative rounded-3xl overflow-hidden glass-strong">
        {isKsb && (
          <div
            className="absolute -top-10 -left-10 h-40 w-40 pointer-events-none z-10"
            style={{
              background:
                "radial-gradient(circle, rgba(255,194,51,0.40), transparent 70%)",
              filter: "blur(10px)",
            }}
          />
        )}

        {/* HERO */}
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-6 p-6 md:p-8 border-b border-black/[0.06]">
          <div className="relative aspect-[16/10] rounded-2xl bg-gradient-to-br from-white/80 to-white/40 border border-black/[0.06] overflow-hidden flex items-center justify-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)]">
            <PumpRenderer
              variant={pump.imageVariant}
              isThirdParty={!isKsb}
              highlightedPart={highlighted}
              blastView={blastView}
              showLabels
              components={pump.components}
              size="hero"
              className="px-8 py-4"
            />
            <PumpBlastToggle
              blastView={blastView}
              onChange={setBlastView}
              className="absolute top-3 right-3"
            />
            <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-[#86868B] num">
              <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: isKsb ? "#E6A810" : "#A1A1A6" }} />
              {pump.imageVariant} · isometric
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] uppercase tracking-[0.18em] text-[#86868B]">
                {pump.manufacturer}
              </span>
              {!isKsb && (
                <span className="px-1.5 h-5 inline-flex items-center rounded-md border border-black/[0.10] bg-white/70 text-[9px] font-semibold tracking-[0.18em] text-[#6E6E73]">
                  3P
                </span>
              )}
            </div>
            <h2 className="text-[28px] font-semibold tracking-tight text-[#1D1D1F] mt-1 leading-tight">
              {pump.model}
            </h2>
            {pump.nickname && (
              <p className="text-[15px] text-[#424245] mt-1">&quot;{pump.nickname}&quot;</p>
            )}

            <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3">
              <Field label="Serial" value={pump.serial} mono />
              <Field label="Status" custom={<StatusDot status={pump.status} />} />
              <Field
                label="Location"
                value={pump.location}
                icon={<MapPin className="h-3 w-3 text-[#A1A1A6]" />}
              />
              <Field
                label="Installed"
                value={`${formatDate(pump.installedAt)} · ${formatRelative(pump.installedAt)}`}
              />
            </div>

            <div className="hairline my-5" />

            <div className="flex items-end gap-6">
              <div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-[#86868B]">
                  Total run hours
                </div>
                <div className="num text-[36px] font-semibold tabular-nums text-[#1D1D1F] leading-none mt-1.5">
                  {pump.totalRunHours.toLocaleString()}
                </div>
              </div>
              {health !== null && (
                <div className="flex items-center gap-3">
                  <HealthRing percent={health} size={56} strokeWidth={4} showLabel />
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-[#86868B]">
                      Overall health
                    </div>
                    <div className="text-[13px] text-[#424245] mt-1">
                      {health >= 80
                        ? "Operating cleanly"
                        : health >= 60
                          ? "Wearing on schedule"
                          : health >= 35
                            ? "Inspection recommended"
                            : "Service due"}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <GlassButton
                variant="primary"
                onClick={() => toast.success("Quote request sent to your KSB rep")}
              >
                <Wrench className="h-4 w-4" />
                {isKsb ? "Request service quote" : "Request GIW assessment"}
              </GlassButton>
              <GlassButton onClick={() => toast.success("Inspection scheduled")}>
                <FileText className="h-4 w-4" />
                Schedule inspection
              </GlassButton>
            </div>
          </div>
        </div>

        {/* COMPONENTS */}
        <div className="p-6 md:p-8 border-b border-black/[0.06]">
          <div className="flex items-baseline justify-between mb-4">
            <h3 className="text-[18px] font-semibold text-[#1D1D1F]">Wear parts</h3>
            <span className="text-[11px] text-[#86868B]">
              Hover a wear part to lift it from the assembly.
            </span>
          </div>

          {isKsb ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {pump.components.map((c) => (
                <ComponentRow
                  key={c.id}
                  component={c}
                  onHover={setHighlighted}
                  onClick={() => setInspector(c)}
                />
              ))}
            </div>
          ) : (
            <ThirdPartySurveyCTA />
          )}
        </div>

        {/* TIMELINE */}
        <div className="p-6 md:p-8">
          <div className="flex items-baseline justify-between mb-3">
            <h3 className="text-[16px] font-semibold text-[#1D1D1F]">
              Run hours · last 12 weeks
            </h3>
            <span className="num text-[11px] text-[#86868B]">
              + {Math.round(pump.totalRunHours * 0.06).toLocaleString()} h
            </span>
          </div>
          <div className="h-32 rounded-2xl border border-black/[0.06] bg-white/55 p-4">
            <RunHoursSparkline
              values={
                pump.components.length > 0
                  ? pump.components[0].wearTrend.map((v, i) => 100 - v + i * 4)
                  : Array.from({ length: 12 }, (_, i) => 40 + i * 6 + Math.sin(i) * 5)
              }
              color={isKsb ? "#E6A810" : "#86868B"}
            />
          </div>
        </div>
      </div>

      <p className="text-center text-[10px] text-[#A1A1A6] mt-3">
        press{" "}
        <kbd className="px-1.5 py-0.5 rounded border border-black/[0.10] text-[#6E6E73] bg-white/60">
          j / k
        </kbd>{" "}
        to step through pumps ·{" "}
        <kbd className="px-1.5 py-0.5 rounded border border-black/[0.10] text-[#6E6E73] bg-white/60">
          esc
        </kbd>{" "}
        back to fleet
      </p>

      <AnimatePresence>
        {inspector && (
          <PumpInspectorDrawer
            key={inspector.id}
            component={inspector}
            onClose={() => setInspector(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({
  label,
  value,
  custom,
  mono,
  icon,
}: {
  label: string;
  value?: string;
  custom?: React.ReactNode;
  mono?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] uppercase tracking-[0.16em] text-[#86868B] mb-1">{label}</div>
      {custom ? (
        custom
      ) : (
        <div className="flex items-center gap-1.5 min-w-0">
          {icon}
          <span className={`text-[13px] text-[#1D1D1F] truncate ${mono ? "num" : ""}`}>
            {value}
          </span>
        </div>
      )}
    </div>
  );
}

function ThirdPartySurveyCTA() {
  return (
    <div className="rounded-2xl border border-dashed border-black/[0.14] bg-gradient-to-br from-white/70 to-white/40 px-5 py-6 flex items-start gap-4">
      <div className="h-10 w-10 rounded-xl bg-[#FFC233]/20 border border-[#FFC233]/40 flex items-center justify-center shrink-0">
        <Sparkles className="h-5 w-5 text-[#C77800]" />
      </div>
      <div className="flex-1">
        <h4 className="text-[15px] font-medium text-[#1D1D1F]">
          Component-level health not available
        </h4>
        <p className="text-[13px] text-[#424245] mt-1 max-w-md">
          GIW can survey this pump on-site and add full wear-part telemetry — even though it&apos;s
          not ours. Same interface, same alerts, same maintenance planning.
        </p>
      </div>
      <GlassButton
        size="sm"
        variant="primary"
        onClick={() => toast.success("Survey request submitted")}
      >
        Request a survey
        <ChevronRight className="h-3.5 w-3.5" />
      </GlassButton>
    </div>
  );
}
