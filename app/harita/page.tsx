import { CounterScreen } from "@/components/screens/CounterScreen";
import { BottomNav } from "@/components/ui/BottomNav";

// Legacy /harita route — now serves the Sayaç screen so old bookmarks
// keep working. The MapScreen component (in components/screens/MapScreen.tsx)
// is preserved with a feature flag for future map development.
export default function MapPage() {
  return (
    <>
      <CounterScreen />
      <BottomNav />
    </>
  );
}
