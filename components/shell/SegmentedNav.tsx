"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { label: "Fleet", href: "/fleet" },
  { label: "Map", href: "/map" },
  { label: "Insights", href: "/insights" },
];

export function SegmentedNav() {
  const pathname = usePathname();
  const activeIdx = Math.max(
    0,
    ITEMS.findIndex((it) => pathname === it.href || pathname.startsWith(it.href + "/"))
  );

  return (
    <div className="relative inline-flex items-center p-1 rounded-full bg-white/70 border border-black/[0.07] backdrop-blur-xl shadow-[0_1px_0_0_rgba(255,255,255,0.85)_inset,0_2px_8px_-2px_rgba(40,40,60,0.10)]">
      {ITEMS.map((it, i) => {
        const isActive = i === activeIdx;
        return (
          <Link
            key={it.href}
            href={it.href}
            className={cn(
              "relative z-10 px-4 h-8 inline-flex items-center text-xs font-medium tracking-wide transition-colors duration-200",
              isActive ? "text-white" : "text-[#6E6E73] hover:text-[#1D1D1F]"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="seg-active"
                className="absolute inset-0 -z-10 rounded-full bg-[#1D1D1F] shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_6px_16px_-4px_rgba(0,0,0,0.32)]"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            {it.label}
          </Link>
        );
      })}
    </div>
  );
}
