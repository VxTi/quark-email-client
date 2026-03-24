import "server-only";
import { simpleParser } from "mailparser";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { email } from "@/db/schema";
import { InternalTag } from "@/types/email";
import { withImapClient, type ImapCredentials } from "./imap-client";
import type { Email } from "@/db/schema";

type AddressObject = { address?: string; name?: string };
type MessageEnvelope = {
  messageId?: string;
  date?: Date;
  subject?: string;
  from?: AddressObject[];
  to?: AddressObject[];
};
type FetchedMessage = {
  uid: number;
  envelope?: MessageEnvelope;
  flags?: Set<string>;
  bodyStructure?: { childNodes?: unknown[] };
};

function buildFromValues(msg: FetchedMessage) {
  const from = msg.envelope?.from?.[0];
  return {
    fromAddress: from?.address ?? "",
    fromName: from?.name ?? "",
    to: msg.envelope?.to?.map((a) => a.address).join(", ") ?? "",
    messageId: msg.envelope?.messageId ?? "",
    subject: msg.envelope?.subject ?? "",
    date: msg.envelope?.date ?? null,
  };
}

function buildEmailValues(userId: string, accountId: string, folderId: string, msg: FetchedMessage) {
  return {
    id: crypto.randomUUID(),
    userId,
    accountId,
    folderId,
    uid: String(msg.uid),
    internalTag: InternalTag.Inbox,
    read: msg.flags?.has("\\Seen") ?? false,
    starred: msg.flags?.has("\\Flagged") ?? false,
    hasAttachments: (msg.bodyStructure?.childNodes?.length ?? 0) > 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...buildFromValues(msg),
  };
}

async function upsertMessage(values: ReturnType<typeof buildEmailValues>) {
  const [row] = await db
    .insert(email)
    .values(values)
    .onConflictDoUpdate({
      target: [email.folderId, email.uid],
      set: { read: values.read, starred: values.starred, updatedAt: new Date() },
    })
    .returning();
  return row;
}

export async function fetchEnvelopes(
  userId: string,
  accountId: string,
  folderId: string,
  creds: ImapCredentials,
  folderPath: string,
) {
  const msgs: FetchedMessage[] = [];
  await withImapClient(creds, async (client) => {
    const status = await client.mailboxOpen(folderPath);
    const seq = `${Math.max(1, status.exists - 49)}:*`;
    for await (const msg of client.fetch(seq, { uid: true, envelope: true, flags: true, bodyStructure: true })) {
      msgs.push(msg as FetchedMessage);
    }
  });
  return Promise.all(msgs.map((m) => upsertMessage(buildEmailValues(userId, accountId, folderId, m))));
}

export async function getMessages(folderId: string) {
  return db.select().from(email).where(eq(email.folderId, folderId));
}

export async function getMessageById(id: string, userId: string) {
  const [msg] = await db.select().from(email).where(and(eq(email.id, id), eq(email.userId, userId)));
  return msg ?? null;
}

export async function fetchMessageBody(uid: string, creds: ImapCredentials, folderPath: string) {
  let bodyHtml = "";
  let bodyText = "";
  await withImapClient(creds, async (client) => {
    await client.mailboxOpen(folderPath);
    const { content } = await client.download(uid, undefined, { uid: true });
    const parsed = await simpleParser(content);
    bodyHtml = (typeof parsed.html === "string" ? parsed.html : "") || "";
    bodyText = parsed.text ?? "";
  });
  return { bodyHtml, bodyText };
}

export async function ensureBodyLoaded(msg: Email, creds: ImapCredentials, folderPath: string): Promise<Email> {
  if (msg.bodyHtml || msg.bodyText || !msg.uid) return msg;
  const { bodyHtml, bodyText } = await fetchMessageBody(msg.uid, creds, folderPath);
  const preview = bodyText.slice(0, 150);
  const [updated] = await db.update(email).set({ bodyHtml, bodyText, preview, updatedAt: new Date() }).where(eq(email.id, msg.id)).returning();
  return updated ?? msg;
}

export async function updateMessageFlags(
  emailId: string,
  userId: string,
  flags: { read?: boolean; starred?: boolean },
) {
  const [updated] = await db
    .update(email)
    .set({ ...flags, updatedAt: new Date() })
    .where(and(eq(email.id, emailId), eq(email.userId, userId)))
    .returning();
  return updated ?? null;
}
