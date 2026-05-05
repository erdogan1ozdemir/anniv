import { Timeline } from "@/components/screens/Timeline";
import { loadMemories } from "@/lib/data";
import { memoryToEvent } from "@/lib/tree-data";

export default async function Home() {
  const memories = await loadMemories();
  const events = memories.map(memoryToEvent);
  return (
    <>
      <Timeline events={events} memories={memories} season="spring" />
    </>
  );
}
