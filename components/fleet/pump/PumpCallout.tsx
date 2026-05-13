"use client";

import { motion } from "framer-motion";
import { CALLOUT_FADE } from "./detail-presets";

type Props = {
  anchor: [number, number];
  axis: [number, number];
  distance: number;
  labelOffset?: number;
  displayName: string;
  partNumber?: string;
  accent: string;
};

export function PumpCallout({
  anchor,
  axis,
  distance,
  labelOffset = 24,
  displayName,
  partNumber,
  accent,
}: Props) {
  const [ax, ay] = anchor;
  const [dx, dy] = axis;

  // Tip of the connector sits just past the lifted part center.
  const tipX = ax + dx * distance;
  const tipY = ay + dy * distance;

  // Chip anchor sits further along the axis.
  const chipCenterX = ax + dx * (distance + labelOffset);
  const chipCenterY = ay + dy * (distance + labelOffset);

  const chipW = 132;
  const chipH = 42;

  // Choose chip corner based on which side of the lifted part it sits.
  const chipX = chipCenterX - chipW / 2 + dx * (chipW / 2);
  const chipY = chipCenterY - chipH / 2 + dy * (chipH / 2);

  return (
    <motion.g variants={CALLOUT_FADE} initial="hidden" animate="shown" exit="hidden">
      <line
        x1={tipX}
        y1={tipY}
        x2={chipCenterX}
        y2={chipCenterY}
        stroke={accent}
        strokeOpacity="0.7"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <circle cx={tipX} cy={tipY} r="2" fill={accent} />

      <foreignObject x={chipX} y={chipY} width={chipW} height={chipH} style={{ overflow: "visible" }}>
        <div
          style={{
            width: chipW,
            height: chipH,
            background: "rgba(255,255,255,0.96)",
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "0 1px 0 rgba(255,255,255,0.8) inset, 0 6px 18px -8px rgba(40,40,60,0.30)",
            borderRadius: 12,
            padding: "5px 10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 1,
            fontFamily: "var(--font-sans)",
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#1D1D1F",
              letterSpacing: "-0.005em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              lineHeight: 1.15,
            }}
          >
            {displayName}
          </div>
          {partNumber && (
            <div
              style={{
                fontSize: 9.5,
                fontFamily: "var(--font-mono)",
                color: "#86868B",
                letterSpacing: "0.02em",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                lineHeight: 1.15,
              }}
            >
              {partNumber}
            </div>
          )}
        </div>
      </foreignObject>
    </motion.g>
  );
}
