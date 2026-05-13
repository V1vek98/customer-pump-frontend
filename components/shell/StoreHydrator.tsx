"use client";

import { useEffect } from "react";
import { useFleetStore } from "@/lib/store/fleet";
import { useCanvasStore } from "@/lib/store/canvas";

/**
 * Triggers rehydration of persisted Zustand stores after mount.
 * Combined with `skipHydration: true` this guarantees the server
 * and the client's first paint use the same initial state, then
 * localStorage values get applied silently on the client.
 */
export function StoreHydrator() {
  useEffect(() => {
    useFleetStore.persist.rehydrate();
    useCanvasStore.persist.rehydrate();
  }, []);
  return null;
}
