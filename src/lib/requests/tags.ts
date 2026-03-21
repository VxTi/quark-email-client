import type { Tag } from "@/types/email";

export async function fetchTags(): Promise<Tag[]> {
  const res = await fetch("/api/tags");
  if (!res.ok) throw new Error("Failed to fetch tags");
  return res.json();
}

export async function createTagRequest(name: string, color?: string): Promise<Tag> {
  const res = await fetch("/api/tags", {
    method: "POST",
    body: JSON.stringify({ name, color }),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to create tag");
  return res.json();
}

