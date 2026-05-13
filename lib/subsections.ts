import type { SubsectionColor } from "@/types";

export const SUBSECTION_COLORS: Record<
  SubsectionColor,
  { fill: string; border: string; ring: string; pill: string; label: string }
> = {
  blue: {
    fill: "rgba(10,132,255,0.07)",
    border: "rgba(10,132,255,0.55)",
    ring: "rgba(10,132,255,0.22)",
    pill: "#0A84FF",
    label: "Blue",
  },
  green: {
    fill: "rgba(48,176,99,0.07)",
    border: "rgba(48,176,99,0.55)",
    ring: "rgba(48,176,99,0.22)",
    pill: "#30B063",
    label: "Green",
  },
  violet: {
    fill: "rgba(140,82,255,0.07)",
    border: "rgba(140,82,255,0.55)",
    ring: "rgba(140,82,255,0.22)",
    pill: "#8C52FF",
    label: "Violet",
  },
  rose: {
    fill: "rgba(255,82,140,0.07)",
    border: "rgba(255,82,140,0.55)",
    ring: "rgba(255,82,140,0.22)",
    pill: "#FF528C",
    label: "Rose",
  },
  teal: {
    fill: "rgba(0,178,178,0.07)",
    border: "rgba(0,178,178,0.55)",
    ring: "rgba(0,178,178,0.22)",
    pill: "#00B2B2",
    label: "Teal",
  },
  amber: {
    fill: "rgba(199,120,0,0.07)",
    border: "rgba(199,120,0,0.55)",
    ring: "rgba(199,120,0,0.22)",
    pill: "#C77800",
    label: "Amber",
  },
};

export const SUBSECTION_COLOR_KEYS: SubsectionColor[] = [
  "blue",
  "green",
  "violet",
  "rose",
  "teal",
  "amber",
];

export function nextSubsectionColor(existingCount: number): SubsectionColor {
  return SUBSECTION_COLOR_KEYS[existingCount % SUBSECTION_COLOR_KEYS.length];
}

export const SUBSECTION_LAYOUT = {
  pumpWidth: 228,
  pumpHeight: 150,
  padding: 24,
  labelGutter: 26,
} as const;
