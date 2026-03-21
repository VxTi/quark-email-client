import type { InternalTag } from "@/types/email";

export interface EmailData {
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  body?: string;
  tagId?: string;
  internalTag?: InternalTag;
}

export async function fetchEmails(): Promise<EmailData[]> {
  const res = await fetch("/api/emails");
  if (!res.ok) throw new Error("Failed to fetch emails");
  return res.json();
}

export async function saveEmail(data: EmailData): Promise<EmailData> {
  const res = await fetch("/api/emails", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to save email");
  return res.json();
}
