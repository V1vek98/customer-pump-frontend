"use client";

import { useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ComponentName, PumpComponent } from "@/types";
import { cn } from "@/lib/utils";
import {
  DISASSEMBLY,
  VARIANT_ACCENT,
  VARIANT_ACCENT_SOFT,
  VIEW_BOX,
  GENERIC_PART_LABELS,
  type RenderMode,
} from "./geometry";
import { partMotionVariants, partStateName } from "./detail-presets";
import { PumpDefs } from "./PumpParts";
import { PumpCallout } from "./PumpCallout";

type Props = {
  highlightedPart?: ComponentName | null;
  blastView?: boolean;
  mode: RenderMode;
  reduce: boolean;
  showLabels: boolean;
  isThirdParty?: boolean;
  components?: PumpComponent[];
  className?: string;
};

const VARIANT = "lcc" as const;
const ACCENT = VARIANT_ACCENT[VARIANT];
const ACCENT_SOFT = VARIANT_ACCENT_SOFT[VARIANT];

export function PumpLCC(props: Props) {
  const { mode, reduce, blastView = false, highlightedPart = null, showLabels, components, className } = props;
  const rawId = useId();
  const p = rawId.replace(/[^a-zA-Z0-9_-]/g, "");

  if (mode === "glyph") {
    return <LCCGlyph className={className} />;
  }

  const state = (part: ComponentName) => partStateName(part, highlightedPart, blastView);
  const variants = (part: ComponentName, half: "front" | "back" | "single") =>
    partMotionVariants(VARIANT, part, half, reduce);

  const detail = mode === "detail";
  const showSmall = mode === "detail" || mode === "silhouette-color";

  const showCallout = detail && showLabels && highlightedPart;
  const callout = showCallout ? buildCallout(highlightedPart!, components) : null;

  return (
    <svg
      viewBox={`0 0 ${VIEW_BOX.width} ${VIEW_BOX.height}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="LCC slurry pump"
      className={cn("w-full h-full overflow-visible", className)}
    >
      <PumpDefs prefix={p} variant={VARIANT} mode={mode} />

      <ellipse cx="220" cy="262" rx="180" ry="13" fill={`url(#${p}-floor)`} />

      <g data-part-floor>
        <rect x="60" y="220" width="324" height="20" rx="3" fill={`url(#${p}-metal-side)`} stroke="rgba(20,22,38,0.22)" strokeWidth="0.8" />
        <rect x="60" y="220" width="324" height="3" fill={`url(#${p}-metal-top)`} opacity="0.85" />
        {showSmall && [
          [86, 240], [86, 244],
          [216, 240], [216, 244],
          [346, 240], [346, 244],
        ].map(([x, y], i) => (
          <rect key={i} x={x - 8} y={y} width="16" height="6" rx="1" fill={`url(#${p}-metal-side)`} stroke="rgba(20,22,38,0.34)" strokeWidth="0.6" />
        ))}
      </g>

      <motion.g data-part="bearing_assembly" variants={variants("bearing_assembly", "single")} animate={state("bearing_assembly")} initial={false}>
        <title>Bearing Assembly</title>
        <rect x="200" y="194" width="184" height="26" rx="4" fill={`url(#${p}-metal-side)`} stroke="rgba(20,22,38,0.32)" strokeWidth="0.8" />
        <rect x="208" y="144" width="172" height="52" rx="14" fill={`url(#${p}-metal-top)`} stroke="rgba(20,22,38,0.28)" strokeWidth="0.9" />
        <rect x="208" y="144" width="172" height="13" rx="14" fill={`url(#${p}-metal-side)`} opacity="0.7" />
        <ellipse cx="380" cy="170" rx="6" ry="26" fill={`url(#${p}-metal-front)`} stroke="rgba(20,22,38,0.28)" strokeWidth="0.7" />
        {showSmall && (
          <>
            <line x1="244" y1="144" x2="244" y2="196" stroke="rgba(20,22,38,0.22)" strokeWidth="0.7" />
            <line x1="312" y1="144" x2="312" y2="196" stroke="rgba(20,22,38,0.22)" strokeWidth="0.7" />
            <circle cx="244" cy="170" r="2.5" fill="rgba(20,22,38,0.45)" />
            <circle cx="312" cy="170" r="2.5" fill="rgba(20,22,38,0.45)" />
            <rect x="256" y="150" width="22" height="3" rx="1.5" fill="rgba(20,22,38,0.6)" />
            <rect x="328" y="150" width="22" height="3" rx="1.5" fill="rgba(20,22,38,0.6)" />
            <circle cx="372" cy="156" r="2.5" fill="#86C8F0" stroke="rgba(20,22,38,0.45)" strokeWidth="0.5" />
          </>
        )}
      </motion.g>

      <motion.g data-part="casing-back" variants={variants("casing", "back")} animate={state("casing")} initial={false}>
        <title>Casing (back half)</title>
        <path
          d="M 150 168
             m -64 0
             a 64 64 0 0 1 128 0
             L 200 168
             a 50 50 0 0 0 -100 0
             Z"
          fill={`url(#${p}-volute-skin)`}
          stroke="rgba(20,22,38,0.32)"
          strokeWidth="1"
        />
        <rect x="138" y="80" width="24" height="32" rx="2" fill={`url(#${p}-metal-top)`} stroke="rgba(20,22,38,0.30)" strokeWidth="0.9" />
        <rect x="130" y="62" width="40" height="22" rx="2" fill={ACCENT} fillOpacity="0.92" stroke="rgba(20,22,38,0.40)" strokeWidth="0.7" />
        {showSmall && [136, 144, 156, 164].map((cx) => (
          <circle key={cx} cx={cx} cy="73" r="1.6" fill="rgba(20,22,38,0.65)" />
        ))}
        {showSmall && [
          [88, 158],
          [108, 100],
          [150, 86],
          [192, 100],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="1.8" fill="rgba(20,22,38,0.6)" />
        ))}
      </motion.g>

      <motion.g data-part="discharge_liner" variants={variants("discharge_liner", "single")} animate={state("discharge_liner")} initial={false}>
        <title>Discharge Liner</title>
        <rect x="142" y="92" width="16" height="32" rx="1" fill={`url(#${p}-liner)`} stroke="rgba(20,22,38,0.45)" strokeWidth="0.7" />
      </motion.g>

      <motion.g data-part="suction_liner" variants={variants("suction_liner", "single")} animate={state("suction_liner")} initial={false}>
        <title>Suction Liner</title>
        <ellipse cx="112" cy="168" rx="12" ry="32" fill={`url(#${p}-liner)`} stroke="rgba(20,22,38,0.45)" strokeWidth="0.7" />
        <ellipse cx="112" cy="168" rx="7" ry="24" fill="rgba(20,22,38,0.55)" />
      </motion.g>

      <motion.g data-part="impeller" variants={variants("impeller", "single")} animate={state("impeller")} initial={false}>
        <title>Impeller</title>
        <circle cx="156" cy="168" r="28" fill={`url(#${p}-impeller-hub)`} />
        <circle cx="156" cy="168" r="28" fill="none" stroke={ACCENT} strokeOpacity="0.55" strokeWidth="1" />
        {[0, 72, 144, 216, 288].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const x1 = 156 + Math.cos(rad) * 7;
          const y1 = 168 + Math.sin(rad) * 7;
          const x2 = 156 + Math.cos(rad) * 26;
          const y2 = 168 + Math.sin(rad) * 26;
          const midRad = ((deg + 14) * Math.PI) / 180;
          const mx = 156 + Math.cos(midRad) * 17;
          const my = 168 + Math.sin(midRad) * 17;
          return (
            <path
              key={deg}
              d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
              stroke={`url(#${p}-impeller-vane)`}
              strokeWidth="2.7"
              strokeLinecap="round"
              fill="none"
            />
          );
        })}
        <circle cx="156" cy="168" r="8" fill={ACCENT} />
        <circle cx="156" cy="168" r="8" fill="none" stroke="rgba(20,22,38,0.45)" strokeWidth="0.6" />
        <circle cx="156" cy="168" r="2.6" fill={ACCENT_SOFT} />
      </motion.g>

      <motion.g data-part="shaft_sleeve" variants={variants("shaft_sleeve", "single")} animate={state("shaft_sleeve")} initial={false}>
        <title>Shaft Sleeve</title>
        <rect x="214" y="162" width="22" height="14" rx="2" fill={`url(#${p}-metal-top)`} stroke="rgba(20,22,38,0.30)" strokeWidth="0.7" />
        <line x1="218" y1="169" x2="232" y2="169" stroke="rgba(20,22,38,0.18)" strokeWidth="0.5" />
      </motion.g>

      <motion.g data-part="casing-front" variants={variants("casing", "front")} animate={state("casing")} initial={false}>
        <title>Casing (front half)</title>
        <path
          d="M 150 168
             m -64 0
             a 64 64 0 0 0 128 0
             L 200 168
             a 50 50 0 0 1 -100 0
             Z"
          fill={`url(#${p}-volute-skin)`}
          stroke="rgba(20,22,38,0.32)"
          strokeWidth="1"
        />
        <path
          d="M 88 168 L 213 168"
          stroke="rgba(20,22,38,0.18)"
          strokeWidth="0.7"
          strokeDasharray="3 3"
          opacity="0.7"
        />
        {showSmall && [
          [88, 168],
          [108, 230],
          [150, 240],
          [192, 230],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="1.8" fill="rgba(20,22,38,0.6)" />
        ))}
        {showSmall && (
          <text x="150" y="208" fontSize="6" fontFamily="var(--font-mono)" fill="rgba(20,22,38,0.42)" letterSpacing="0.18em" textAnchor="middle">
            LCC · GEN 2
          </text>
        )}
      </motion.g>

      <motion.g data-part="suction_plate" variants={variants("suction_plate", "single")} animate={state("suction_plate")} initial={false}>
        <title>Suction Plate</title>
        <ellipse cx="74" cy="168" rx="12" ry="40" fill={`url(#${p}-metal-front)`} stroke="rgba(20,22,38,0.32)" strokeWidth="0.9" />
        <ellipse cx="78" cy="168" rx="6" ry="34" fill={`url(#${p}-metal-side)`} opacity="0.85" />
        {showSmall && [136, 152, 168, 184, 200].map((cy) => (
          <circle key={cy} cx="74" cy={cy} r="1.8" fill="rgba(20,22,38,0.55)" />
        ))}
        <ellipse cx="76" cy="168" rx="8" ry="22" fill={`url(#${p}-liner)`} opacity="0.65" />
      </motion.g>

      <AnimatePresence>
        {callout && (
          <PumpCallout
            key={highlightedPart}
            anchor={callout.anchor}
            axis={callout.axis}
            distance={callout.distance}
            labelOffset={callout.labelOffset}
            displayName={callout.displayName}
            partNumber={callout.partNumber}
            accent={ACCENT}
          />
        )}
      </AnimatePresence>
    </svg>
  );
}

function buildCallout(part: ComponentName, components: PumpComponent[] | undefined) {
  const entry = DISASSEMBLY[VARIANT][part];
  const comp = components?.find((c) => c.name === part);
  const labels = comp ?? GENERIC_PART_LABELS[part];
  return {
    anchor: entry.anchor,
    axis: entry.axis,
    distance: entry.distance,
    labelOffset: entry.labelOffset,
    displayName: labels.displayName,
    partNumber: labels.partNumber,
  };
}

function LCCGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 28" className={cn("h-full w-full overflow-visible", className)} role="img" aria-label="LCC pump">
      <circle cx="11" cy="14" r="7" fill="#DDE0E6" stroke="rgba(20,22,38,0.34)" strokeWidth="0.9" />
      <circle cx="11" cy="14" r="3" fill={ACCENT} />
      <rect x="9" y="3" width="4" height="5" rx="0.4" fill={ACCENT} opacity="0.7" />
      <rect x="18" y="11" width="24" height="6" rx="1.4" fill="#C9CDD8" stroke="rgba(20,22,38,0.34)" strokeWidth="0.8" />
      <line x1="3" y1="22" x2="44" y2="22" stroke="rgba(20,22,38,0.5)" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
