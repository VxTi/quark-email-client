import { z } from "zod/v4";

export const TagSchema = z.object({
  name: z.string(),
  color: z.string(),
});

export type ApiTag = z.infer<typeof TagSchema>;

export const CreateTagSchema = z.object({
  name: z.string(),
  color: z.string().optional(),
});

export type CreateTagData = z.infer<typeof CreateTagSchema>;
