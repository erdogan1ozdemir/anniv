import { JediScreen } from "@/components/screens/JediScreen";
import { loadMemories } from "@/lib/data";

export default async function JediPage() {
  const memories = await loadMemories();
  const jediMemories = memories.filter((m) =>
    [m.category, ...(m.tags ?? [])].some((value) =>
      value?.toString().toLowerCase().includes("jedi"),
    ),
  );
  return (
    <>
      <JediScreen memories={jediMemories} />
    </>
  );
}
