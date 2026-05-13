import type { Transition, Variants } from "framer-motion";
import type { ComponentName, PumpVariant } from "@/types";
import { DISASSEMBLY, type DisassemblyEntry } from "./geometry";

const SPRING: Transition = {
  type: "spring",
  stiffness: 220,
  damping: 24,
  mass: 0.7,
};

const REDUCED: Transition = { type: "tween", duration: 0.001 };

export const PART_INDEX: Record<ComponentName, number> = {
  casing: 0,
  suction_plate: 6,
  suction_liner: 2,
  impeller: 4,
  discharge_liner: 1,
  shaft_sleeve: 3,
  bearing_assembly: 5,
};

export function partMotionVariants(
  variant: PumpVariant,
  part: ComponentName,
  half: "front" | "back" | "single",
  reduce: boolean
): Variants {
  const entry: DisassemblyEntry = DISASSEMBLY[variant][part];
  const transit = reduce ? REDUCED : SPRING;

  const liftedAxis =
    half === "back" && entry.altAxis ? entry.altAxis : entry.axis;
  const liftedDx = liftedAxis[0] * entry.distance;
  const liftedDy = liftedAxis[1] * entry.distance;
  const blastDx = liftedAxis[0] * entry.distance * 0.78;
  const blastDy = liftedAxis[1] * entry.distance * 0.78;
  const idx = PART_INDEX[part];

  return {
    assembled: {
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      transition: transit,
    },
    lifted: {
      x: liftedDx,
      y: liftedDy,
      rotate: entry.rotate ?? 0,
      scale: 1.02,
      transition: transit,
    },
    blast: {
      x: blastDx,
      y: blastDy,
      rotate: (entry.rotate ?? 0) * 0.6,
      scale: 1.01,
      transition: reduce ? REDUCED : { ...SPRING, delay: 0.035 * idx },
    },
  };
}

export function partStateName(
  part: ComponentName,
  highlightedPart: ComponentName | null | undefined,
  blastView: boolean
): "assembled" | "lifted" | "blast" {
  if (highlightedPart === part) return "lifted";
  if (blastView) return "blast";
  return "assembled";
}

export const CALLOUT_FADE: Variants = {
  hidden: { opacity: 0, y: -4, transition: { duration: 0.12, ease: "easeOut" } },
  shown: { opacity: 1, y: 0, transition: { duration: 0.18, delay: 0.12, ease: "easeOut" } },
};
