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
    const updated = await db
      .update(email)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(and(eq(email.id, params.id), eq(email.userId, session.user.id)))
      .returning()
      .then(res => res.at(0));

    if (!updated) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  },
});
