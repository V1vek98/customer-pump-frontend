// The actual layout lives in `app/fleet/layout.tsx` via `FleetShell`, which
// reads `useParams()` to decide between the grid view and the master-detail
// view. The page renders nothing so the shell isn't double-rendered.
export default function FleetPage() {
  return null;
}
