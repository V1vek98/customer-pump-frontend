"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { GlassInput } from "@/components/primitives/GlassInput";
import { GlassButton } from "@/components/primitives/GlassButton";
import { X, Check } from "lucide-react";
import { useCanvasStore } from "@/lib/store/canvas";
import { SUBSECTION_COLORS, SUBSECTION_COLOR_KEYS, nextSubsectionColor } from "@/lib/subsections";
import type { SubsectionColor } from "@/types";
import { toast } from "sonner";

type Props = {
  pumpIds: string[];
  onClose: () => void;
  onCreated?: (subsectionId: string) => void;
};

export function NameSubsectionDialog({ pumpIds, onClose, onCreated }: Props) {
  const createSubsection = useCanvasStore((s) => s.createSubsection);
  const subsections = useCanvasStore(
    (s) => s.layouts.find((l) => l.id === s.activeLayoutId)?.subsections ?? []
  );

  const defaultName = `Line ${subsections.length + 1}`;
  const [name, setName] = useState(defaultName);
  const [color, setColor] = useState<SubsectionColor>(() => nextSubsectionColor(subsections.length));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const submit = () => {
    const trimmed = name.trim() || defaultName;
    const id = createSubsection(pumpIds, trimmed, color);
    toast.success(`Grouped ${pumpIds.length} pump${pumpIds.length === 1 ? "" : "s"} into ${trimmed}`);
    onCreated?.(id);
    onClose();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-[#1D1D1F]/22 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ type: "spring", stiffness: 360, damping: 30 }}
        className="fixed left-1/2 top-1/2 z-50 w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-3xl overflow-hidden glass-strong"
        role="dialog"
        aria-modal="true"
      >
        <div className="px-5 pt-5 pb-3 border-b border-black/[0.06] flex items-start justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#C77800] mb-1">
              New subsection
            </div>
            <h2 className="text-[17px] font-semibold text-[#1D1D1F] leading-tight">
              Name this group of pumps
            </h2>
            <p className="text-[11.5px] text-[#424245] mt-1">
              {pumpIds.length} pump{pumpIds.length === 1 ? "" : "s"} selected
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-black/[0.05] text-[#424245] hover:text-[#1D1D1F]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <label className="block">
            <div className="text-[10px] uppercase tracking-[0.16em] text-[#86868B] mb-1.5">Name</div>
            <GlassInput
              autoFocus
              value={name}
              placeholder="Line 1"
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
            />
          </label>

          <div>
            <div className="text-[10px] uppercase tracking-[0.16em] text-[#86868B] mb-1.5">Color</div>
            <div className="grid grid-cols-6 gap-2">
              {SUBSECTION_COLOR_KEYS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="relative h-9 w-full rounded-xl outline-none transition-transform hover:scale-105"
                  style={{
                    background: SUBSECTION_COLORS[c].pill,
                    boxShadow:
                      c === color
                        ? `0 0 0 3px ${SUBSECTION_COLORS[c].ring}, 0 0 0 5px ${SUBSECTION_COLORS[c].border}`
                        : "0 1px 2px rgba(0,0,0,0.10)",
                  }}
                  aria-label={SUBSECTION_COLORS[c].label}
                  title={SUBSECTION_COLORS[c].label}
                >
                  {c === color && <Check className="absolute inset-0 m-auto h-4 w-4 text-white" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-black/[0.06] flex items-center justify-end gap-2 bg-white/35">
          <GlassButton variant="ghost" onClick={onClose}>
            Cancel
          </GlassButton>
          <GlassButton variant="primary" onClick={submit}>
            Create subsection
          </GlassButton>
        </div>
      </motion.div>
    </>
  );
}
