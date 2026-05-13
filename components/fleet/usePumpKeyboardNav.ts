"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Pump } from "@/types";

export function usePumpKeyboardNav(filtered: Pump[], selectedId: string | undefined) {
  const router = useRouter();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = document.activeElement as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (!filtered.length) return;
      const idx = filtered.findIndex((p) => p.id === selectedId);

      if (e.key === "j" || e.key === "ArrowDown") {
        e.preventDefault();
        const next = filtered[idx < 0 ? 0 : Math.min(idx + 1, filtered.length - 1)];
        router.replace(`/fleet/${next.id}`, { scroll: false });
      } else if (e.key === "k" || e.key === "ArrowUp") {
        e.preventDefault();
        const prev = filtered[idx < 0 ? 0 : Math.max(idx - 1, 0)];
        router.replace(`/fleet/${prev.id}`, { scroll: false });
      } else if (e.key === "Escape") {
        router.push("/fleet");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [filtered, selectedId, router]);
}
