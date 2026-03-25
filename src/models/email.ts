import { z } from "zod";
import { InternalTag } from "@/types/email";

export const InternalTagSchema = z.enum(InternalTag);

export const ApiEmailSchema = z.object({
  id: z.string(),
  userId: z.string(),
  accountId: z.string().nullable(),
  folderId: z.string().nullable(),
  tagId: z.string().nullable(),
  internalTag: InternalTagSchema,
  fromAddress: z.string(),
  fromName: z.string(),
  to: z.string(),
  cc: z.string(),
  bcc: z.string(),
  subject: z.string(),
  preview: z.string(),
  body: z.string(),
  read: z.boolean(),
  starred: z.boolean(),
  date: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ApiEmail = z.infer<typeof ApiEmailSchema>;

export const EmailDataSchema = z.object({
  to: z.string().optional(),
  cc: z.string().optional(),
  bcc: z.string().optional(),
  subject: z.string().optional(),
  body: z.string().optional(),
  tagId: z.string().optional(),
  internalTag: InternalTagSchema.optional(),
});

export type EmailData = z.infer<typeof EmailDataSchema>;
