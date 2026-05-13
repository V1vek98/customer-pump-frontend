"use client";

import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "glass" | "ghost" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
};

export const GlassButton = forwardRef<HTMLButtonElement, Props>(function GlassButton(
  { className, variant = "glass", size = "md", asChild = false, ...rest },
  ref
) {
  const Comp: React.ElementType = asChild ? Slot : "button";

  return (
    <Comp
      ref={ref}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-full font-medium select-none transition-all duration-150 ease-out",
        "active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A84FF]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F5F7]",
        "disabled:opacity-40 disabled:pointer-events-none",

        size === "sm" && "h-8 px-3 text-xs",
        size === "md" && "h-10 px-4 text-sm",
        size === "lg" && "h-12 px-6 text-sm",
        size === "icon" && "h-9 w-9",

        variant === "primary" &&
          "bg-[#1D1D1F] text-white hover:bg-[#000] shadow-[0_1px_0_0_rgba(255,255,255,0.18)_inset,0_8px_24px_-8px_rgba(0,0,0,0.25)]",
        variant === "glass" &&
          "bg-white/70 text-[#1D1D1F] border border-black/[0.08] backdrop-blur-xl hover:bg-white/85 hover:border-black/[0.12] shadow-[0_1px_0_0_rgba(255,255,255,0.8)_inset,0_2px_8px_-2px_rgba(40,40,60,0.10)]",
        variant === "ghost" &&
          "bg-transparent text-[#424245] hover:text-[#1D1D1F] hover:bg-black/[0.04]",
        variant === "danger" &&
          "bg-[#FF3B30]/12 text-[#D70015] border border-[#FF3B30]/22 hover:bg-[#FF3B30]/18",

        className
      )}
      {...rest}
    />
  );
});
