import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { folder } from "@/db/schema";
import { FolderType } from "@/types/email";
import { withImapClient, type ImapCredentials } from "./imap-client";

interface MailboxInfo {
  path: string;
  name: string;
  specialUse?: string;
}

function classifyFolder(mb: MailboxInfo): FolderType {
  if (mb.specialUse === "\\Sent") return FolderType.Sent;
  if (mb.specialUse === "\\Drafts") return FolderType.Drafts;
  if (mb.specialUse === "\\Trash") return FolderType.Trash;
  if (mb.specialUse === "\\Junk") return FolderType.Spam;
  if (mb.specialUse === "\\Archive") return FolderType.Archive;
  if (mb.name.toLowerCase() === "inbox") return FolderType.Inbox;
  return FolderType.Custom;
}

async function upsertFolder(accountId: string, mb: MailboxInfo) {
  const values = {
    id: crypto.randomUUID(),
    accountId,
    name: mb.name,
    path: mb.path,
    type: classifyFolder(mb),
    updatedAt: new Date(),
  };
  const [row] = await db
    .insert(folder)
    .values(values)
    .onConflictDoUpdate({
      target: [folder.accountId, folder.path],
      set: { name: mb.name, updatedAt: new Date() },
    })
    .returning();
  return row;
}

export async function syncFolders(accountId: string, creds: ImapCredentials) {
  let mailboxes: MailboxInfo[] = [];
  await withImapClient(creds, async (client) => {
    mailboxes = (await client.list()) as MailboxInfo[];
  });
  return Promise.all(mailboxes.map((mb) => upsertFolder(accountId, mb)));
}

export async function getFolders(accountId: string) {
  return db.select().from(folder).where(eq(folder.accountId, accountId));
}

export async function getFolderById(id: string) {
  const [row] = await db.select().from(folder).where(eq(folder.id, id));
  return row ?? null;
}
