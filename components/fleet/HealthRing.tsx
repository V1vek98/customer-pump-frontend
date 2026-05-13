"use client";

import { healthColorHex } from "@/lib/health";
import { motion } from "framer-motion";

type Props = {
  percent: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  className?: string;
};

export function HealthRing({
  percent,
  size = 36,
  strokeWidth = 3,
  showLabel = true,
  className,
}: Props) {
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const safe = Math.max(0, Math.min(100, percent));
  const dashOffset = circumference * (1 - safe / 100);
  const color = healthColorHex(safe);

  return (
    <div className={className} style={{ width: size, height: size, position: "relative" }}>
      <svg width={size} height={size} className="block">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(20,20,30,0.10)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ filter: `drop-shadow(0 0 4px ${color}66)` }}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="num text-[10px] font-semibold tabular-nums" style={{ color }}>
            {Math.round(safe)}
          </span>
        </div>
      )}
    </div>
  );
}
