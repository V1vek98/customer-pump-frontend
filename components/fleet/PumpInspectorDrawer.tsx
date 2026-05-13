"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { PumpComponent } from "@/types";
import { formatDate, formatRelative } from "@/lib/format";
import { healthColorHex } from "@/lib/health";
import { HealthRing } from "./HealthRing";
import { RunHoursSparkline } from "./RunHoursSparkline";
import { GlassButton } from "@/components/primitives/GlassButton";
import { X, ShoppingCart, Clock } from "lucide-react";
import { toast } from "sonner";

type Props = {
  component: PumpComponent;
  onClose: () => void;
};

const POP_EASE = [0.16, 1, 0.3, 1] as const;

export function PumpInspectorDrawer({ component, onClose }: Props) {
  const reduce = useReducedMotion();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <motion.div
        aria-hidden
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduce ? 0.08 : 0.15, ease: "linear" }}
        className="fixed inset-0 z-40 bg-[#1D1D1F]/25"
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <motion.aside
          role="dialog"
          aria-modal="true"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
          animate={
            reduce
              ? { opacity: 1, transition: { duration: 0.1 } }
              : { opacity: 1, scale: 1, transition: { duration: 0.18, ease: POP_EASE } }
          }
          exit={
            reduce
              ? { opacity: 0, transition: { duration: 0.08 } }
              : { opacity: 0, scale: 0.96, transition: { duration: 0.13, ease: POP_EASE } }
          }
          className="pointer-events-auto w-full max-w-[420px] max-h-[85vh] rounded-[28px] overflow-hidden flex flex-col glass-liquid"
        >
          <DrawerBody component={component} onClose={onClose} />
        </motion.aside>
      </div>
    </>
  );
}

function DrawerBody({ component, onClose }: { component: PumpComponent; onClose: () => void }) {
  const color = healthColorHex(component.healthPercent);
  return (
    <>
      <div className="relative px-5 pt-5 pb-4 flex items-start justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <HealthRing percent={component.healthPercent} size={48} strokeWidth={3.5} showLabel />
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.18em] text-[#86868B]">Wear part</div>
            <h3 className="text-[18px] font-semibold text-[#1D1D1F] leading-tight truncate">
              {component.displayName}
            </h3>
            <div className="num text-[11px] text-[#86868B] mt-0.5 truncate">
              {component.partNumber}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close inspector"
          className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-black/[0.05] text-[#424245] hover:text-[#1D1D1F] shrink-0 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="mx-5 h-px bg-black/[0.07]" />

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Tile
            label="Installed"
            value={formatDate(component.installedAt)}
            sub={formatRelative(component.installedAt)}
          />
          <Tile
            label="Last inspected"
            value={formatRelative(component.lastInspectedAt)}
            sub={formatDate(component.lastInspectedAt)}
          />
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-[#86868B] mb-2">
            Remaining life
          </div>
          <div className="glass-pane-strong p-4 flex items-baseline gap-2">
            <span
              className="num text-[34px] font-semibold tabular-nums leading-none"
              style={{ color }}
            >
              {component.remainingHours.toLocaleString()}
            </span>
            <span className="text-[12px] text-[#86868B]">hours</span>
            <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-[#86868B]">
              <Clock className="h-3 w-3" />~ {Math.max(1, Math.round(component.remainingHours / 720))} mo
            </span>
          </div>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-[#86868B] mb-2">Wear trend</div>
          <div className="h-24 glass-pane p-3">
            <RunHoursSparkline values={component.wearTrend} color={color} />
          </div>
          <p className="text-[11px] text-[#86868B] mt-2">12 readings · sampled monthly</p>
        </div>
      </div>

      <div className="px-5 pt-4 pb-5 flex gap-2 border-t border-black/[0.07]">
        <GlassButton
          variant="primary"
          className="flex-1"
          onClick={() => toast.success(`${component.displayName} replacement requested`)}
        >
          <ShoppingCart className="h-4 w-4" />
          Order replacement
        </GlassButton>
        <GlassButton onClick={() => toast.success("Inspection logged")}>Log inspection</GlassButton>
      </div>
    </>
  );
}

function Tile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="glass-pane-strong p-3">
      <div className="text-[10px] uppercase tracking-[0.16em] text-[#86868B]">{label}</div>
      <div className="text-[14px] text-[#1D1D1F] mt-1.5">{value}</div>
      {sub && <div className="num text-[11px] text-[#86868B] mt-0.5">{sub}</div>}
    </div>
  );
}
