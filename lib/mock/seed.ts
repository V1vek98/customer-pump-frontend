import type { Customer, InstallationLayout, Pump, PumpComponent, PumpVariant } from "@/types";

const COMPONENT_BASES: Array<{
  name: PumpComponent["name"];
  displayName: string;
  abbr: string;
}> = [
  { name: "casing", displayName: "Pump Casing", abbr: "CSG" },
  { name: "suction_liner", displayName: "Suction Liner", abbr: "SL" },
  { name: "impeller", displayName: "Impeller", abbr: "IMP" },
  { name: "suction_plate", displayName: "Suction Plate", abbr: "SP" },
  { name: "discharge_liner", displayName: "Discharge Liner", abbr: "DL" },
  { name: "shaft_sleeve", displayName: "Shaft Sleeve", abbr: "SS" },
  { name: "bearing_assembly", displayName: "Bearing Assembly", abbr: "BA" },
];

type CompSpec = Partial<Record<PumpComponent["name"], { health: number; remaining: number; installedDaysAgo?: number; inspectedDaysAgo?: number }>>;

// Frozen epoch keeps SSR / CSR deterministic.
const FROZEN_NOW = new Date("2026-05-11T12:00:00Z").getTime();

function makeComponents(modelKey: string, spec: CompSpec): PumpComponent[] {
  return COMPONENT_BASES.map((b, i) => {
    const s = spec[b.name] ?? { health: 80, remaining: 3000 };
    const installedDaysAgo = s.installedDaysAgo ?? 240 + i * 30;
    const inspectedDaysAgo = s.inspectedDaysAgo ?? 14;
    const trend: number[] = [];
    const start = Math.min(100, s.health + 18);
    for (let k = 0; k < 12; k++) {
      const wobble = Math.sin((i + 1) * 0.7 + k * 0.9) * 1.2;
      const linear = start - (k / 11) * (start - s.health);
      trend.push(Math.max(0, Math.round(linear + wobble)));
    }
    return {
      id: `${modelKey}-${b.name}`,
      name: b.name,
      displayName: b.displayName,
      partNumber: `GIW-${modelKey.toUpperCase()}-${b.abbr}-${String(i + 1).padStart(2, "0")}`,
      healthPercent: s.health,
      remainingHours: s.remaining,
      installedAt: new Date(FROZEN_NOW - installedDaysAgo * 86400000).toISOString(),
      lastInspectedAt: new Date(FROZEN_NOW - inspectedDaysAgo * 86400000).toISOString(),
      wearTrend: trend,
    };
  });
}

function mkPump(p: {
  id: string;
  model: string;
  serial: string;
  nickname: string;
  location: string;
  variant: PumpVariant;
  status: Pump["status"];
  hours: number;
  installedDaysAgo: number;
  spec: CompSpec;
  isThirdParty?: boolean;
  manufacturer?: string;
  notes?: string;
}): Pump {
  return {
    id: p.id,
    isThirdParty: !!p.isThirdParty,
    manufacturer: p.manufacturer ?? "KSB GIW",
    model: p.model,
    serial: p.serial,
    nickname: p.nickname,
    location: p.location,
    installedAt: new Date(FROZEN_NOW - p.installedDaysAgo * 86400000).toISOString(),
    totalRunHours: p.hours,
    status: p.status,
    imageVariant: p.variant,
    components: p.isThirdParty ? [] : makeComponents(p.id, p.spec),
    notes: p.notes,
  };
}

export const SEED_CUSTOMER: Customer = {
  id: "cust-001",
  name: "Gold Cap Mining Co.",
};

export const SEED_PUMPS: Pump[] = [
  mkPump({
    id: "lsa14-001",
    model: "LSA-14×12-44",
    serial: "GIW-2023-08-1014",
    nickname: "Mill Discharge 1",
    location: "Mill Circuit · Pit B",
    variant: "lsa",
    status: "running",
    hours: 4210,
    installedDaysAgo: 520,
    spec: {
      casing: { health: 92, remaining: 4200 },
      suction_liner: { health: 68, remaining: 1650 },
      impeller: { health: 41, remaining: 820 },
      suction_plate: { health: 88, remaining: 3900 },
      discharge_liner: { health: 73, remaining: 2100 },
      shaft_sleeve: { health: 95, remaining: 5400 },
      bearing_assembly: { health: 81, remaining: 3200 },
    },
  }),
  mkPump({
    id: "lsa14-002",
    model: "LSA-14×12-44",
    serial: "GIW-2023-08-1015",
    nickname: "Mill Discharge 2",
    location: "Mill Circuit · Pit B",
    variant: "lsa",
    status: "standby",
    hours: 3140,
    installedDaysAgo: 510,
    spec: {
      casing: { health: 94, remaining: 4500 },
      suction_liner: { health: 78, remaining: 2400 },
      impeller: { health: 71, remaining: 1900 },
      suction_plate: { health: 90, remaining: 4100 },
      discharge_liner: { health: 82, remaining: 2900 },
      shaft_sleeve: { health: 96, remaining: 5800 },
      bearing_assembly: { health: 87, remaining: 3700 },
    },
  }),
  mkPump({
    id: "mdx300-001",
    model: "MDX-300",
    serial: "GIW-2022-11-0782",
    nickname: "Tailings Booster A",
    location: "Tailings Line · Stage 1",
    variant: "mdx",
    status: "running",
    hours: 7820,
    installedDaysAgo: 760,
    spec: {
      casing: { health: 74, remaining: 2100 },
      suction_liner: { health: 33, remaining: 410 },
      impeller: { health: 22, remaining: 280 },
      suction_plate: { health: 64, remaining: 1500 },
      discharge_liner: { health: 51, remaining: 950 },
      shaft_sleeve: { health: 80, remaining: 2700 },
      bearing_assembly: { health: 68, remaining: 1800 },
    },
  }),
  mkPump({
    id: "mdx300-002",
    model: "MDX-300",
    serial: "GIW-2022-11-0783",
    nickname: "Tailings Booster B",
    location: "Tailings Line · Stage 1",
    variant: "mdx",
    status: "standby",
    hours: 6920,
    installedDaysAgo: 720,
    spec: {
      casing: { health: 78, remaining: 2350 },
      suction_liner: { health: 48, remaining: 900 },
      impeller: { health: 39, remaining: 640 },
      suction_plate: { health: 70, remaining: 1800 },
      discharge_liner: { health: 58, remaining: 1200 },
      shaft_sleeve: { health: 84, remaining: 3100 },
      bearing_assembly: { health: 72, remaining: 2000 },
    },
  }),
  mkPump({
    id: "lcc100-001",
    model: "LCC-100",
    serial: "GIW-2024-03-2210",
    nickname: "Cyclone Feed 1",
    location: "Cyclone Cluster · Pit A",
    variant: "lcc",
    status: "running",
    hours: 1450,
    installedDaysAgo: 220,
    spec: {
      casing: { health: 97, remaining: 6200 },
      suction_liner: { health: 89, remaining: 4100 },
      impeller: { health: 84, remaining: 3300 },
      suction_plate: { health: 96, remaining: 5800 },
      discharge_liner: { health: 91, remaining: 4600 },
      shaft_sleeve: { health: 98, remaining: 6800 },
      bearing_assembly: { health: 93, remaining: 5100 },
    },
  }),
  mkPump({
    id: "lcc100-002",
    model: "LCC-100",
    serial: "GIW-2024-03-2211",
    nickname: "Cyclone Feed 2",
    location: "Cyclone Cluster · Pit A",
    variant: "lcc",
    status: "offline",
    hours: 1380,
    installedDaysAgo: 220,
    spec: {
      casing: { health: 96, remaining: 6100 },
      suction_liner: { health: 86, remaining: 3900 },
      impeller: { health: 82, remaining: 3100 },
      suction_plate: { health: 94, remaining: 5500 },
      discharge_liner: { health: 89, remaining: 4300 },
      shaft_sleeve: { health: 97, remaining: 6500 },
      bearing_assembly: { health: 91, remaining: 4900 },
    },
  }),
  mkPump({
    id: "warman-001",
    model: "8/6 AH",
    serial: "WW-2021-554",
    nickname: "Process Slurry 1",
    location: "Process Plant · West",
    variant: "generic",
    status: "running",
    hours: 11420,
    installedDaysAgo: 1280,
    spec: {},
    isThirdParty: true,
    manufacturer: "Warman / Weir",
    notes: "Legacy install from previous operator.",
  }),
  mkPump({
    id: "metso-001",
    model: "HM 200",
    serial: "MT-2022-031",
    nickname: "Process Slurry 2",
    location: "Process Plant · West",
    variant: "generic",
    status: "maintenance",
    hours: 5380,
    installedDaysAgo: 640,
    spec: {},
    isThirdParty: true,
    manufacturer: "Metso",
    notes: "Currently down for casing inspection.",
  }),
];

export const SEED_LAYOUT: InstallationLayout = {
  id: "layout-001",
  name: "Site map",
  updatedAt: new Date(FROZEN_NOW).toISOString(),
  nodes: [],
  edges: [],
};
