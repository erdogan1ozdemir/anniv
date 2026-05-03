import { RandomReveal } from "@/components/screens/RandomReveal";
import { BottomNav } from "@/components/ui/BottomNav";
import { loadMemories } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function RandomPage() {
  const memories = await loadMemories();
  if (memories.length === 0) return null;
  // Server-side random pick to keep navigation snappy
  const pick = memories[Math.floor(Math.random() * memories.length)];
  return (
    <>
      <RandomReveal memory={pick} />
      <BottomNav />
    </>
  );
}
