"use client";

import { useReducedMotion } from "framer-motion";
import type { ComponentName, PumpComponent, PumpVariant } from "@/types";
import { sizeToMode } from "./geometry";
import { PumpLSA } from "./PumpLSA";
import { PumpLCC } from "./PumpLCC";
import { PumpMDX } from "./PumpMDX";
import { PumpGeneric } from "./PumpGeneric";

export type PumpRendererProps = {
  variant: PumpVariant;
  highlightedPart?: ComponentName | null;
  isThirdParty?: boolean;
  size?: "card" | "node" | "hero" | "thumb";
  blastView?: boolean;
  showLabels?: boolean;
  components?: PumpComponent[];
  className?: string;
};

const VARIANTS = {
  lsa: PumpLSA,
  lcc: PumpLCC,
  mdx: PumpMDX,
  generic: PumpGeneric,
} as const;

const SIZE_CLASS: Record<NonNullable<PumpRendererProps["size"]>, string> = {
  hero: "h-[360px] w-full",
  card: "h-28 w-full",
  node: "h-14 w-full",
  thumb: "h-9 w-12",
};

export function PumpRenderer({
  variant,
  highlightedPart = null,
  isThirdParty = false,
  size = "card",
  blastView = false,
  showLabels,
  components,
  className,
}: PumpRendererProps) {
  const reduceMotion = useReducedMotion();
  const reduce = !!reduceMotion;
  const mode = sizeToMode(size);

  // Force generic when third-party regardless of variant — third-party pumps
  // get the Warman silhouette and inert hover behavior.
  const resolvedVariant: PumpVariant = isThirdParty ? "generic" : variant;
  const Variant = VARIANTS[resolvedVariant];

  // Callouts default on for hero, off everywhere else.
  const labels = showLabels ?? mode === "detail";

  // Third-party has no telemetry; suppress hover-driven lift but allow blast.
  const effectiveHighlight = isThirdParty ? null : highlightedPart;

  return (
    <div className={`${SIZE_CLASS[size]} ${className ?? ""}`}>
      <Variant
        mode={mode}
        reduce={reduce}
        blastView={blastView}
        highlightedPart={effectiveHighlight}
        showLabels={labels}
        isThirdParty={isThirdParty}
        components={components}
      />
    </div>
  );
}
