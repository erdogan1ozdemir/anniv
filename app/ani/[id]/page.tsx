import { notFound } from "next/navigation";
import { MemoryDetail } from "@/components/screens/MemoryDetail";
import { BottomNav } from "@/components/ui/BottomNav";
import {
  getAdjacentMemories,
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
  const [related, neighbors] = await Promise.all([
    getRelatedMemories(memory, 3),
    getAdjacentMemories(id),
  ]);
  return (
    <>
      <MemoryDetail
        memory={memory}
        related={related}
        prevId={neighbors.prev?.id ?? null}
        nextId={neighbors.next?.id ?? null}
      />
      <BottomNav />
    </>
  );
}
