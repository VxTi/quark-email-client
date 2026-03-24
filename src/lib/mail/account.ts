import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { mailAccount } from "@/db/schema";
import { encrypt } from "./encryption";

export async function getMailAccount(userId: string) {
  const [acc] = await db.select().from(mailAccount).where(eq(mailAccount.userId, userId));
  return acc ?? null;
}

export async function getMailAccountById(id: string) {
  const [acc] = await db.select().from(mailAccount).where(eq(mailAccount.id, id));
  return acc ?? null;
}

type CreateMailAccountData = {
  displayName: string;
  email: string;
  password: string;
  imapHost: string;
  imapPort: number;
  imapSecure: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
};

function buildAccountValues(userId: string, data: CreateMailAccountData) {
  return {
    id: crypto.randomUUID(),
    userId,
    displayName: data.displayName,
    email: data.email,
    imapHost: data.imapHost,
    imapPort: data.imapPort,
    imapSecure: data.imapSecure,
    smtpHost: data.smtpHost,
    smtpPort: data.smtpPort,
    smtpSecure: data.smtpSecure,
    encryptedPassword: encrypt(data.password),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function createMailAccount(userId: string, data: CreateMailAccountData) {
  const [acc] = await db.insert(mailAccount).values(buildAccountValues(userId, data)).returning();
  return acc;
}
