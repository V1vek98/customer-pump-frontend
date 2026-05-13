"use client";

import { healthColorHex } from "@/lib/health";
import { motion } from "framer-motion";

export function WearBar({ percent, className }: { percent: number; className?: string }) {
  const safe = Math.max(0, Math.min(100, percent));
  const color = healthColorHex(safe);
  return (
    <div className={`relative h-1.5 w-full rounded-full bg-black/[0.06] overflow-hidden ${className ?? ""}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${safe}%` }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
        className="absolute inset-y-0 left-0 rounded-full"
        style={{
          background: `linear-gradient(90deg, ${color}AA, ${color})`,
          boxShadow: `0 0 8px ${color}66`,
        }}
      />
    </div>
  );
}
