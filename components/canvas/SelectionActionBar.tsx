"use client";

import { useReactFlow, useStore, useViewport } from "@xyflow/react";
import { Group } from "lucide-react";
import { createPortal } from "react-dom";
import { SUBSECTION_LAYOUT } from "@/lib/subsections";

type Props = {
  selectedNodeIds: string[];
  onGroup: () => void;
};

export function SelectionActionBar({ selectedNodeIds, onGroup }: Props) {
  const { getNode, flowToScreenPosition } = useReactFlow();
  // Subscribe to viewport so we re-render on pan / zoom.
  const viewport = useViewport();
  // Subscribe to node movements.
  const nodeLookup = useStore((s) => s.nodeLookup);

  if (selectedNodeIds.length < 2) return null;
  void viewport;
  void nodeLookup;

  const nodes = selectedNodeIds
    .map((id) => getNode(id))
    .filter((n): n is NonNullable<ReturnType<typeof getNode>> => !!n);

  if (nodes.length < 2) return null;

  const xs = nodes.map((n) => n.position.x);
  const ys = nodes.map((n) => n.position.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs) + SUBSECTION_LAYOUT.pumpWidth;
  const minY = Math.min(...ys);

  const topLeft = flowToScreenPosition({ x: minX, y: minY });
  const topRight = flowToScreenPosition({ x: maxX, y: minY });

  const left = (topLeft.x + topRight.x) / 2;
  const top = topLeft.y - 16;

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed z-[60] pointer-events-none"
      style={{
        left,
        top,
        transform: "translate(-50%, -100%)",
      }}
    >
      <button
        type="button"
        onClick={onGroup}
        className="pointer-events-auto inline-flex items-center gap-2 h-9 px-3 rounded-full bg-[#1D1D1F] text-white text-[12px] font-medium shadow-[0_10px_24px_-6px_rgba(0,0,0,0.32)] hover:bg-[#000] transition-colors"
      >
        <Group className="h-3.5 w-3.5" />
        Group as subsection
        <span className="ml-1 inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-white/15 text-[10.5px] num">
          {selectedNodeIds.length}
        </span>
      </button>
    </div>,
    document.body
  );
}
