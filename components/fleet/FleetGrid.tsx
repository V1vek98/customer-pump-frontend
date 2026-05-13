"use client";

import type { Pump } from "@/types";
import { PumpCard } from "./PumpCard";
import { Plus } from "lucide-react";
import { GlassButton } from "@/components/primitives/GlassButton";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";

type Props = {
  filtered: Pump[];
  cleared: boolean;
  onAdd?: () => void;
};

const ENTER_EASE = [0.16, 1, 0.3, 1] as const;
const EXIT_EASE = [0.4, 0, 1, 1] as const;

export function FleetGrid({ filtered, cleared, onAdd }: Props) {
  const reduce = useReducedMotion();

  if (filtered.length === 0) {
    return <EmptyState cleared={cleared} onAdd={onAdd} />;
  }
  return (
    <LayoutGroup>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <AnimatePresence mode="popLayout" initial={false}>
          {filtered.map((p) => (
            <motion.div
              key={p.id}
              layout={reduce ? false : "position"}
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
              exit={
                reduce
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.96, transition: { duration: 0.14, ease: EXIT_EASE } }
              }
              transition={
                reduce
                  ? { duration: 0 }
                  : {
                      layout: { type: "spring", stiffness: 380, damping: 32, mass: 0.8 },
                      opacity: { duration: 0.18, ease: ENTER_EASE },
                      scale: { duration: 0.18, ease: ENTER_EASE },
                      y: { duration: 0.18, ease: ENTER_EASE },
                    }
              }
            >
              <PumpCard pump={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}

function EmptyState({ onAdd, cleared }: { onAdd?: () => void; cleared: boolean }) {
  return (
    <div className="mt-12 mx-auto max-w-md text-center py-16 rounded-3xl border border-dashed border-black/[0.10] bg-white/40 backdrop-blur-xl">
      <div className="mx-auto h-14 w-14 rounded-2xl glass flex items-center justify-center mb-5">
        <Plus className="h-6 w-6 text-[#86868B]" />
      </div>
      <h3 className="text-lg font-medium text-[#1D1D1F]">
        {cleared ? "No pumps match those filters" : "Your fleet is empty"}
      </h3>
      <p className="text-sm text-[#6E6E73] mt-1.5 max-w-sm mx-auto">
        {cleared
          ? "Try clearing the search or status filter to see everything you own."
          : "Pumps you own will appear here. Already have one? Add it manually."}
      </p>
      {!cleared && (
        <div className="mt-5">
          <GlassButton variant="primary" onClick={onAdd}>
            <Plus className="h-4 w-4" />
            Add your first pump
          </GlassButton>
        </div>
      )}
    </div>
  );
}
