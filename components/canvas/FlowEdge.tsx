"use client";

import {
  BaseEdge,
  EdgeLabelRenderer,
  getStraightPath,
  type EdgeProps,
} from "@xyflow/react";
import { useCanvasStore } from "@/lib/store/canvas";

export type FlowEdgeData = {
  kind: "series" | "parallel";
  active: boolean;
};

export function FlowEdge(props: EdgeProps) {
  const { id, sourceX, sourceY, targetX, targetY, data, selected } = props;
  const d = data as unknown as FlowEdgeData;
  const updateEdge = useCanvasStore((s) => s.updateEdge);
  const removeEdge = useCanvasStore((s) => s.removeEdge);

  const [path, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const color = d.active ? "#E6A810" : "#A1A1A6";

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        style={{
          stroke: color,
          strokeWidth: selected ? 3 : 2,
          opacity: d.active ? 0.95 : 0.55,
          filter: d.active ? `drop-shadow(0 0 6px ${color}66)` : "none",
        }}
      />
      {d.active && (
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeDasharray="6 10"
          strokeOpacity={0.95}
          style={{ animation: "flow-dash 1.2s linear infinite" }}
          pointerEvents="none"
        />
      )}

      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          <button
            onClick={() => updateEdge(id, { kind: d.kind === "series" ? "parallel" : "series" })}
            onDoubleClick={() => removeEdge(id)}
            className="inline-flex items-center gap-1 h-6 px-2 rounded-full text-[10px] font-medium tracking-wide uppercase backdrop-blur-xl transition-colors"
            style={{
              background: d.kind === "series" ? "rgba(255,194,51,0.55)" : "rgba(48,182,92,0.50)",
              border: `1px solid ${d.kind === "series" ? "rgba(255,194,51,0.70)" : "rgba(48,182,92,0.65)"}`,
              color: d.kind === "series" ? "#8A5A00" : "#1F7A3D",
              boxShadow: "0 0 0 4px rgba(255,255,255,0.65), 0 1px 2px rgba(40,40,60,0.10)",
            }}
            title={`Click: switch · Double-click: remove`}
          >
            {d.kind}
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
