import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { createRoute } from '@/lib/api-route';
import { db } from '@/db';
import { email } from '@/db/schema';
import { InternalTag } from '@/types/email';
import { EmailDataSchema, type EmailData } from '@/models';

async function insertEmail(userId: string, data: EmailData) {
  return db
    .insert(email)
    .values({
      id: crypto.randomUUID(),
      userId,
      tagId: data.tagId,
      internalTag: data.internalTag ?? InternalTag.Draft,
      to: data.to ?? '',
      cc: data.cc ?? '',
      bcc: data.bcc ?? '',
      subject: data.subject ?? '',
      body: data.body ?? '',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
}

export const GET = createRoute({
  requiresAuthentication: true,
  handler: async ({ session }) => {
    const emails = await db
      .select()
      .from(email)
      .where(eq(email.userId, session.user.id));
    return NextResponse.json(emails);
  },
});

export const POST = createRoute({
  requiresAuthentication: true,
  strict: true,
  requestValidator: {
    validator: EmailDataSchema,
  },
  handler: async ({ session, data }) => {
    const [newEmail] = await insertEmail(session.user.id, data);
    return NextResponse.json(newEmail);
  },
});
