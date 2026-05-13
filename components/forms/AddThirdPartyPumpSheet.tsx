"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { GlassInput, GlassTextarea } from "@/components/primitives/GlassInput";
import { GlassButton } from "@/components/primitives/GlassButton";
import { X, Upload, ChevronDown } from "lucide-react";
import { useFleetStore } from "@/lib/store/fleet";
import { toast } from "sonner";
import type { PumpStatus } from "@/types";

const MANUFACTURERS = [
  "Warman / Weir",
  "Metso",
  "Schurco",
  "ITT Goulds",
  "Flowserve",
  "Other",
];

const STATUSES: { key: PumpStatus; label: string }[] = [
  { key: "running", label: "Running" },
  { key: "standby", label: "Standby" },
  { key: "offline", label: "Offline" },
  { key: "maintenance", label: "Maintenance" },
];

export function AddThirdPartyPumpSheet({ onClose }: { onClose: () => void }) {
  const addThirdParty = useFleetStore((s) => s.addThirdParty);

  const [manufacturer, setManufacturer] = useState(MANUFACTURERS[0]);
  const [model, setModel] = useState("");
  const [serial, setSerial] = useState("");
  const [nickname, setNickname] = useState("");
  const [location, setLocation] = useState("");
  const [installedAt, setInstalledAt] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [hours, setHours] = useState("");
  const [status, setStatus] = useState<PumpStatus>("running");
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState<string | undefined>();
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const canSubmit = model.trim().length > 0 && location.trim().length > 0;

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const submit = () => {
    if (!canSubmit) return;
    const p = addThirdParty({
      manufacturer,
      model: model.trim(),
      serial: serial.trim() || `${manufacturer.split(" ")[0].toUpperCase()}-${Date.now().toString().slice(-6)}`,
      nickname: nickname.trim() || undefined,
      location: location.trim(),
      installedAt: new Date(installedAt).toISOString(),
      totalRunHours: parseInt(hours || "0", 10) || 0,
      status,
      notes: notes.trim() || undefined,
      photoDataUrl: photo,
    });
    toast.success(`Added ${p.manufacturer} ${p.model} to your fleet`);
    onClose();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 bg-[#1D1D1F]/22 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 36 }}
        className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[480px] sm:right-4 sm:top-4 sm:bottom-4 sm:rounded-3xl overflow-hidden glass-strong flex flex-col"
      >
        <div className="px-6 pt-6 pb-4 border-b border-black/[0.06]">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#C77800] mb-1">
                Third-party pump
              </div>
              <h2 className="text-[22px] font-semibold text-[#1D1D1F] leading-tight">Add a pump</h2>
              <p className="text-[12px] text-[#424245] mt-1.5 max-w-xs">
                Bring non-KSB equipment into your fleet for a complete picture.
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="h-9 w-9 inline-flex items-center justify-center rounded-full hover:bg-black/[0.05] text-[#424245] hover:text-[#1D1D1F]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <Field label="Manufacturer">
            <div className="relative">
              <select
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                className="w-full appearance-none h-10 pl-3.5 pr-9 rounded-xl bg-white/70 border border-black/[0.08] text-sm text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#0A84FF]/25 focus:border-[#0A84FF]/40 cursor-pointer"
              >
                {MANUFACTURERS.map((m) => (
                  <option key={m} value={m} className="bg-white text-[#1D1D1F]">{m}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6E6E73] pointer-events-none" />
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Model / size" required>
              <GlassInput placeholder="8/6 AH" value={model} onChange={(e) => setModel(e.target.value)} />
            </Field>
            <Field label="Serial">
              <GlassInput placeholder="optional" value={serial} onChange={(e) => setSerial(e.target.value)} />
            </Field>
          </div>

          <Field label="Nickname">
            <GlassInput placeholder="e.g., Mill Discharge 3" value={nickname} onChange={(e) => setNickname(e.target.value)} />
          </Field>

          <Field label="Location" required>
            <GlassInput placeholder="e.g., Process Plant · West" value={location} onChange={(e) => setLocation(e.target.value)} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Installed">
              <GlassInput type="date" value={installedAt} onChange={(e) => setInstalledAt(e.target.value)} />
            </Field>
            <Field label="Est. run hours">
              <GlassInput type="number" placeholder="0" value={hours} onChange={(e) => setHours(e.target.value)} />
            </Field>
          </div>

          <Field label="Current status">
            <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-white/55 border border-black/[0.08]">
              {STATUSES.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setStatus(s.key)}
                  className={`h-8 rounded-lg text-[11px] font-medium tracking-wide transition-colors ${status === s.key ? "bg-[#1D1D1F] text-white" : "text-[#424245] hover:text-[#1D1D1F]"}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Notes">
            <GlassTextarea
              rows={3}
              placeholder="Anything we should know — install history, known issues, recent service..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Field>

          <Field label="Photo">
            <label
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleFile(file);
              }}
              className={`block rounded-xl border-2 border-dashed cursor-pointer transition-colors ${dragOver ? "border-[#FFC233]/70 bg-[#FFC233]/[0.08]" : "border-black/[0.10] bg-white/45 hover:border-black/[0.18] hover:bg-white/65"}`}
            >
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
              {photo ? (
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo} alt="Pump" className="absolute inset-0 h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); setPhoto(undefined); }}
                    className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#1D1D1F] hover:bg-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="py-8 flex flex-col items-center gap-2 text-center px-6">
                  <div className="h-10 w-10 rounded-xl bg-white/70 border border-black/[0.08] flex items-center justify-center">
                    <Upload className="h-4 w-4 text-[#424245]" />
                  </div>
                  <div className="text-[13px] text-[#1D1D1F]">Drop an image or click to upload</div>
                  <div className="text-[11px] text-[#86868B]">Optional · PNG or JPG</div>
                </div>
              )}
            </label>
          </Field>
        </div>

        <div className="px-6 py-4 border-t border-black/[0.06] flex items-center justify-between bg-white/35">
          <span className="text-[11px] text-[#86868B]">Saved locally — survives reload.</span>
          <div className="flex gap-2">
            <GlassButton variant="ghost" onClick={onClose}>Cancel</GlassButton>
            <GlassButton variant="primary" disabled={!canSubmit} onClick={submit}>
              Add to fleet
            </GlassButton>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

function Field({
  label, required, children,
}: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-[10px] uppercase tracking-[0.16em] text-[#86868B] mb-1.5 flex items-center gap-1">
        {label}
        {required && <span className="text-[#C77800]">*</span>}
      </div>
      {children}
    </label>
  );
}
