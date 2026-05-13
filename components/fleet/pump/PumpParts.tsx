"use client";

import type { PumpVariant } from "@/types";
import type { RenderMode } from "./geometry";
import { VARIANT_ACCENT, VARIANT_ACCENT_SOFT } from "./geometry";

type Props = {
  prefix: string;
  variant: PumpVariant;
  mode: RenderMode;
};

export function PumpDefs({ prefix, variant, mode }: Props) {
  const accent = VARIANT_ACCENT[variant];
  const accentSoft = VARIANT_ACCENT_SOFT[variant];
  const isDetail = mode === "detail";

  return (
    <defs>
      <linearGradient id={`${prefix}-metal-top`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#E8F2FB" />
        <stop offset="48%" stopColor="#5C9CD3" />
        <stop offset="100%" stopColor="#03589E" />
      </linearGradient>

      <linearGradient id={`${prefix}-metal-front`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#D8E7F5" />
        <stop offset="60%" stopColor="#3D7DB5" />
        <stop offset="100%" stopColor="#03589E" />
      </linearGradient>

      <linearGradient id={`${prefix}-metal-side`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#5C9CD3" />
        <stop offset="50%" stopColor="#2867A4" />
        <stop offset="100%" stopColor="#02335E" />
      </linearGradient>

      <linearGradient id={`${prefix}-metal-shadow`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2867A4" />
        <stop offset="100%" stopColor="#02335E" />
      </linearGradient>

      <linearGradient id={`${prefix}-volute-skin`} x1="0.1" y1="0" x2="0.9" y2="1">
        <stop offset="0%" stopColor="#DDEBF7" />
        <stop offset="35%" stopColor="#7CA9D4" />
        <stop offset="100%" stopColor="#03589E" />
      </linearGradient>

      <radialGradient id={`${prefix}-impeller-hub`} cx="0.5" cy="0.5" r="0.55">
        <stop offset="0%" stopColor={accentSoft} stopOpacity="1" />
        <stop offset="55%" stopColor={accent} stopOpacity="0.92" />
        <stop offset="100%" stopColor={accent} stopOpacity="0.32" />
      </radialGradient>

      <linearGradient id={`${prefix}-impeller-vane`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={accentSoft} stopOpacity="0.95" />
        <stop offset="100%" stopColor={accent} stopOpacity="0.78" />
      </linearGradient>

      <linearGradient id={`${prefix}-liner`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#5C6276" />
        <stop offset="100%" stopColor="#2D3140" />
      </linearGradient>

      <radialGradient id={`${prefix}-floor`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stopColor="rgba(20,22,38,0.34)" />
        <stop offset="65%" stopColor="rgba(20,22,38,0.10)" />
        <stop offset="100%" stopColor="rgba(20,22,38,0)" />
      </radialGradient>

      <filter id={`${prefix}-glow`} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="2.4" result="b" />
        <feFlood floodColor={accent} floodOpacity="0.55" result="c" />
        <feComposite in="c" in2="b" operator="in" result="cb" />
        <feMerge>
          <feMergeNode in="cb" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {isDetail && (
        <filter id={`${prefix}-cast-noise`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="3" />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.07 0" />
          <feComposite in2="SourceGraphic" operator="in" />
          <feBlend in="SourceGraphic" mode="multiply" />
        </filter>
      )}
    </defs>
  );
}
