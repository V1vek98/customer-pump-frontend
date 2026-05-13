"use client";

import { useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ComponentName, PumpComponent } from "@/types";
import { cn } from "@/lib/utils";
import {
  DISASSEMBLY,
  VARIANT_ACCENT,
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

const VARIANT = "generic" as const;
const ACCENT = VARIANT_ACCENT[VARIANT];

export function PumpGeneric(props: Props) {
  const { mode, reduce, blastView = false, highlightedPart = null, showLabels, components, className } = props;
  const rawId = useId();
  const p = rawId.replace(/[^a-zA-Z0-9_-]/g, "");

  if (mode === "glyph") {
    return <GenericGlyph className={className} />;
  }

  const state = (part: ComponentName) => partStateName(part, highlightedPart, blastView);
  const variants = (part: ComponentName, half: "front" | "back" | "single") =>
    partMotionVariants(VARIANT, part, half, reduce);

  const detail = mode === "detail";
  const showSmall = mode === "detail" || mode === "silhouette-color";

  const showCallout = detail && showLabels && (highlightedPart || blastView);
  const callout = showCallout && highlightedPart ? buildCallout(highlightedPart, components) : null;

  return (
    <svg
      viewBox={`0 0 ${VIEW_BOX.width} ${VIEW_BOX.height}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Third-party slurry pump"
      className={cn("w-full h-full overflow-visible", className)}
    >
      <PumpDefs prefix={p} variant={VARIANT} mode={mode} />

      <ellipse cx="220" cy="262" rx="195" ry="13" fill={`url(#${p}-floor)`} />

      <g data-part-floor>
        <rect x="50" y="218" width="76" height="26" rx="2" fill={`url(#${p}-metal-side)`} stroke="rgba(20,22,38,0.32)" strokeWidth="0.9" />
        <rect x="300" y="218" width="100" height="26" rx="2" fill={`url(#${p}-metal-side)`} stroke="rgba(20,22,38,0.32)" strokeWidth="0.9" />
        <rect x="50" y="218" width="76" height="3" fill={`url(#${p}-metal-top)`} opacity="0.85" />
        <rect x="300" y="218" width="100" height="3" fill={`url(#${p}-metal-top)`} opacity="0.85" />
        {showSmall && (
          <>
            <circle cx="68" cy="232" r="2" fill="rgba(20,22,38,0.6)" />
            <circle cx="110" cy="232" r="2" fill="rgba(20,22,38,0.6)" />
            <circle cx="320" cy="232" r="2" fill="rgba(20,22,38,0.6)" />
            <circle cx="380" cy="232" r="2" fill="rgba(20,22,38,0.6)" />
          </>
        )}
      </g>

      <motion.g data-part="bearing_assembly" variants={variants("bearing_assembly", "single")} animate={state("bearing_assembly")} initial={false}>
        <title>Bearing Assembly</title>
        <rect x="292" y="142" width="116" height="76" rx="6" fill={`url(#${p}-metal-top)`} stroke="rgba(20,22,38,0.34)" strokeWidth="1" />
        <rect x="292" y="142" width="116" height="14" rx="6" fill={`url(#${p}-metal-side)`} opacity="0.7" />
        <ellipse cx="404" cy="180" rx="5" ry="34" fill={`url(#${p}-metal-front)`} stroke="rgba(20,22,38,0.30)" strokeWidth="0.7" />
        {showSmall && (
          <>
            <line x1="324" y1="142" x2="324" y2="218" stroke="rgba(20,22,38,0.24)" strokeWidth="0.7" />
            <line x1="376" y1="142" x2="376" y2="218" stroke="rgba(20,22,38,0.24)" strokeWidth="0.7" />
            <circle cx="324" cy="180" r="2.5" fill="rgba(20,22,38,0.45)" />
            <circle cx="376" cy="180" r="2.5" fill="rgba(20,22,38,0.45)" />
            <rect x="336" y="150" width="24" height="3" rx="1.5" fill="rgba(20,22,38,0.6)" />
            <circle cx="396" cy="158" r="2.5" fill="#86C8F0" stroke="rgba(20,22,38,0.45)" strokeWidth="0.5" />
          </>
        )}
      </motion.g>

      <g data-part-frame>
        <rect x="265" y="118" width="22" height="104" rx="1.5" fill={`url(#${p}-metal-front)`} stroke="rgba(20,22,38,0.34)" strokeWidth="0.9" />
        {showSmall && [134, 158, 182, 206].map((cy) => (
          <circle key={cy} cx="276" cy={cy} r="2" fill="rgba(20,22,38,0.55)" />
        ))}
        {showSmall && [128, 162, 196].map((y, i) => (
          <line
            key={i}
            x1="92"
            y1={y}
            x2="265"
            y2={y}
            stroke="rgba(20,22,38,0.42)"
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.85"
          />
        ))}
      </g>

      <motion.g data-part="casing-back" variants={variants("casing", "back")} animate={state("casing")} initial={false}>
        <title>Casing (back half)</title>
        <path
          d="M 168 168
             m -68 0
             a 68 68 0 0 1 136 0
             L 222 168
             a 50 50 0 0 0 -108 0
             Z"
          fill={`url(#${p}-volute-skin)`}
          stroke="rgba(20,22,38,0.34)"
          strokeWidth="1.1"
        />
        <path d="M 218 110 L 246 80 L 264 96 L 236 126 Z" fill={`url(#${p}-volute-skin)`} stroke="rgba(20,22,38,0.30)" strokeWidth="0.9" />
        <path d="M 240 70 L 272 102 L 278 96 L 246 64 Z" fill={`url(#${p}-metal-front)`} stroke="rgba(20,22,38,0.40)" strokeWidth="0.7" />
        {showSmall && [
          [100, 168],
          [122, 108],
          [168, 96],
          [216, 112],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="2" fill="rgba(20,22,38,0.55)" />
        ))}
      </motion.g>

      <motion.g data-part="discharge_liner" variants={variants("discharge_liner", "single")} animate={state("discharge_liner")} initial={false}>
        <title>Discharge Liner</title>
        <path d="M 216 124 L 240 92 L 254 102 L 230 134 Z" fill={`url(#${p}-liner)`} stroke="rgba(20,22,38,0.45)" strokeWidth="0.7" />
      </motion.g>

      <motion.g data-part="suction_liner" variants={variants("suction_liner", "single")} animate={state("suction_liner")} initial={false}>
        <title>Suction Liner</title>
        <ellipse cx="118" cy="168" rx="14" ry="38" fill={`url(#${p}-liner)`} stroke="rgba(20,22,38,0.45)" strokeWidth="0.7" />
        <ellipse cx="118" cy="168" rx="8" ry="30" fill="rgba(20,22,38,0.55)" />
      </motion.g>

      <motion.g data-part="impeller" variants={variants("impeller", "single")} animate={state("impeller")} initial={false}>
        <title>Impeller</title>
        <circle cx="168" cy="166" r="30" fill={`url(#${p}-impeller-hub)`} />
        <circle cx="168" cy="166" r="30" fill="none" stroke="rgba(20,22,38,0.40)" strokeWidth="1" />
        {[0, 72, 144, 216, 288].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const x1 = 168 + Math.cos(rad) * 8;
          const y1 = 166 + Math.sin(rad) * 8;
          const x2 = 168 + Math.cos(rad) * 28;
          const y2 = 166 + Math.sin(rad) * 28;
          const midRad = ((deg + 12) * Math.PI) / 180;
          const mx = 168 + Math.cos(midRad) * 18;
          const my = 166 + Math.sin(midRad) * 18;
          return (
            <path
              key={deg}
              d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
              stroke="#5C6276"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
          );
        })}
        <circle cx="168" cy="166" r="9" fill="#5C6276" />
        <circle cx="168" cy="166" r="9" fill="none" stroke="rgba(20,22,38,0.45)" strokeWidth="0.6" />
        <circle cx="168" cy="166" r="3" fill="#9DA2B0" />
      </motion.g>

      <motion.g data-part="shaft_sleeve" variants={variants("shaft_sleeve", "single")} animate={state("shaft_sleeve")} initial={false}>
        <title>Shaft Sleeve</title>
        <rect x="232" y="162" width="32" height="14" rx="2" fill={`url(#${p}-metal-top)`} stroke="rgba(20,22,38,0.30)" strokeWidth="0.7" />
        <line x1="236" y1="169" x2="260" y2="169" stroke="rgba(20,22,38,0.20)" strokeWidth="0.5" />
      </motion.g>

      <motion.g data-part="casing-front" variants={variants("casing", "front")} animate={state("casing")} initial={false}>
        <title>Casing (front half)</title>
        <path
          d="M 168 168
             m -68 0
             a 68 68 0 0 0 136 0
             L 222 168
             a 50 50 0 0 1 -108 0
             Z"
          fill={`url(#${p}-volute-skin)`}
          stroke="rgba(20,22,38,0.34)"
          strokeWidth="1.1"
        />
        <path d="M 100 168 L 232 168" stroke="rgba(20,22,38,0.22)" strokeWidth="0.7" strokeDasharray="3 3" opacity="0.7" />
        {showSmall && [
          [100, 168],
          [122, 226],
          [168, 234],
          [216, 226],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="2" fill="rgba(20,22,38,0.55)" />
        ))}
        {showSmall && (
          <text x="168" y="208" fontSize="6" fontFamily="var(--font-mono)" fill="rgba(20,22,38,0.42)" letterSpacing="0.18em" textAnchor="middle">
            8 / 6 AH · TYPE
          </text>
        )}
      </motion.g>

      <motion.g data-part="suction_plate" variants={variants("suction_plate", "single")} animate={state("suction_plate")} initial={false}>
        <title>Suction Plate</title>
        <ellipse cx="82" cy="168" rx="13" ry="42" fill={`url(#${p}-metal-front)`} stroke="rgba(20,22,38,0.34)" strokeWidth="1" />
        <ellipse cx="86" cy="168" rx="6" ry="36" fill={`url(#${p}-metal-side)`} opacity="0.85" />
        {showSmall && [132, 152, 168, 184, 204].map((cy) => (
          <circle key={cy} cx="82" cy={cy} r="2" fill="rgba(20,22,38,0.55)" />
        ))}
        <ellipse cx="84" cy="168" rx="8" ry="24" fill={`url(#${p}-liner)`} opacity="0.65" />
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

function GenericGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 28" className={cn("h-full w-full overflow-visible", className)} role="img" aria-label="Third-party pump">
      <ellipse cx="13" cy="14" rx="10" ry="8" fill="#DDE0E6" stroke="rgba(20,22,38,0.34)" strokeWidth="0.9" />
      <circle cx="13" cy="14" r="3.4" fill="#5C6276" />
      <rect x="20" y="11" width="22" height="6" rx="1.2" fill="#C9CDD8" stroke="rgba(20,22,38,0.34)" strokeWidth="0.8" />
      <line x1="8" y1="11" x2="22" y2="11" stroke="rgba(20,22,38,0.5)" strokeWidth="0.7" />
      <line x1="8" y1="14" x2="22" y2="14" stroke="rgba(20,22,38,0.5)" strokeWidth="0.7" />
      <line x1="8" y1="17" x2="22" y2="17" stroke="rgba(20,22,38,0.5)" strokeWidth="0.7" />
      <line x1="3" y1="22" x2="44" y2="22" stroke="rgba(20,22,38,0.5)" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
