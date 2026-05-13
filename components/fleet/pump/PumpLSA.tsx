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

const VARIANT = "lsa" as const;
const ACCENT = VARIANT_ACCENT[VARIANT];
const ACCENT_SOFT = VARIANT_ACCENT_SOFT[VARIANT];

export function PumpLSA(props: Props) {
  const { mode, reduce, blastView = false, highlightedPart = null, showLabels, components, className } = props;
  const rawId = useId();
  const p = rawId.replace(/[^a-zA-Z0-9_-]/g, "");

  if (mode === "glyph") {
    return <LSAGlyph className={className} />;
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
      aria-label="LSA slurry pump"
      className={cn("w-full h-full overflow-visible", className)}
    >
      <PumpDefs prefix={p} variant={VARIANT} mode={mode} />

      <ellipse cx="240" cy="262" rx="206" ry="14" fill={`url(#${p}-floor)`} />

      <g data-part-floor>
        <rect x="44" y="218" width="392" height="22" rx="3" fill={`url(#${p}-metal-side)`} stroke="rgba(20,22,38,0.22)" strokeWidth="0.8" />
        <rect x="44" y="218" width="392" height="3" fill={`url(#${p}-metal-top)`} opacity="0.85" />
        <line x1="56" y1="234" x2="424" y2="234" stroke="rgba(20,22,38,0.12)" strokeWidth="0.6" strokeDasharray="2 4" />
        {showSmall && [70, 150, 230, 310, 390].map((x) => (
          <circle key={x} cx={x} cy="237" r="2" fill="rgba(20,22,38,0.45)" />
        ))}
      </g>

      <motion.g data-part="bearing_assembly" variants={variants("bearing_assembly", "single")} animate={state("bearing_assembly")} initial={false}>
        <title>Bearing Assembly</title>
        <rect x="270" y="190" width="124" height="30" rx="5" fill={`url(#${p}-metal-side)`} stroke="rgba(20,22,38,0.32)" strokeWidth="0.8" />
        <rect x="276" y="142" width="112" height="56" rx="14" fill={`url(#${p}-metal-top)`} stroke="rgba(20,22,38,0.28)" strokeWidth="0.9" />
        <rect x="276" y="142" width="112" height="14" rx="14" fill={`url(#${p}-metal-side)`} opacity="0.7" />
        <ellipse cx="388" cy="170" rx="6" ry="28" fill={`url(#${p}-metal-front)`} stroke="rgba(20,22,38,0.28)" strokeWidth="0.7" />
        {showSmall && (
          <>
            <line x1="306" y1="142" x2="306" y2="198" stroke="rgba(20,22,38,0.22)" strokeWidth="0.7" />
            <line x1="356" y1="142" x2="356" y2="198" stroke="rgba(20,22,38,0.22)" strokeWidth="0.7" />
            <circle cx="306" cy="170" r="2.5" fill="rgba(20,22,38,0.45)" />
            <circle cx="356" cy="170" r="2.5" fill="rgba(20,22,38,0.45)" />
            <rect x="318" y="148" width="22" height="3" rx="1.5" fill="rgba(20,22,38,0.6)" />
            <circle cx="382" cy="156" r="2.5" fill="#86C8F0" stroke="rgba(20,22,38,0.45)" strokeWidth="0.5" />
          </>
        )}
      </motion.g>

      <motion.g data-part="casing-back" variants={variants("casing", "back")} animate={state("casing")} initial={false}>
        <title>Casing (back half)</title>
        <path
          d="M 180 158
             m -82 0
             a 82 82 0 0 1 164 0
             L 250 158
             a 58 58 0 0 0 -116 0
             Z"
          fill={`url(#${p}-volute-skin)`}
          stroke="rgba(20,22,38,0.32)"
          strokeWidth="1"
        />
        <path
          d="M 234 102 L 282 54 L 304 76 L 256 124 Z"
          fill={`url(#${p}-volute-skin)`}
          stroke="rgba(20,22,38,0.30)"
          strokeWidth="0.9"
        />
        <path
          d="M 270 42 L 314 86 L 320 80 L 276 36 Z"
          fill={ACCENT}
          fillOpacity="0.92"
          stroke="rgba(20,22,38,0.40)"
          strokeWidth="0.7"
        />
        {showSmall && [
          [98, 158],
          [120, 88],
          [180, 76],
          [240, 96],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="2" fill="rgba(20,22,38,0.6)" />
        ))}
      </motion.g>

      <motion.g data-part="discharge_liner" variants={variants("discharge_liner", "single")} animate={state("discharge_liner")} initial={false}>
        <title>Discharge Liner</title>
        <path
          d="M 232 116
             L 268 80
             L 282 92
             L 246 130 Z"
          fill={`url(#${p}-liner)`}
          stroke="rgba(20,22,38,0.45)"
          strokeWidth="0.7"
        />
      </motion.g>

      <motion.g data-part="suction_liner" variants={variants("suction_liner", "single")} animate={state("suction_liner")} initial={false}>
        <title>Suction Liner</title>
        <ellipse cx="138" cy="158" rx="14" ry="36" fill={`url(#${p}-liner)`} stroke="rgba(20,22,38,0.45)" strokeWidth="0.7" />
        <ellipse cx="138" cy="158" rx="9" ry="28" fill="rgba(20,22,38,0.55)" />
      </motion.g>

      <motion.g data-part="impeller" variants={variants("impeller", "single")} animate={state("impeller")} initial={false}>
        <title>Impeller</title>
        <circle cx="196" cy="158" r="32" fill={`url(#${p}-impeller-hub)`} />
        <circle cx="196" cy="158" r="32" fill="none" stroke={ACCENT} strokeOpacity="0.55" strokeWidth="1" />
        {[0, 72, 144, 216, 288].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const x1 = 196 + Math.cos(rad) * 8;
          const y1 = 158 + Math.sin(rad) * 8;
          const x2 = 196 + Math.cos(rad) * 30;
          const y2 = 158 + Math.sin(rad) * 30;
          const midRad = ((deg + 12) * Math.PI) / 180;
          const mx = 196 + Math.cos(midRad) * 20;
          const my = 158 + Math.sin(midRad) * 20;
          return (
            <path
              key={deg}
              d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
              stroke={`url(#${p}-impeller-vane)`}
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          );
        })}
        <circle cx="196" cy="158" r="9" fill={ACCENT} />
        <circle cx="196" cy="158" r="9" fill="none" stroke="rgba(20,22,38,0.45)" strokeWidth="0.6" />
        <circle cx="196" cy="158" r="3" fill={ACCENT_SOFT} />
      </motion.g>

      <motion.g data-part="shaft_sleeve" variants={variants("shaft_sleeve", "single")} animate={state("shaft_sleeve")} initial={false}>
        <title>Shaft Sleeve</title>
        <rect x="252" y="152" width="32" height="14" rx="2" fill={`url(#${p}-metal-top)`} stroke="rgba(20,22,38,0.30)" strokeWidth="0.7" />
        <line x1="256" y1="159" x2="280" y2="159" stroke="rgba(20,22,38,0.18)" strokeWidth="0.5" />
      </motion.g>

      <motion.g data-part="casing-front" variants={variants("casing", "front")} animate={state("casing")} initial={false}>
        <title>Casing (front half)</title>
        <path
          d="M 180 158
             m -82 0
             a 82 82 0 0 0 164 0
             L 250 158
             a 58 58 0 0 1 -116 0
             Z"
          fill={`url(#${p}-volute-skin)`}
          stroke="rgba(20,22,38,0.32)"
          strokeWidth="1"
        />
        <path
          d="M 98 158 L 262 158"
          stroke="rgba(20,22,38,0.28)"
          strokeWidth="0.8"
          strokeDasharray="0"
        />
        {showSmall && [
          [98, 158],
          [120, 228],
          [180, 240],
          [240, 220],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="2" fill="rgba(20,22,38,0.6)" />
        ))}
        {showSmall && (
          <text x="178" y="206" fontSize="6" fontFamily="var(--font-mono)" fill="rgba(20,22,38,0.42)" letterSpacing="0.18em">
            LSA · AXIAL SPLIT
          </text>
        )}
      </motion.g>

      <motion.g data-part="suction_plate" variants={variants("suction_plate", "single")} animate={state("suction_plate")} initial={false}>
        <title>Suction Plate</title>
        <ellipse cx="96" cy="158" rx="14" ry="44" fill={`url(#${p}-metal-front)`} stroke="rgba(20,22,38,0.32)" strokeWidth="0.9" />
        <ellipse cx="100" cy="158" rx="6" ry="38" fill={`url(#${p}-metal-side)`} opacity="0.85" />
        {showSmall && [122, 142, 158, 174, 194].map((cy) => (
          <circle key={cy} cx="96" cy={cy} r="2" fill="rgba(20,22,38,0.55)" />
        ))}
        <ellipse cx="98" cy="158" rx="9" ry="26" fill={`url(#${p}-liner)`} opacity="0.65" />
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

function LSAGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 28" className={cn("h-full w-full overflow-visible", className)} role="img" aria-label="LSA pump">
      <ellipse cx="14" cy="14" rx="11" ry="9" fill="#DDE0E6" stroke="rgba(20,22,38,0.34)" strokeWidth="0.9" />
      <circle cx="14" cy="14" r="4" fill={ACCENT} />
      <path d="M 22 8 L 27 3 L 30 6 L 25 11 Z" fill={ACCENT} opacity="0.7" />
      <rect x="24" y="11" width="18" height="6" rx="1.2" fill="#C9CDD8" stroke="rgba(20,22,38,0.34)" strokeWidth="0.8" />
      <line x1="3" y1="22" x2="44" y2="22" stroke="rgba(20,22,38,0.5)" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
