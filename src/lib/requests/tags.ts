import { request } from "@/lib/utils";
import { TagSchema, type ApiTag } from "@/models/tag";
import { z } from "zod";

export async function fetchTags(): Promise<ApiTag[]> {
  return request("/api/tags", {
    decoder: z.array(TagSchema),
  });
}

export async function createTagRequest(name: string, color: string): Promise<ApiTag> {
  return request("/api/tags", {
    method: "POST",
    body: JSON.stringify({ name, color }),
    headers: { "Content-Type": "application/json" },
    decoder: TagSchema,
  });
}
