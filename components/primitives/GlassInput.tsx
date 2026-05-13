"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

export const GlassInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function GlassInput({ className, ...rest }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full h-10 px-3.5 rounded-xl bg-white/70 border border-black/[0.08]",
          "text-sm text-[#1D1D1F] placeholder:text-[#86868B]",
          "transition-all duration-150 ease-out",
          "focus:bg-white/95 focus:border-[#0A84FF]/45 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]/20",
          "backdrop-blur-xl",
          className
        )}
        {...rest}
      />
    );
  }
);

export const GlassTextarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function GlassTextarea({ className, ...rest }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full px-3.5 py-2.5 rounded-xl bg-white/70 border border-black/[0.08]",
        "text-sm text-[#1D1D1F] placeholder:text-[#86868B]",
        "transition-all duration-150 ease-out",
        "focus:bg-white/95 focus:border-[#0A84FF]/45 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]/20",
        "backdrop-blur-xl resize-none",
        className
      )}
      {...rest}
    />
  );
});
