import { TreeTimeline } from "@/components/screens/TreeTimeline";
import { BottomNav } from "@/components/ui/BottomNav";
import { getYearGroups } from "@/lib/data";

export default async function Home() {
  const groups = await getYearGroups();
  return (
    <>
      <TreeTimeline groups={groups} />
      <BottomNav />
    </>
  );
}
