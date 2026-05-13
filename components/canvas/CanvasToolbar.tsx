"use client";

import { useCanvasStore } from "@/lib/store/canvas";
import { GlassButton } from "@/components/primitives/GlassButton";
import { Save, Magnet, Plus, Layers, Trash2, ChevronDown, Keyboard, Eraser } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

type Props = {
  snap: boolean;
  onSnapToggle: () => void;
  onShowShortcuts: () => void;
};

export function CanvasToolbar({ snap, onSnapToggle, onShowShortcuts }: Props) {
  const layouts = useCanvasStore((s) => s.layouts);
  const activeLayoutId = useCanvasStore((s) => s.activeLayoutId);
  const setActive = useCanvasStore((s) => s.setActive);
  const renameLayout = useCanvasStore((s) => s.renameLayout);
  const newLayout = useCanvasStore((s) => s.newLayout);
  const deleteLayout = useCanvasStore((s) => s.deleteLayout);
  const resetActiveLayout = useCanvasStore((s) => s.resetActiveLayout);
  const active = layouts.find((l) => l.id === activeLayoutId) ?? layouts[0];
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(active.name);

  const startEdit = () => {
    setEditValue(active.name);
    setEditing(true);
  };
  const commitEdit = () => {
    setEditing(false);
    if (editValue.trim() && editValue !== active.name) {
      renameLayout(active.id, editValue.trim());
      toast.success("Layout renamed");
    }
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-2xl glass-strong">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="inline-flex items-center gap-2 h-9 px-3 rounded-xl bg-white/70 border border-black/[0.07] hover:bg-white/95 transition-colors group">
            <Layers className="h-3.5 w-3.5 text-[#424245]" />
            <span className="text-[12px] text-[#1D1D1F]">{active.name}</span>
            <ChevronDown className="h-3 w-3 text-[#86868B] group-data-[state=open]:rotate-180 transition-transform" />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            sideOffset={6}
            className="min-w-[240px] rounded-2xl glass-strong p-1.5 z-[70]"
          >
            {layouts.map((l) => (
              <DropdownMenu.Item
                key={l.id}
                onSelect={() => setActive(l.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-[12px] cursor-pointer outline-none data-[highlighted]:bg-black/[0.05] ${l.id === active.id ? "text-[#1D1D1F]" : "text-[#424245]"}`}
              >
                <span className="truncate">{l.name}</span>
                <span className="num text-[10px] text-[#A1A1A6]">{l.nodes.length}n</span>
              </DropdownMenu.Item>
            ))}
            <DropdownMenu.Separator className="my-1 h-px bg-black/[0.06]" />
            <DropdownMenu.Item
              onSelect={() => {
                newLayout("New layout");
                toast.success("Created new layout");
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] text-[#1D1D1F] cursor-pointer outline-none data-[highlighted]:bg-black/[0.05]"
            >
              <Plus className="h-3.5 w-3.5" />
              New layout
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onSelect={() => {
                if (confirm(`Delete layout "${active.name}"?`)) {
                  deleteLayout(active.id);
                  toast.success("Layout deleted");
                }
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] text-[#D70015] cursor-pointer outline-none data-[highlighted]:bg-[#FF3B30]/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete this layout
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <div className="h-6 w-px bg-black/[0.10]" />

      {editing ? (
        <input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitEdit();
            if (e.key === "Escape") setEditing(false);
          }}
          autoFocus
          className="h-8 px-2 text-[12px] rounded-lg bg-white/85 border border-[#0A84FF]/40 text-[#1D1D1F] outline-none focus:ring-2 focus:ring-[#0A84FF]/25 min-w-[180px]"
        />
      ) : (
        <button onClick={startEdit} className="text-[11px] text-[#86868B] hover:text-[#1D1D1F] transition-colors">
          rename
        </button>
      )}

      <div className="ml-auto flex items-center gap-2">
        {(active.nodes.length > 0 || active.edges.length > 0) && (
          <button
            onClick={() => {
              if (confirm(`Clear all pumps and connections from "${active.name}"?`)) {
                resetActiveLayout();
                toast.success("Map cleared");
              }
            }}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border text-[11px] font-medium bg-white/70 border-black/[0.07] text-[#424245] hover:text-[#D70015] hover:border-[#FF3B30]/40 transition-colors"
            title="Remove all pumps and connections"
          >
            <Eraser className="h-3.5 w-3.5" />
            Clear map
          </button>
        )}

        <button
          onClick={onSnapToggle}
          className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border text-[11px] font-medium transition-colors ${snap ? "bg-[#FFC233]/20 border-[#FFC233]/50 text-[#8A5A00]" : "bg-white/70 border-black/[0.07] text-[#424245] hover:text-[#1D1D1F]"}`}
        >
          <Magnet className="h-3.5 w-3.5" />
          Snap
        </button>

        <button
          onClick={onShowShortcuts}
          className="h-9 w-9 inline-flex items-center justify-center rounded-xl bg-white/70 border border-black/[0.07] text-[#424245] hover:text-[#1D1D1F] hover:bg-white/95 transition-colors"
          aria-label="Keyboard shortcuts"
          title="Keyboard shortcuts (?)"
        >
          <Keyboard className="h-3.5 w-3.5" />
        </button>

        <GlassButton variant="primary" size="md" onClick={() => toast.success("Layout saved")}>
          <Save className="h-4 w-4" />
          Save
        </GlassButton>
      </div>
    </div>
  );
}
