import type { ReactNode } from "react";
import { TopNav } from "./TopNav";
import { BackgroundAurora } from "./BackgroundAurora";
import { StoreHydrator } from "./StoreHydrator";
import { Toaster } from "sonner";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <StoreHydrator />
      <BackgroundAurora />
      <TopNav />
      {children}
      <Toaster
        position="bottom-center"
        toastOptions={{
          className:
            "!bg-white/85 !text-[#1D1D1F] !border !border-black/[0.07] !backdrop-blur-2xl !rounded-2xl !shadow-[0_20px_60px_-16px_rgba(40,40,60,0.28)]",
        }}
      />
    </>
  );
}
