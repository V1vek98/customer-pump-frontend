import type { ComponentName, PumpVariant } from "@/types";

export const VIEW_BOX = { width: 480, height: 320 } as const;

export const PART_Z_ORDER: ComponentName[] = [
  "bearing_assembly",
  "discharge_liner",
  "suction_liner",
  "impeller",
  "shaft_sleeve",
  "casing",
  "suction_plate",
];

export type DisassemblyEntry = {
  axis: [number, number];
  altAxis?: [number, number];
  distance: number;
  rotate?: number;
  anchor: [number, number];
  labelOffset?: number;
};

export type VariantGeometry = Record<ComponentName, DisassemblyEntry>;

export const DISASSEMBLY: Record<PumpVariant, VariantGeometry> = {
  lsa: {
    casing: {
      axis: [-0.16, 0.98],
      altAxis: [0.16, -0.98],
      distance: 38,
      anchor: [196, 174],
      labelOffset: 22,
    },
    suction_plate: {
      axis: [-1, 0.18],
      distance: 44,
      anchor: [98, 168],
      labelOffset: 26,
    },
    suction_liner: {
      axis: [-1, 0.18],
      distance: 22,
      anchor: [134, 168],
      labelOffset: 20,
    },
    impeller: {
      axis: [1, -0.18],
      distance: 60,
      rotate: 8,
      anchor: [196, 162],
      labelOffset: 24,
    },
    discharge_liner: {
      axis: [0.62, -0.78],
      distance: 30,
      anchor: [240, 116],
      labelOffset: 22,
    },
    shaft_sleeve: {
      axis: [1, -0.1],
      distance: 32,
      anchor: [266, 158],
      labelOffset: 18,
    },
    bearing_assembly: {
      axis: [1, -0.05],
      distance: 48,
      anchor: [360, 178],
      labelOffset: 24,
    },
  },
  lcc: {
    casing: {
      axis: [-0.16, 0.98],
      altAxis: [0.16, -0.98],
      distance: 32,
      anchor: [156, 174],
      labelOffset: 20,
    },
    suction_plate: {
      axis: [-1, 0.18],
      distance: 40,
      anchor: [76, 168],
      labelOffset: 24,
    },
    suction_liner: {
      axis: [-1, 0.18],
      distance: 20,
      anchor: [108, 168],
      labelOffset: 18,
    },
    impeller: {
      axis: [1, -0.18],
      distance: 54,
      rotate: 8,
      anchor: [156, 168],
      labelOffset: 22,
    },
    discharge_liner: {
      axis: [0, -1],
      distance: 32,
      anchor: [156, 92],
      labelOffset: 22,
    },
    shaft_sleeve: {
      axis: [1, -0.08],
      distance: 30,
      anchor: [230, 164],
      labelOffset: 18,
    },
    bearing_assembly: {
      axis: [1, -0.05],
      distance: 50,
      anchor: [344, 178],
      labelOffset: 26,
    },
  },
  mdx: {
    casing: {
      axis: [-0.18, 0.98],
      altAxis: [0.18, -0.98],
      distance: 42,
      anchor: [184, 178],
      labelOffset: 24,
    },
    suction_plate: {
      axis: [-1, 0.18],
      distance: 46,
      anchor: [84, 170],
      labelOffset: 26,
    },
    suction_liner: {
      axis: [-1, 0.18],
      distance: 22,
      anchor: [118, 170],
      labelOffset: 20,
    },
    impeller: {
      axis: [1, -0.18],
      distance: 58,
      rotate: 8,
      anchor: [188, 168],
      labelOffset: 24,
    },
    discharge_liner: {
      axis: [0, -1],
      distance: 36,
      anchor: [188, 84],
      labelOffset: 26,
    },
    shaft_sleeve: {
      axis: [1, -0.08],
      distance: 28,
      anchor: [258, 168],
      labelOffset: 18,
    },
    bearing_assembly: {
      axis: [0.2, -1],
      distance: 50,
      anchor: [336, 184],
      labelOffset: 24,
    },
  },
  generic: {
    casing: {
      axis: [-0.16, 0.98],
      altAxis: [0.16, -0.98],
      distance: 34,
      anchor: [168, 174],
      labelOffset: 22,
    },
    suction_plate: {
      axis: [-1, 0.18],
      distance: 42,
      anchor: [78, 168],
      labelOffset: 26,
    },
    suction_liner: {
      axis: [-1, 0.18],
      distance: 20,
      anchor: [114, 168],
      labelOffset: 20,
    },
    impeller: {
      axis: [1, -0.18],
      distance: 54,
      rotate: 8,
      anchor: [168, 166],
      labelOffset: 22,
    },
    discharge_liner: {
      axis: [0.78, -0.62],
      distance: 30,
      anchor: [210, 116],
      labelOffset: 22,
    },
    shaft_sleeve: {
      axis: [1, -0.08],
      distance: 28,
      anchor: [248, 168],
      labelOffset: 18,
    },
    bearing_assembly: {
      axis: [0.2, -1],
      distance: 46,
      anchor: [332, 184],
      labelOffset: 24,
    },
  },
};

export const GENERIC_PART_LABELS: Record<ComponentName, { displayName: string; partNumber: string }> = {
  casing: { displayName: "Casing", partNumber: "Volute body" },
  suction_liner: { displayName: "Suction Liner", partNumber: "Wet end liner" },
  impeller: { displayName: "Impeller", partNumber: "Rotating element" },
  suction_plate: { displayName: "Suction Plate", partNumber: "Front cover" },
  discharge_liner: { displayName: "Discharge Liner", partNumber: "Throat insert" },
  shaft_sleeve: { displayName: "Shaft Sleeve", partNumber: "Wear sleeve" },
  bearing_assembly: { displayName: "Bearing Assembly", partNumber: "Drive end" },
};

export const VARIANT_ACCENT: Record<PumpVariant, string> = {
  lsa: "#E6A810",
  lcc: "#1AAFA5",
  mdx: "#E0508A",
  generic: "#86868B",
};

export const VARIANT_ACCENT_SOFT: Record<PumpVariant, string> = {
  lsa: "#FFC233",
  lcc: "#3FD4CA",
  mdx: "#FF7BAA",
  generic: "#A1A1A6",
};

export type RenderMode = "detail" | "silhouette-color" | "silhouette-flat" | "glyph";

export function sizeToMode(size: "card" | "node" | "hero" | "thumb"): RenderMode {
  switch (size) {
    case "hero":
      return "detail";
    case "card":
      return "silhouette-color";
    case "node":
      return "silhouette-flat";
    case "thumb":
      return "glyph";
  }
}
