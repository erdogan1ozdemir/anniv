import { MapScreen } from "@/components/screens/MapScreen";
import { BottomNav } from "@/components/ui/BottomNav";
import { loadLocations } from "@/lib/data";

export default async function MapPage() {
  const locations = await loadLocations();
  return (
    <>
      <MapScreen locations={locations} />
      <BottomNav />
    </>
  );
}
