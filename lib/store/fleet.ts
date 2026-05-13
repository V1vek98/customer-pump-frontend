"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import type { Pump } from "@/types";
import { SEED_CUSTOMER, SEED_PUMPS } from "@/lib/mock/seed";

type FleetState = {
  customerName: string;
  pumps: Pump[];
  hydrated: boolean;
  setHydrated: () => void;
  addThirdParty: (p: Omit<Pump, "id" | "isThirdParty" | "components" | "imageVariant"> & { imageVariant?: Pump["imageVariant"] }) => Pump;
  updatePump: (id: string, patch: Partial<Pump>) => void;
  removePump: (id: string) => void;
};

export const useFleetStore = create<FleetState>()(
  persist(
    (set) => ({
      customerName: SEED_CUSTOMER.name,
      pumps: SEED_PUMPS,
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      addThirdParty: (p) => {
        const pump: Pump = {
          id: `tp-${nanoid(8)}`,
          isThirdParty: true,
          manufacturer: p.manufacturer,
          model: p.model,
          serial: p.serial,
          nickname: p.nickname,
          location: p.location,
          installedAt: p.installedAt,
          totalRunHours: p.totalRunHours,
          status: p.status,
          components: [],
          imageVariant: p.imageVariant ?? "generic",
          notes: p.notes,
          photoDataUrl: p.photoDataUrl,
        };
        set((s) => ({ pumps: [pump, ...s.pumps] }));
        return pump;
      },
      updatePump: (id, patch) =>
        set((s) => ({
          pumps: s.pumps.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),
      removePump: (id) =>
        set((s) => ({ pumps: s.pumps.filter((p) => p.id !== id) })),
    }),
    {
      name: "giw-fleet-v1",
      skipHydration: true,
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    }
  )
);
