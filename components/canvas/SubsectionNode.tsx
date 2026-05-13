"use client";

import { type NodeProps } from "@xyflow/react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, MoreHorizontal, Pencil, Palette, Ungroup } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useCanvasStore } from "@/lib/store/canvas";
import { SUBSECTION_COLORS, SUBSECTION_COLOR_KEYS, SUBSECTION_LAYOUT } from "@/lib/subsections";
import type { Subsection } from "@/types";
import { toast } from "sonner";

export type SubsectionNodeData = {
  subsection: Subsection;
  width: number;
  height: number;
};

export function SubsectionNode({ data }: NodeProps) {
  const d = data as unknown as SubsectionNodeData;
  const renameSubsection = useCanvasStore((s) => s.renameSubsection);
  const recolorSubsection = useCanvasStore((s) => s.recolorSubsection);
  const deleteSubsection = useCanvasStore((s) => s.deleteSubsection);

  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(d.subsection.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const color = SUBSECTION_COLORS[d.subsection.color];

  const commit = () => {
    setEditing(false);
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== d.subsection.name) {
      renameSubsection(d.subsection.id, trimmed);
      toast.success(`Renamed to ${trimmed}`);
    } else {
      setEditValue(d.subsection.name);
    }
  };

  return (
    <div
      className="relative rounded-2xl"
      style={{
        width: d.width,
        height: d.height,
        background: color.fill,
        border: `1.5px dashed ${color.border}`,
        pointerEvents: "none",
      }}
    >
      <div
        className="absolute -top-3 left-3 inline-flex items-center gap-1.5 pl-2.5 pr-1 h-7 rounded-full shadow-[0_4px_12px_-4px_rgba(40,40,60,0.18)]"
        style={{
          pointerEvents: "auto",
          background: color.pill,
          color: "#fff",
        }}
      >
        {editing ? (
          <input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") {
                setEditValue(d.subsection.name);
                setEditing(false);
              }
            }}
            className="h-5 px-1 text-[11px] font-semibold tracking-wide bg-white/25 rounded-md outline-none placeholder:text-white/70 text-white min-w-[80px] max-w-[180px]"
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="text-[11px] font-semibold tracking-wide outline-none"
            title="Click to rename"
          >
            {d.subsection.name}
          </button>
        )}

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className="h-5 w-5 inline-flex items-center justify-center rounded-full hover:bg-white/20 outline-none"
              aria-label="Subsection menu"
            >
              <MoreHorizontal className="h-3 w-3" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              sideOffset={6}
              className="min-w-[200px] rounded-2xl glass-strong p-1.5 z-[70]"
            >
              <DropdownMenu.Item
                onSelect={(e) => {
                  e.preventDefault();
                  setEditing(true);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] text-[#1D1D1F] cursor-pointer outline-none data-[highlighted]:bg-black/[0.05]"
              >
                <Pencil className="h-3.5 w-3.5" />
                Rename
              </DropdownMenu.Item>

              <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] text-[#1D1D1F] cursor-pointer outline-none data-[highlighted]:bg-black/[0.05]">
                  <Palette className="h-3.5 w-3.5" />
                  Change color
                </DropdownMenu.SubTrigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.SubContent
                    sideOffset={6}
                    className="rounded-2xl glass-strong p-2 z-[71]"
                  >
                    <div className="grid grid-cols-3 gap-1.5">
                      {SUBSECTION_COLOR_KEYS.map((c) => (
                        <button
                          key={c}
                          onClick={() => {
                            recolorSubsection(d.subsection.id, c);
                          }}
                          className="relative h-8 w-8 rounded-lg outline-none transition-transform hover:scale-110"
                          style={{ background: SUBSECTION_COLORS[c].pill }}
                          aria-label={SUBSECTION_COLORS[c].label}
                          title={SUBSECTION_COLORS[c].label}
                        >
                          {c === d.subsection.color && (
                            <Check className="absolute inset-0 m-auto h-4 w-4 text-white" />
                          )}
                        </button>
                      ))}
                    </div>
                  </DropdownMenu.SubContent>
                </DropdownMenu.Portal>
              </DropdownMenu.Sub>

              <DropdownMenu.Separator className="my-1 h-px bg-black/[0.06]" />
              <DropdownMenu.Item
                onSelect={() => {
                  deleteSubsection(d.subsection.id);
                  toast.success(`Ungrouped ${d.subsection.name}`);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] text-[#D70015] cursor-pointer outline-none data-[highlighted]:bg-[#FF3B30]/10"
              >
                <Ungroup className="h-3.5 w-3.5" />
                Ungroup
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  );
}

export function computeSubsectionBounds(
  positions: { x: number; y: number }[]
): { x: number; y: number; width: number; height: number } | null {
  if (positions.length === 0) return null;
  const { pumpWidth, pumpHeight, padding, labelGutter } = SUBSECTION_LAYOUT;
  const xs = positions.map((p) => p.x);
  const ys = positions.map((p) => p.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs) + pumpWidth;
  const maxY = Math.max(...ys) + pumpHeight;
  return {
    x: minX - padding,
    y: minY - padding - labelGutter,
    width: maxX - minX + padding * 2,
    height: maxY - minY + padding * 2 + labelGutter,
  };
}
