import { redirect } from "next/navigation";
import { loadMemories } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function RandomPage() {
  const memories = await loadMemories();
  if (memories.length === 0) redirect("/");
  const pick = memories[Math.floor(Math.random() * memories.length)];
  redirect(`/ani/${pick.id}`);
}
