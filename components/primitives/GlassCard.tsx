"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  variant?: "subtle" | "default" | "strong";
  interactive?: boolean;
};

export const GlassCard = forwardRef<HTMLDivElement, Props>(function GlassCard(
  { className, variant = "default", interactive = false, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl relative",
        variant === "subtle" &&
          "bg-white/55 border border-black/[0.06] backdrop-blur-xl shadow-[0_8px_28px_-12px_rgba(40,40,60,0.18)]",
        variant === "default" && "glass",
        variant === "strong" && "glass-strong",
        interactive &&
          "transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_24px_70px_-16px_rgba(40,40,60,0.22),0_0_0_1px_rgba(255,194,51,0.14)] hover:border-black/[0.10]",
        className
      )}
      {...rest}
    />
  );
});
