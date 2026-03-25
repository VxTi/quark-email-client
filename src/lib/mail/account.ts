import 'server-only';
import { eq, and } from 'drizzle-orm';
import { db } from '@/db';
import { type Account, account } from '@/db/schema';
import { encrypt } from './encryption';

export async function getAccountByUserId(
  userId: string
): Promise<Account | null> {
  return await db
    .select()
    .from(account)
    .where(and(eq(account.userId, userId), eq(account.providerId, 'email')))
    .then(res => res.at(0) ?? null);
}

export async function getAccountById(id: string): Promise<Account | null> {
  return await db
    .select()
    .from(account)
    .where(eq(account.id, id))
    .then(res => res.at(0) ?? null);
}

interface CreateAccountData {
  displayName: string;
  email: string;
  password: string;
}

function buildAccountValues(userId: string, data: CreateAccountData) {
  return {
    id: crypto.randomUUID(),
    userId,
    accountId: data.email,
    providerId: 'email',
    displayName: data.displayName,
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
