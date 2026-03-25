import { NextResponse } from 'next/server';
import { createRoute } from '@/lib/api-route';
import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { email } from '@/db/schema';
import { z } from 'zod/v4';
import { DraftDataSchema } from '@/models';

export const PUT = createRoute({
  requiresAuthentication: true,
  strict: true,
  paramsValidator: z.object({
    id: z.string(),
  }),
  requestValidator: {
    validator: DraftDataSchema,
  },
  handler: async ({ session, data, params }) => {
    const [updated] = await db
      .update(email)
      .set({
        to: data.to ?? '',
        cc: data.cc ?? '',
        bcc: data.bcc ?? '',
        subject: data.subject ?? '',
        bodyHtml: data.bodyHtml ?? '',
        updatedAt: new Date(),
      })
      .where(and(eq(email.id, params.id), eq(email.userId, session.user.id)))
      .returning();
    if (!updated)
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  },
});
