"use client";

import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  ConnectionLineType,
  ConnectionMode,
  Controls,
  useReactFlow,
  type Node,
  type Edge,
  type Connection,
  type NodeChange,
  type EdgeChange,
  type NodeTypes,
  type EdgeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { useCanvasStore } from "@/lib/store/canvas";
import { useFleetStore } from "@/lib/store/fleet";
import { PumpNode, type PumpNodeData } from "./PumpNode";
import { FlowEdge, type FlowEdgeData } from "./FlowEdge";
import { PumpPalette } from "./PumpPalette";
import { CanvasToolbar } from "./CanvasToolbar";
import { ShortcutOverlay } from "./ShortcutOverlay";
import { SubsectionNode, computeSubsectionBounds, type SubsectionNodeData } from "./SubsectionNode";
import { SelectionActionBar } from "./SelectionActionBar";
import { AddThirdPartyPumpSheet } from "@/components/forms/AddThirdPartyPumpSheet";
import { NameSubsectionDialog } from "@/components/forms/NameSubsectionDialog";
import type { SubsectionColor } from "@/types";
import { toast } from "sonner";

const nodeTypes: NodeTypes = { pump: PumpNode, subsection: SubsectionNode };
const edgeTypes: EdgeTypes = { flow: FlowEdge };

function Inner() {
  const active = useCanvasStore((s) => s.layouts.find((l) => l.id === s.activeLayoutId) ?? s.layouts[0]);
  const addNode = useCanvasStore((s) => s.addNode);
  const moveNode = useCanvasStore((s) => s.moveNode);
  const removeNode = useCanvasStore((s) => s.removeNode);
  const addEdge = useCanvasStore((s) => s.addEdge);
  const removeEdge = useCanvasStore((s) => s.removeEdge);

  const pumps = useFleetStore((s) => s.pumps);

  const [snap, setSnap] = useState(true);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [namingPumpIds, setNamingPumpIds] = useState<string[] | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { screenToFlowPosition, setNodes: rfSetNodes } = useReactFlow();

  const colorByNodeId = useMemo(() => {
    const map = new Map<string, SubsectionColor>();
    (active.subsections ?? []).forEach((sub) => {
      sub.pumpIds.forEach((pid) => map.set(pid, sub.color));
    });
    return map;
  }, [active.subsections]);

  const pumpNodes: Node[] = useMemo(
    () =>
      active.nodes.map((n) => ({
        id: n.id,
        type: "pump",
        position: n.position,
        data: {
          pumpId: n.pumpId,
          active: n.active,
          role: n.role,
          subsectionColor: colorByNodeId.get(n.id),
        } satisfies PumpNodeData,
        deletable: true,
      })),
    [active.nodes, colorByNodeId]
  );

  const subsectionNodes: Node[] = useMemo(() => {
    const subs = active.subsections ?? [];
    const out: Node[] = [];
    for (const sub of subs) {
      const positions = sub.pumpIds
        .map((pid) => active.nodes.find((n) => n.id === pid))
        .filter((n): n is NonNullable<typeof n> => !!n)
        .map((n) => n.position);
      const bounds = computeSubsectionBounds(positions);
      if (!bounds) continue;
      out.push({
        id: `grp-${sub.id}`,
        type: "subsection",
        position: { x: bounds.x, y: bounds.y },
        data: {
          subsection: sub,
          width: bounds.width,
          height: bounds.height,
        } satisfies SubsectionNodeData,
        draggable: false,
        selectable: false,
        connectable: false,
        focusable: false,
        deletable: false,
        zIndex: -1,
        style: { width: bounds.width, height: bounds.height, pointerEvents: "none" },
      });
    }
    return out;
  }, [active.subsections, active.nodes]);

  const nodes: Node[] = useMemo(() => [...subsectionNodes, ...pumpNodes], [subsectionNodes, pumpNodes]);

  const edges: Edge[] = useMemo(
    () =>
      active.edges.map((e) => {
        const src = active.nodes.find((n) => n.id === e.source);
        const tgt = active.nodes.find((n) => n.id === e.target);
        const isActive = !!(src?.active && tgt?.active);
        return {
          id: e.id,
          source: e.source,
          target: e.target,
          sourceHandle: e.sourceHandle,
          targetHandle: e.targetHandle,
          type: "flow",
          data: { kind: e.kind, active: isActive } satisfies FlowEdgeData,
        };
      }),
    [active.edges, active.nodes]
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      // mirror position changes back to store
      changes.forEach((c) => {
        if (c.type === "position" && c.position) {
          moveNode(c.id, c.position);
        }
        if (c.type === "remove") {
          removeNode(c.id);
        }
      });
    },
    [moveNode, removeNode]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      changes.forEach((c) => {
        if (c.type === "remove") removeEdge(c.id);
      });
    },
    [removeEdge]
  );

  const onConnect = useCallback(
    (c: Connection) => {
      if (!c.source || !c.target || c.source === c.target) return;
      addEdge({
        source: c.source,
        target: c.target,
        sourceHandle: c.sourceHandle ?? undefined,
        targetHandle: c.targetHandle ?? undefined,
        kind: "series",
      });
      toast.success("Connected", { description: "Click the label to switch series / parallel." });
    },
    [addEdge]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const pumpId = e.dataTransfer.getData("application/giw-pump");
      if (!pumpId) return;
      const pos = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      addNode(pumpId, pos);
      const p = pumps.find((pp) => pp.id === pumpId);
      toast.success(`Added ${p?.model ?? "pump"} to map`);
    },
    [screenToFlowPosition, addNode, pumps]
  );

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const isInput =
        t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if (!isInput && e.key === "?") {
        e.preventDefault();
        setShowShortcuts(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        toast.success("Layout saved");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div ref={wrapperRef} className="relative h-full flex flex-col p-4 gap-3">
      <CanvasToolbar
        snap={snap}
        onSnapToggle={() => setSnap((v) => !v)}
        onShowShortcuts={() => setShowShortcuts(true)}
      />

      <div className="flex gap-4 flex-1 min-h-0">
        <PumpPalette onAddThirdParty={() => setAddOpen(true)} />

        <div
          className="flex-1 h-full relative rounded-3xl overflow-hidden glass"
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onSelectionChange={(s) =>
              setSelectedNodeIds(s.nodes.filter((n) => n.type === "pump").map((n) => n.id))
            }
            multiSelectionKeyCode={["Shift", "Control", "Meta"]}
            selectionOnDrag
            panOnDrag={[1, 2]}
            selectionKeyCode={null}
            snapToGrid={snap}
            snapGrid={[16, 16]}
            fitView
            fitViewOptions={{ padding: 0.25, maxZoom: 1.1 }}
            minZoom={0.4}
            maxZoom={1.6}
            proOptions={{ hideAttribution: false }}
            defaultEdgeOptions={{ type: "flow" }}
            connectionMode={ConnectionMode.Loose}
            connectionLineType={ConnectionLineType.Straight}
            connectionLineStyle={{ stroke: "#FFC233", strokeWidth: 2 }}
            connectionRadius={28}
            colorMode="light"
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={24}
              size={1.2}
              color="rgba(20,20,30,0.10)"
            />
            <Controls
              showInteractive={false}
              position="bottom-right"
              style={{ bottom: 18, right: 18 }}
            />
          </ReactFlow>

          {active.nodes.length === 0 && <CanvasEmpty />}

          <SelectionActionBar
            selectedNodeIds={selectedNodeIds}
            onGroup={() => setNamingPumpIds(selectedNodeIds)}
          />
        </div>
      </div>

      <AnimatePresence>
        {showShortcuts && <ShortcutOverlay onClose={() => setShowShortcuts(false)} />}
        {addOpen && <AddThirdPartyPumpSheet onClose={() => setAddOpen(false)} />}
        {namingPumpIds && (
          <NameSubsectionDialog
            pumpIds={namingPumpIds}
            onClose={() => setNamingPumpIds(null)}
            onCreated={() => {
              rfSetNodes((ns) => ns.map((n) => ({ ...n, selected: false })));
              setSelectedNodeIds([]);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CanvasEmpty() {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <div className="mx-auto mb-4 inline-flex items-center gap-2 px-3 h-7 rounded-full bg-white/70 border border-black/[0.08] text-[10px] uppercase tracking-[0.18em] text-[#86868B]">
          empty canvas
        </div>
        <h3 className="text-[20px] font-semibold text-[#1D1D1F] tracking-tight">
          Drag a pump here to start your map
        </h3>
        <p className="text-[13px] text-[#424245] mt-2">
          Drop pumps from the palette, then drag from one handle to another to connect them. Click
          the label between two pumps to switch between series and parallel.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 text-[11px] text-[#86868B]">
          tip · press{" "}
          <kbd className="px-1.5 h-5 inline-flex items-center rounded border border-black/[0.10] num text-[#1D1D1F] bg-white/70">
            ?
          </kbd>{" "}
          for shortcuts
        </div>
      </div>
    </div>
  );
}

export function CanvasShell() {
  return (
    <ReactFlowProvider>
      <Inner />
    </ReactFlowProvider>
  );
}
