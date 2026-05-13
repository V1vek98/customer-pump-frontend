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

const VARIANT = "mdx" as const;
const ACCENT = VARIANT_ACCENT[VARIANT];
const ACCENT_SOFT = VARIANT_ACCENT_SOFT[VARIANT];

export function PumpMDX(props: Props) {
  const { mode, reduce, blastView = false, highlightedPart = null, showLabels, components, className } = props;
  const rawId = useId();
  const p = rawId.replace(/[^a-zA-Z0-9_-]/g, "");

  if (mode === "glyph") {
    return <MDXGlyph className={className} />;
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
      aria-label="MDX mill-duty pump"
      className={cn("w-full h-full overflow-visible", className)}
    >
      <PumpDefs prefix={p} variant={VARIANT} mode={mode} />

      <ellipse cx="240" cy="266" rx="220" ry="16" fill={`url(#${p}-floor)`} />

      <g data-part-floor>
        <path d="M 56 222 L 96 196 L 280 196 L 320 222 Z" fill={`url(#${p}-metal-front)`} stroke="rgba(20,22,38,0.34)" strokeWidth="1.1" />
        <path d="M 56 222 L 96 196 L 96 200 L 56 226 Z" fill={`url(#${p}-metal-side)`} opacity="0.85" />
        <rect x="56" y="222" width="264" height="22" rx="3" fill={`url(#${p}-metal-side)`} stroke="rgba(20,22,38,0.30)" strokeWidth="0.9" />
        <rect x="304" y="216" width="118" height="28" rx="4" fill={`url(#${p}-metal-side)`} stroke="rgba(20,22,38,0.30)" strokeWidth="0.9" />
        {showSmall && (
          <>
            <rect x="76" y="244" width="36" height="10" rx="1.5" fill={`url(#${p}-metal-side)`} stroke="rgba(20,22,38,0.32)" strokeWidth="0.7" />
            <rect x="260" y="244" width="36" height="10" rx="1.5" fill={`url(#${p}-metal-side)`} stroke="rgba(20,22,38,0.32)" strokeWidth="0.7" />
            <rect x="360" y="244" width="36" height="10" rx="1.5" fill={`url(#${p}-metal-side)`} stroke="rgba(20,22,38,0.32)" strokeWidth="0.7" />
          </>
        )}
      </g>

      <motion.g data-part="bearing_assembly" variants={variants("bearing_assembly", "single")} animate={state("bearing_assembly")} initial={false}>
        <title>Bearing Assembly</title>
        <rect x="280" y="148" width="146" height="76" rx="10" fill={`url(#${p}-metal-top)`} stroke="rgba(20,22,38,0.32)" strokeWidth="1" />
        <rect x="280" y="148" width="146" height="16" rx="10" fill={`url(#${p}-metal-side)`} opacity="0.7" />
        <ellipse cx="420" cy="186" rx="6" ry="36" fill={`url(#${p}-metal-front)`} stroke="rgba(20,22,38,0.30)" strokeWidth="0.7" />
        {showSmall && (
          <>
            <line x1="312" y1="148" x2="312" y2="222" stroke="rgba(20,22,38,0.24)" strokeWidth="0.8" />
            <line x1="364" y1="148" x2="364" y2="222" stroke="rgba(20,22,38,0.24)" strokeWidth="0.8" />
            <circle cx="312" cy="186" r="3" fill="rgba(20,22,38,0.5)" />
            <circle cx="364" cy="186" r="3" fill="rgba(20,22,38,0.5)" />
            <rect x="326" y="156" width="24" height="3" rx="1.5" fill="rgba(20,22,38,0.6)" />
            <rect x="380" y="156" width="24" height="3" rx="1.5" fill="rgba(20,22,38,0.6)" />
            <circle cx="412" cy="164" r="3" fill="#86C8F0" stroke="rgba(20,22,38,0.45)" strokeWidth="0.5" />
          </>
        )}
      </motion.g>

      <motion.g data-part="casing-back" variants={variants("casing", "back")} animate={state("casing")} initial={false}>
        <title>Casing (back half)</title>
        <path
          d="M 184 168
             m -82 0
             a 82 82 0 0 1 164 0
             L 250 168
             a 56 56 0 0 0 -132 0
             Z"
          fill={`url(#${p}-volute-skin)`}
          stroke="rgba(20,22,38,0.36)"
          strokeWidth="1.3"
        />
        {showSmall && [70, 76].map((r, i) => (
          <path
            key={i}
            d={`M ${184 - r} 168 A ${r} ${r} 0 0 1 ${184 + r} 168`}
            fill="none"
            stroke="rgba(20,22,38,0.20)"
            strokeWidth="0.8"
          />
        ))}
        <rect x="156" y="78" width="56" height="14" rx="2" fill={`url(#${p}-metal-top)`} stroke="rgba(20,22,38,0.32)" strokeWidth="0.9" />
        <rect x="138" y="36" width="92" height="42" rx="3" fill={ACCENT} fillOpacity="0.94" stroke="rgba(20,22,38,0.42)" strokeWidth="0.9" />
        {showSmall && [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const cx = 148 + i * 12;
          return <circle key={i} cx={cx} cy="50" r="2" fill="rgba(20,22,38,0.65)" />;
        })}
        {showSmall && [
          [102, 158],
          [124, 92],
          [184, 76],
          [244, 96],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="2.2" fill="rgba(20,22,38,0.62)" />
        ))}
      </motion.g>

      <motion.g data-part="discharge_liner" variants={variants("discharge_liner", "single")} animate={state("discharge_liner")} initial={false}>
        <title>Discharge Liner</title>
        <rect x="168" y="92" width="32" height="48" rx="1" fill={`url(#${p}-liner)`} stroke="rgba(20,22,38,0.45)" strokeWidth="0.7" />
        <line x1="184" y1="98" x2="184" y2="136" stroke="rgba(20,22,38,0.40)" strokeWidth="0.5" strokeDasharray="2 2" />
      </motion.g>

      <motion.g data-part="suction_liner" variants={variants("suction_liner", "single")} animate={state("suction_liner")} initial={false}>
        <title>Suction Liner</title>
        <ellipse cx="122" cy="168" rx="15" ry="40" fill={`url(#${p}-liner)`} stroke="rgba(20,22,38,0.45)" strokeWidth="0.8" />
        <ellipse cx="122" cy="168" rx="9" ry="32" fill="rgba(20,22,38,0.55)" />
      </motion.g>

      <motion.g data-part="impeller" variants={variants("impeller", "single")} animate={state("impeller")} initial={false}>
        <title>Impeller</title>
        <circle cx="188" cy="168" r="34" fill={`url(#${p}-impeller-hub)`} />
        <circle cx="188" cy="168" r="34" fill="none" stroke={ACCENT} strokeOpacity="0.55" strokeWidth="1.2" />
        {[0, 60, 120, 180, 240, 300].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const x1 = 188 + Math.cos(rad) * 9;
          const y1 = 168 + Math.sin(rad) * 9;
          const x2 = 188 + Math.cos(rad) * 32;
          const y2 = 168 + Math.sin(rad) * 32;
          const midRad = ((deg + 10) * Math.PI) / 180;
          const mx = 188 + Math.cos(midRad) * 22;
          const my = 168 + Math.sin(midRad) * 22;
          return (
            <path
              key={deg}
              d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
              stroke={`url(#${p}-impeller-vane)`}
              strokeWidth="3.4"
              strokeLinecap="round"
              fill="none"
            />
          );
        })}
        <circle cx="188" cy="168" r="10" fill={ACCENT} />
        <circle cx="188" cy="168" r="10" fill="none" stroke="rgba(20,22,38,0.45)" strokeWidth="0.7" />
        <circle cx="188" cy="168" r="3.4" fill={ACCENT_SOFT} />
      </motion.g>

      <motion.g data-part="shaft_sleeve" variants={variants("shaft_sleeve", "single")} animate={state("shaft_sleeve")} initial={false}>
        <title>Shaft Sleeve</title>
        <rect x="244" y="162" width="34" height="16" rx="2" fill={`url(#${p}-metal-top)`} stroke="rgba(20,22,38,0.30)" strokeWidth="0.8" />
        <line x1="248" y1="170" x2="274" y2="170" stroke="rgba(20,22,38,0.20)" strokeWidth="0.6" />
      </motion.g>

      <motion.g data-part="casing-front" variants={variants("casing", "front")} animate={state("casing")} initial={false}>
        <title>Casing (front half)</title>
        <path
          d="M 184 168
             m -82 0
             a 82 82 0 0 0 164 0
             L 250 168
             a 56 56 0 0 1 -132 0
             Z"
          fill={`url(#${p}-volute-skin)`}
          stroke="rgba(20,22,38,0.36)"
          strokeWidth="1.3"
        />
        {showSmall && [70, 76].map((r, i) => (
          <path
            key={i}
            d={`M ${184 - r} 168 A ${r} ${r} 0 0 0 ${184 + r} 168`}
            fill="none"
            stroke="rgba(20,22,38,0.20)"
            strokeWidth="0.8"
          />
        ))}
        <path d="M 102 168 L 266 168" stroke="rgba(20,22,38,0.20)" strokeWidth="0.7" strokeDasharray="3 3" opacity="0.6" />
        {showSmall && [
          [102, 168],
          [124, 244],
          [184, 252],
          [244, 244],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="2.2" fill="rgba(20,22,38,0.62)" />
        ))}
        {showSmall && (
          <text x="184" y="206" fontSize="6" fontFamily="var(--font-mono)" fill="rgba(20,22,38,0.46)" letterSpacing="0.18em" textAnchor="middle">
            MDX · MILL DUTY
          </text>
        )}
      </motion.g>

      <motion.g data-part="suction_plate" variants={variants("suction_plate", "single")} animate={state("suction_plate")} initial={false}>
        <title>Suction Plate</title>
        <ellipse cx="82" cy="170" rx="14" ry="48" fill={`url(#${p}-metal-front)`} stroke="rgba(20,22,38,0.34)" strokeWidth="1" />
        <ellipse cx="86" cy="170" rx="7" ry="42" fill={`url(#${p}-metal-side)`} opacity="0.85" />
        {showSmall && [128, 148, 170, 192, 212].map((cy) => (
          <circle key={cy} cx="82" cy={cy} r="2" fill="rgba(20,22,38,0.6)" />
        ))}
        <ellipse cx="84" cy="170" rx="9" ry="28" fill={`url(#${p}-liner)`} opacity="0.65" />
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

function MDXGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 28" className={cn("h-full w-full overflow-visible", className)} role="img" aria-label="MDX pump">
      <rect x="6" y="9" width="14" height="14" rx="2" fill="#DDE0E6" stroke="rgba(20,22,38,0.34)" strokeWidth="0.9" />
      <circle cx="13" cy="16" r="3.4" fill={ACCENT} />
      <rect x="10" y="2" width="10" height="6" rx="0.4" fill={ACCENT} opacity="0.7" />
      <rect x="22" y="11" width="18" height="9" rx="1.6" fill="#C9CDD8" stroke="rgba(20,22,38,0.34)" strokeWidth="0.8" />
      <line x1="3" y1="25" x2="44" y2="25" stroke="rgba(20,22,38,0.5)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
