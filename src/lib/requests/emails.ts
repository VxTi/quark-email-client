import type { InternalTag } from "@/types/email";

export interface ApiEmail {
  id: string;
  userId: string;
  accountId: string | null;
  folderId: string | null;
  tagId: string | null;
  internalTag: InternalTag;
  fromAddress: string;
  fromName: string;
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  preview: string;
  body: string;
  read: boolean;
  starred: boolean;
  date: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EmailData {
  to?: string;
  cc?: string;
  bcc?: string;
  subject?: string;
  body?: string;
  tagId?: string;
  internalTag?: InternalTag;
}

export async function fetchEmails(): Promise<ApiEmail[]> {
  const res = await fetch("/api/emails");
  if (!res.ok) throw new Error("Failed to fetch emails");
  return res.json();
}

export async function saveEmail(data: EmailData): Promise<ApiEmail> {
  const res = await fetch("/api/emails", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to save email");
  return res.json();
}
