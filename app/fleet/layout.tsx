import { FleetShell } from "@/components/fleet/FleetShell";

export default function FleetLayout({ children }: { children: React.ReactNode }) {
  return <FleetShell>{children}</FleetShell>;
}
