"use client";

import { cn } from "@/lib/utils";
import { Search, ArrowUpDown, X } from "lucide-react";
import type { PumpStatus } from "@/types";
import { useEffect, useRef } from "react";

export type SortKey = "health" | "name" | "location" | "age";
export type StatusFilter = "all" | PumpStatus;

const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "running", label: "Running" },
  { key: "standby", label: "Standby" },
  { key: "offline", label: "Offline" },
  { key: "maintenance", label: "Maintenance" },
];

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "health", label: "Health · lowest first" },
  { key: "name", label: "Name" },
  { key: "location", label: "Location" },
  { key: "age", label: "Newest" },
];

type Props = {
  query: string;
  onQueryChange: (v: string) => void;
  status: StatusFilter;
  onStatusChange: (s: StatusFilter) => void;
  sort: SortKey;
  onSortChange: (s: SortKey) => void;
  resultCount: number;
};

export function FilterBar({
  query, onQueryChange, status, onStatusChange, sort, onSortChange, resultCount,
}: Props) {
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="sticky top-16 z-20 -mx-6 px-6 py-3 mb-6 bg-[#F5F5F7]/40 backdrop-blur-xl">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[260px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A1A1A6] pointer-events-none" />
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search by model, serial, location"
            className="w-full h-10 pl-10 pr-10 rounded-full bg-white/35 hover:bg-white/55 border border-black/[0.08] text-sm text-[#1D1D1F] placeholder:text-[#A1A1A6] backdrop-blur-md focus:bg-white/70 focus:border-[#0A84FF]/35 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus:shadow-[0_0_0_4px_rgba(10,132,255,0.10)] transition-[background-color,border-color,box-shadow] duration-200 ease-out shadow-[0_1px_0_0_rgba(255,255,255,0.6)_inset]"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 h-5 rounded text-[9px] font-mono text-[#86868B] border border-black/[0.10] bg-white/70 inline-flex items-center pointer-events-none">/</kbd>
          {query && (
            <button
              onClick={() => onQueryChange("")}
              className="absolute right-9 top-1/2 -translate-y-1/2 text-[#A1A1A6] hover:text-[#1D1D1F]"
              aria-label="Clear"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="inline-flex items-center p-1 rounded-full bg-white/75 border border-black/[0.07] backdrop-blur-xl shadow-[0_1px_0_0_rgba(255,255,255,0.8)_inset,0_1px_2px_rgba(40,40,60,0.06)]">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s.key}
              onClick={() => onStatusChange(s.key)}
              className={cn(
                "h-8 px-3 rounded-full text-[11px] font-medium tracking-wide transition-colors",
                status === s.key
                  ? "bg-[#1D1D1F] text-white shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset]"
                  : "text-[#6E6E73] hover:text-[#1D1D1F]"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="text-[11px] text-[#86868B] num">
            {resultCount} {resultCount === 1 ? "pump" : "pumps"}
          </div>

          <div className="relative">
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as SortKey)}
              className="appearance-none h-8 pl-7 pr-3 rounded-full text-[11px] text-[#1D1D1F] bg-white/45 hover:bg-white/65 border border-black/[0.08] backdrop-blur-md focus:bg-white/75 focus:border-[#0A84FF]/35 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus:shadow-[0_0_0_4px_rgba(10,132,255,0.10)] cursor-pointer transition-[background-color,border-color,box-shadow] duration-200 ease-out shadow-[0_1px_0_0_rgba(255,255,255,0.6)_inset]"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.key} value={o.key} className="bg-white text-[#1D1D1F]">
                  {o.label}
                </option>
              ))}
            </select>
            <ArrowUpDown className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-[#6E6E73] pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
