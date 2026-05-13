import type { Pump, PumpComponent } from "@/types";

export type HealthLevel = "good" | "warn" | "bad";

export function healthLevel(percent: number): HealthLevel {
  if (percent >= 70) return "good";
  if (percent >= 35) return "warn";
  return "bad";
}

export function healthColor(percent: number): string {
  const level = healthLevel(percent);
  if (level === "good") return "var(--color-health-good)";
  if (level === "warn") return "var(--color-health-warn)";
  return "var(--color-health-bad)";
}

export function healthColorHex(percent: number): string {
  const level = healthLevel(percent);
  if (level === "good") return "#30B65C";
  if (level === "warn") return "#FF9F0A";
  return "#FF3B30";
}

export function overallHealth(p: Pump): number {
  if (!p.components.length) return 0;
  const sum = p.components.reduce((s, c) => s + c.healthPercent, 0);
  return Math.round(sum / p.components.length);
}

export function shortestRemaining(p: Pump): PumpComponent | null {
  if (!p.components.length) return null;
  return [...p.components].sort((a, b) => a.remainingHours - b.remainingHours)[0];
}
