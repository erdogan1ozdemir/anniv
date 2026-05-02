import { Timeline } from "@/components/screens/Timeline";
import { BottomNav } from "@/components/ui/BottomNav";
import { loadMemories } from "@/lib/data";
import { memoryToEvent } from "@/lib/tree-data";

export default async function Home() {
  const memories = await loadMemories();
  const events = memories.map(memoryToEvent);
  return (
    <>
      <Timeline events={events} season="spring" />
      <BottomNav />
    </>
  );
}
