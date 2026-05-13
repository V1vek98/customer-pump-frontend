import type { ReactNode } from "react";

export function PageContainer({ children }: { children: ReactNode }) {
  return <main className="mx-auto max-w-[1600px] px-6 pb-24">{children}</main>;
}
