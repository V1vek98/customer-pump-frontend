"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { X } from "lucide-react";

const SECTIONS: { title: string; items: { keys: string[]; label: string }[] }[] = [
  {
    title: "Canvas",
    items: [
      { keys: ["Space", "drag"], label: "Pan" },
      { keys: ["⌘/Ctrl", "scroll"], label: "Zoom" },
      { keys: ["?"], label: "Show this overlay" },
      { keys: ["Esc"], label: "Close overlay / sheet" },
    ],
  },
  {
    title: "Editing",
    items: [
      { keys: ["⌘/Ctrl", "S"], label: "Save layout" },
      { keys: ["Del"], label: "Remove selection" },
      { keys: ["drag from palette"], label: "Add pump to canvas" },
      { keys: ["click on edge label"], label: "Toggle series ↔ parallel" },
      { keys: ["double-click edge label"], label: "Remove edge" },
    ],
  },
  {
    title: "Fleet",
    items: [
      { keys: ["/"], label: "Focus search" },
      { keys: ["click a pump"], label: "Open detail" },
    ],
  },
];

export function ShortcutOverlay({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "?") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-[#1D1D1F]/22 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[560px] max-w-[92vw] rounded-3xl glass-strong overflow-hidden"
      >
        <div className="flex items-start justify-between p-6 border-b border-black/[0.06]">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#C77800] mb-1">Keyboard</div>
            <h3 className="text-[20px] font-semibold text-[#1D1D1F]">Shortcuts</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="h-9 w-9 inline-flex items-center justify-center rounded-full hover:bg-black/[0.04] text-[#424245] hover:text-[#1D1D1F]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#86868B] mb-2.5">
                {s.title}
              </div>
              <ul className="space-y-2">
                {s.items.map((it, i) => (
                  <li key={i} className="flex items-center justify-between gap-2">
                    <span className="text-[12px] text-[#424245]">{it.label}</span>
                    <span className="flex items-center gap-1">
                      {it.keys.map((k, j) => (
                        <kbd
                          key={j}
                          className="px-1.5 h-5 inline-flex items-center text-[10px] num text-[#1D1D1F] rounded border border-black/[0.10] bg-white/70"
                        >
                          {k}
                        </kbd>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="p-4 text-center text-[11px] text-[#A1A1A6] border-t border-black/[0.06]">
          press{" "}
          <kbd className="px-1.5 py-0.5 rounded border border-black/[0.10] text-[#6E6E73] bg-white/70">
            esc
          </kbd>{" "}
          or{" "}
          <kbd className="px-1.5 py-0.5 rounded border border-black/[0.10] text-[#6E6E73] bg-white/70">
            ?
          </kbd>{" "}
          to close
        </div>
      </motion.div>
    </>
  );
}
