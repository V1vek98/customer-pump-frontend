"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useFleetStore } from "@/lib/store/fleet";
import { overallHealth } from "@/lib/health";
import { FilterBar, type SortKey, type StatusFilter } from "./FilterBar";
import { FleetGrid } from "./FleetGrid";
import { MasterDetail } from "./MasterDetail";
import { AddThirdPartyPumpSheet } from "@/components/forms/AddThirdPartyPumpSheet";
import { GlassButton } from "@/components/primitives/GlassButton";
import { PageContainer } from "@/components/shell/PageContainer";
import { Plus, ArrowLeft } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Pump } from "@/types";
import Link from "next/link";

export function FleetShell({ children }: { children?: React.ReactNode }) {
  const pumps = useFleetStore((s) => s.pumps);
  const customerName = useFleetStore((s) => s.customerName);
  const params = useParams<{ pumpId?: string }>();
  const selectedId = params?.pumpId;

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortKey>("health");
  const [addOpen, setAddOpen] = useState(false);
  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(() => {
    let list = pumps.slice();
    if (status !== "all") list = list.filter((p) => p.status === status);
    if (deferredQuery.trim()) {
      const q = deferredQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.model.toLowerCase().includes(q) ||
          p.serial.toLowerCase().includes(q) ||
          (p.nickname ?? "").toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.manufacturer.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      if (sort === "name") return a.model.localeCompare(b.model);
      if (sort === "location") return a.location.localeCompare(b.location);
      if (sort === "age") return new Date(b.installedAt).getTime() - new Date(a.installedAt).getTime();
      const ha = a.isThirdParty ? 101 : overallHealth(a);
      const hb = b.isThirdParty ? 101 : overallHealth(b);
      return ha - hb;
    });
    return list;
  }, [pumps, deferredQuery, status, sort]);

  const inDetail = !!selectedId;
  const selected = selectedId ? pumps.find((p) => p.id === selectedId) : undefined;
  const reduce = useReducedMotion();
  const slideTransition = reduce
    ? { duration: 0.08 }
    : { duration: 0.2, ease: [0.32, 0.72, 0, 1] as const };

  return (
    <PageContainer>
      <section className="pt-6">
        {inDetail ? (
          <DetailHeader pump={selected} onAdd={() => setAddOpen(true)} />
        ) : (
          <GridHeader
            customerName={customerName}
            pumps={pumps}
            onAdd={() => setAddOpen(true)}
          />
        )}

        <FilterBar
          query={query}
          onQueryChange={setQuery}
          status={status}
          onStatusChange={setStatus}
          sort={sort}
          onSortChange={setSort}
          resultCount={filtered.length}
        />

        <AnimatePresence mode="wait" initial={false}>
          {inDetail ? (
            <motion.div
              key="detail"
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: 12 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: 12 }}
              transition={slideTransition}
            >
              <MasterDetail
                filtered={filtered}
                selectedId={selectedId!}
                selected={selected}
              />
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: -12 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: -12 }}
              transition={slideTransition}
            >
              <FleetGrid filtered={filtered} cleared={!!query || status !== "all"} onAdd={() => setAddOpen(true)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Children renders nothing visible — pages are intentionally empty,
            since FleetShell drives the layout. We still render it so that
            `loading.js` / `error.js` boundaries placed at the page level
            (if added later) keep working as expected. */}
        <div hidden>{children}</div>
      </section>

      <AnimatePresence>
        {addOpen && <AddThirdPartyPumpSheet onClose={() => setAddOpen(false)} />}
      </AnimatePresence>
    </PageContainer>
  );
}

function GridHeader({
  customerName,
  pumps,
  onAdd,
}: {
  customerName: string;
  pumps: Pump[];
  onAdd: () => void;
}) {
  return (
    <header className="flex items-end justify-between mb-6">
      <div>
        <p className="text-[11px] text-[#86868B] uppercase tracking-[0.18em] mb-2">{customerName}</p>
        <h1 className="text-[34px] font-semibold text-[#1D1D1F] tracking-tight leading-tight">
          Your fleet
        </h1>
        <p className="text-sm text-[#6E6E73] mt-2 max-w-md text-balance">
          Every pump on site, with live health on each wear part. Hover to inspect, click to drill in.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <FleetSummary pumps={pumps} />
        <GlassButton variant="primary" onClick={onAdd}>
          <Plus className="h-4 w-4" />
          Add a pump
        </GlassButton>
      </div>
    </header>
  );
}

function DetailHeader({ pump, onAdd }: { pump: Pump | undefined; onAdd: () => void }) {
  return (
    <header className="flex items-end justify-between mb-6">
      <div className="min-w-0">
        <Link
          href="/fleet"
          className="inline-flex items-center gap-1.5 text-[11px] text-[#6E6E73] hover:text-[#1D1D1F] uppercase tracking-[0.18em] mb-2 transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to fleet
        </Link>
        <h1 className="text-[28px] font-semibold text-[#1D1D1F] tracking-tight leading-tight truncate">
          {pump ? pump.model : "Pump"}
        </h1>
        {pump?.nickname && (
          <p className="text-sm text-[#6E6E73] mt-1 truncate">&quot;{pump.nickname}&quot;</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <GlassButton variant="glass" onClick={onAdd}>
          <Plus className="h-4 w-4" />
          Add a pump
        </GlassButton>
      </div>
    </header>
  );
}

function FleetSummary({ pumps }: { pumps: Pump[] }) {
  const running = pumps.filter((p) => p.status === "running").length;
  const needs = pumps.filter((p) => !p.isThirdParty && overallHealth(p) < 60).length;
  return (
    <div className="hidden md:flex items-center gap-4 mr-2 px-4 h-10 rounded-full bg-white/70 border border-black/[0.07] backdrop-blur-xl shadow-[0_1px_0_0_rgba(255,255,255,0.8)_inset,0_1px_2px_rgba(40,40,60,0.06)]">
      <Stat label="Total" value={pumps.length} />
      <div className="h-4 w-px bg-black/[0.10]" />
      <Stat label="Running" value={running} accent="#30B65C" />
      <div className="h-4 w-px bg-black/[0.10]" />
      <Stat label="Attention" value={needs} accent={needs > 0 ? "#D70015" : undefined} />
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="num text-[13px] font-semibold tabular-nums" style={{ color: accent ?? "#1D1D1F" }}>
        {value}
      </span>
      <span className="text-[10px] uppercase tracking-[0.14em] text-[#86868B]">{label}</span>
    </div>
  );
}

