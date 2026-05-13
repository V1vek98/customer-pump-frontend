export type ComponentName =
  | "casing"
  | "suction_liner"
  | "impeller"
  | "suction_plate"
  | "discharge_liner"
  | "shaft_sleeve"
  | "bearing_assembly";

export type PumpComponent = {
  id: string;
  name: ComponentName;
  displayName: string;
  partNumber: string;
  healthPercent: number;
  remainingHours: number;
  installedAt: string;
  lastInspectedAt: string;
  wearTrend: number[];
};

export type PumpStatus = "running" | "standby" | "offline" | "maintenance";

export type PumpVariant = "lsa" | "lcc" | "mdx" | "generic";

export type Pump = {
  id: string;
  isThirdParty: boolean;
  manufacturer: string;
  model: string;
  serial: string;
  nickname?: string;
  location: string;
  installedAt: string;
  totalRunHours: number;
  status: PumpStatus;
  components: PumpComponent[];
  imageVariant: PumpVariant;
  notes?: string;
  photoDataUrl?: string;
};

export type LayoutNode = {
  id: string;
  pumpId: string;
  position: { x: number; y: number };
  active: boolean;
  role?: "lead" | "standby";
};

export type LayoutEdge = {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  kind: "series" | "parallel";
};

export type InstallationLayout = {
  id: string;
  name: string;
  nodes: LayoutNode[];
  edges: LayoutEdge[];
  updatedAt: string;
};

export type Customer = {
  id: string;
  name: string;
};
