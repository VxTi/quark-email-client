import 'server-only';
import { eq, and } from 'drizzle-orm';
import { db } from '@/db';
import { account } from '@/db/schema';
import { encrypt } from './encryption';

export async function getMailAccount(userId: string) {
  const [acc] = await db
    .select()
    .from(account)
    .where(and(eq(account.userId, userId), eq(account.providerId, 'email')));
  return acc ?? null;
}

export async function getMailAccountById(id: string) {
  const [acc] = await db.select().from(account).where(eq(account.id, id));
  return acc ?? null;
}

interface CreateAccountData {
  displayName: string;
  email: string;
  password: string;
  imapHost: string;
  imapPort: number;
  imapSecure: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
}

function buildAccountValues(userId: string, data: CreateAccountData) {
  return {
    id: crypto.randomUUID(),
    userId,
    accountId: data.email,
    providerId: 'email',
    displayName: data.displayName,
    imapHost: data.imapHost,
    imapPort: data.imapPort,
    imapSecure: data.imapSecure,
    smtpHost: data.smtpHost,
    smtpPort: data.smtpPort,
    smtpSecure: data.smtpSecure,
    password: encrypt(data.password),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function createMailAccount(
  userId: string,
  data: CreateAccountData
) {
  const [acc] = await db
    .insert(account)
    .values(buildAccountValues(userId, data))
    .returning();
  return acc;
}
