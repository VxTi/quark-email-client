import { z } from 'zod/v4';
import { InternalTag } from '@/types/email';

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
  tagId: z.string().optional(),
  internalTag: z.nativeEnum(InternalTag).optional(),
  to: z.string().optional(),
  cc: z.string().optional(),
  bcc: z.string().optional(),
  subject: z.string().optional(),
  body: z.string().optional(),
});

export type EmailData = z.infer<typeof EmailDataSchema>;

export const DraftDataSchema = z.object({
  to: z.string().optional(),
  cc: z.string().optional(),
  bcc: z.string().optional(),
  subject: z.string().optional(),
  body: z.string().optional(),
});

export type DraftData = z.infer<typeof DraftDataSchema>;

export const SendEmailSchema = z.object({
  to: z.string(),
  cc: z.string().optional(),
  bcc: z.string().optional(),
  subject: z.string().optional(),
  body: z.string().optional(),
  simulateReceive: z.boolean().optional(),
});

export type SendEmailData = z.infer<typeof SendEmailSchema>;

export const MessageFlagsSchema = z.object({
  read: z.boolean().optional(),
  starred: z.boolean().optional(),
});

export type MessageFlags = z.infer<typeof MessageFlagsSchema>;

export const InboxQuerySchema = z.object({
  folderId: z.string(),
});

export type InboxQuery = z.infer<typeof InboxQuerySchema>;
