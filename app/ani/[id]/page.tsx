import { notFound } from "next/navigation";
import { MemoryDetail } from "@/components/screens/MemoryDetail";
import {
  getAdjacentMemories,
  getMemoriesByCategory,
  getMemoryById,
  getRelatedMemories,
  loadMemories,
} from "@/lib/data";

export async function generateStaticParams() {
  const memories = await loadMemories();
  return memories.map((memory) => ({ id: memory.id }));
}

export default async function MemoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const memory = await getMemoryById(id);
  if (!memory) notFound();
  const [related, sameCategory, neighbors] = await Promise.all([
    getRelatedMemories(memory, 3),
    getMemoriesByCategory(memory.category),
    getAdjacentMemories(id),
  ]);
  const sameCatFiltered = sameCategory.filter((m) => m.id !== id);
  const sameCatList = sameCatFiltered.slice(0, 6);
  return (
    <>
      <MemoryDetail
        memory={memory}
        related={related}
        sameCategory={sameCatList}
        sameCategoryTotal={sameCatFiltered.length}
        prevId={neighbors.prev?.id ?? null}
        nextId={neighbors.next?.id ?? null}
      />
    </>
  );
}
