"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import type { InstallationLayout, LayoutEdge, LayoutNode, SubsectionColor } from "@/types";
import { SEED_LAYOUT } from "@/lib/mock/seed";

type CanvasState = {
  layouts: InstallationLayout[];
  activeLayoutId: string;
  hydrated: boolean;
  setHydrated: () => void;

  getActive: () => InstallationLayout;
  setActive: (id: string) => void;
  renameLayout: (id: string, name: string) => void;
  newLayout: (name?: string) => string;
  deleteLayout: (id: string) => void;

  addNode: (pumpId: string, position: { x: number; y: number }) => string;
  updateNode: (id: string, patch: Partial<LayoutNode>) => void;
  moveNode: (id: string, position: { x: number; y: number }) => void;
  removeNode: (id: string) => void;
  toggleActive: (id: string) => void;

  addEdge: (e: Omit<LayoutEdge, "id"> & { id?: string }) => void;
  updateEdge: (id: string, patch: Partial<LayoutEdge>) => void;
  removeEdge: (id: string) => void;

  createSubsection: (pumpIds: string[], name: string, color: SubsectionColor) => string;
  renameSubsection: (id: string, name: string) => void;
  recolorSubsection: (id: string, color: SubsectionColor) => void;
  deleteSubsection: (id: string) => void;
  addPumpsToSubsection: (id: string, pumpIds: string[]) => void;
  removePumpFromSubsection: (subsectionId: string, pumpId: string) => void;

  resetActiveLayout: () => void;
  touch: () => void;
};

function patchActive(
  layouts: InstallationLayout[],
  activeId: string,
  fn: (l: InstallationLayout) => InstallationLayout
): InstallationLayout[] {
  return layouts.map((l) => (l.id === activeId ? fn(l) : l));
}

export const useCanvasStore = create<CanvasState>()(
  persist(
    (set, get) => ({
      layouts: [SEED_LAYOUT],
      activeLayoutId: SEED_LAYOUT.id,
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),

      getActive: () => {
        const { layouts, activeLayoutId } = get();
        return layouts.find((l) => l.id === activeLayoutId) ?? layouts[0];
      },

      setActive: (id) => set({ activeLayoutId: id }),

      renameLayout: (id, name) =>
        set((s) => ({
          layouts: s.layouts.map((l) => (l.id === id ? { ...l, name, updatedAt: new Date().toISOString() } : l)),
        })),

      newLayout: (name) => {
        const id = `layout-${nanoid(6)}`;
        const layout: InstallationLayout = {
          id,
          name: name ?? "Untitled layout",
          nodes: [],
          edges: [],
          subsections: [],
          updatedAt: new Date().toISOString(),
        };
        set((s) => ({ layouts: [...s.layouts, layout], activeLayoutId: id }));
        return id;
      },

      deleteLayout: (id) =>
        set((s) => {
          const remaining = s.layouts.filter((l) => l.id !== id);
          if (remaining.length === 0) {
            const fresh: InstallationLayout = {
              id: `layout-${nanoid(6)}`,
              name: "Untitled layout",
              nodes: [],
              edges: [],
              subsections: [],
              updatedAt: new Date().toISOString(),
            };
            return { layouts: [fresh], activeLayoutId: fresh.id };
          }
          return {
            layouts: remaining,
            activeLayoutId: remaining[0].id,
          };
        }),

      addNode: (pumpId, position) => {
        const id = `n-${nanoid(6)}`;
        set((s) => ({
          layouts: patchActive(s.layouts, s.activeLayoutId, (l) => ({
            ...l,
            nodes: [...l.nodes, { id, pumpId, position, active: true }],
            updatedAt: new Date().toISOString(),
          })),
        }));
        return id;
      },

      updateNode: (id, patch) =>
        set((s) => ({
          layouts: patchActive(s.layouts, s.activeLayoutId, (l) => ({
            ...l,
            nodes: l.nodes.map((n) => (n.id === id ? { ...n, ...patch } : n)),
            updatedAt: new Date().toISOString(),
          })),
        })),

      moveNode: (id, position) =>
        set((s) => ({
          layouts: patchActive(s.layouts, s.activeLayoutId, (l) => ({
            ...l,
            nodes: l.nodes.map((n) => (n.id === id ? { ...n, position } : n)),
          })),
        })),

      removeNode: (id) =>
        set((s) => ({
          layouts: patchActive(s.layouts, s.activeLayoutId, (l) => ({
            ...l,
            nodes: l.nodes.filter((n) => n.id !== id),
            edges: l.edges.filter((e) => e.source !== id && e.target !== id),
            subsections: (l.subsections ?? [])
              .map((sub) => ({ ...sub, pumpIds: sub.pumpIds.filter((p) => p !== id) }))
              .filter((sub) => sub.pumpIds.length > 0),
            updatedAt: new Date().toISOString(),
          })),
        })),

      toggleActive: (id) =>
        set((s) => ({
          layouts: patchActive(s.layouts, s.activeLayoutId, (l) => ({
            ...l,
            nodes: l.nodes.map((n) => (n.id === id ? { ...n, active: !n.active } : n)),
            updatedAt: new Date().toISOString(),
          })),
        })),

      addEdge: (e) =>
        set((s) => ({
          layouts: patchActive(s.layouts, s.activeLayoutId, (l) => ({
            ...l,
            edges: [...l.edges, { ...e, id: e.id ?? `e-${nanoid(6)}` } as LayoutEdge],
            updatedAt: new Date().toISOString(),
          })),
        })),

      updateEdge: (id, patch) =>
        set((s) => ({
          layouts: patchActive(s.layouts, s.activeLayoutId, (l) => ({
            ...l,
            edges: l.edges.map((e) => (e.id === id ? { ...e, ...patch } : e)),
            updatedAt: new Date().toISOString(),
          })),
        })),

      removeEdge: (id) =>
        set((s) => ({
          layouts: patchActive(s.layouts, s.activeLayoutId, (l) => ({
            ...l,
            edges: l.edges.filter((e) => e.id !== id),
            updatedAt: new Date().toISOString(),
          })),
        })),

      createSubsection: (pumpIds, name, color) => {
        const id = `sub-${nanoid(6)}`;
        set((s) => ({
          layouts: patchActive(s.layouts, s.activeLayoutId, (l) => {
            const existing = l.subsections ?? [];
            const stripped = existing
              .map((sub) => ({ ...sub, pumpIds: sub.pumpIds.filter((p) => !pumpIds.includes(p)) }))
              .filter((sub) => sub.pumpIds.length > 0);
            return {
              ...l,
              subsections: [...stripped, { id, name, color, pumpIds: [...pumpIds] }],
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
        return id;
      },

      renameSubsection: (id, name) =>
        set((s) => ({
          layouts: patchActive(s.layouts, s.activeLayoutId, (l) => ({
            ...l,
            subsections: (l.subsections ?? []).map((sub) => (sub.id === id ? { ...sub, name } : sub)),
            updatedAt: new Date().toISOString(),
          })),
        })),

      recolorSubsection: (id, color) =>
        set((s) => ({
          layouts: patchActive(s.layouts, s.activeLayoutId, (l) => ({
            ...l,
            subsections: (l.subsections ?? []).map((sub) => (sub.id === id ? { ...sub, color } : sub)),
            updatedAt: new Date().toISOString(),
          })),
        })),

      deleteSubsection: (id) =>
        set((s) => ({
          layouts: patchActive(s.layouts, s.activeLayoutId, (l) => ({
            ...l,
            subsections: (l.subsections ?? []).filter((sub) => sub.id !== id),
            updatedAt: new Date().toISOString(),
          })),
        })),

      addPumpsToSubsection: (id, pumpIds) =>
        set((s) => ({
          layouts: patchActive(s.layouts, s.activeLayoutId, (l) => {
            const existing = l.subsections ?? [];
            const stripped = existing
              .map((sub) =>
                sub.id === id ? sub : { ...sub, pumpIds: sub.pumpIds.filter((p) => !pumpIds.includes(p)) }
              )
              .filter((sub) => sub.id === id || sub.pumpIds.length > 0);
            return {
              ...l,
              subsections: stripped.map((sub) =>
                sub.id === id
                  ? { ...sub, pumpIds: Array.from(new Set([...sub.pumpIds, ...pumpIds])) }
                  : sub
              ),
              updatedAt: new Date().toISOString(),
            };
          }),
        })),

      removePumpFromSubsection: (subsectionId, pumpId) =>
        set((s) => ({
          layouts: patchActive(s.layouts, s.activeLayoutId, (l) => ({
            ...l,
            subsections: (l.subsections ?? [])
              .map((sub) =>
                sub.id === subsectionId ? { ...sub, pumpIds: sub.pumpIds.filter((p) => p !== pumpId) } : sub
              )
              .filter((sub) => sub.pumpIds.length > 0),
            updatedAt: new Date().toISOString(),
          })),
        })),

      resetActiveLayout: () =>
        set((s) => ({
          layouts: patchActive(s.layouts, s.activeLayoutId, (l) => ({
            ...l,
            nodes: [],
            edges: [],
            subsections: [],
            updatedAt: new Date().toISOString(),
          })),
        })),

      touch: () =>
        set((s) => ({
          layouts: patchActive(s.layouts, s.activeLayoutId, (l) => ({
            ...l,
            updatedAt: new Date().toISOString(),
          })),
        })),
    }),
    {
      name: "giw-canvas-v1",
      version: 2,
      migrate: (persisted, fromVersion) => {
        if (!persisted || typeof persisted !== "object") return persisted as never;
        const state = persisted as { layouts?: InstallationLayout[]; activeLayoutId?: string };
        let layouts = state.layouts;
        if (fromVersion < 1 && Array.isArray(layouts)) {
          layouts = layouts.map((l) =>
            l.id === "layout-001" && l.name === "Mill Circuit · Pit B" ? SEED_LAYOUT : l
          );
        }
        if (fromVersion < 2 && Array.isArray(layouts)) {
          layouts = layouts.map((l) => ({ ...l, subsections: l.subsections ?? [] }));
        }
        return { ...state, layouts } as never;
      },
      skipHydration: true,
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    }
  )
);
