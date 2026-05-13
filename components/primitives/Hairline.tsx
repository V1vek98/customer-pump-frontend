import { cn } from "@/lib/utils";

export function Hairline({ className }: { className?: string }) {
  return <div className={cn("hairline w-full", className)} />;
}

export function HairlineV({ className }: { className?: string }) {
  return <div className={cn("hairline-v h-full", className)} />;
}
