import { NextResponse } from 'next/server';
import { createRoute } from '@/lib/api-route';
import { db } from '@/db';
import { email } from '@/db/schema';
import { InternalTag } from '@/types/email';
import { DraftDataSchema, type DraftData } from '@/models';

function buildDraftValues(userId: string, data: DraftData) {
  return {
    id: crypto.randomUUID(),
    userId,
    internalTag: InternalTag.Draft,
    to: data.to ?? '',
    cc: data.cc ?? '',
    bcc: data.bcc ?? '',
    subject: data.subject ?? '',
    bodyHtml: data.bodyHtml ?? '',
    read: true as const,
    starred: false as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export const POST = createRoute({
  requiresAuthentication: true,
  strict: true,
  requestValidator: {
    validator: DraftDataSchema,
  },
  handler: async ({ session, data }) => {
    const [draft] = await db
      .insert(email)
      .values(buildDraftValues(session.user.id, data))
      .returning();
    return NextResponse.json(draft, { status: 201 });
  },
});
