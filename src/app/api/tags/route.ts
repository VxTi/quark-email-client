import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { createRoute } from '@/lib/api-route';
import { db } from '@/db';
import { tag } from '@/db/schema';
import { CreateTagSchema } from '@/models';

export const GET = createRoute({
  requiresAuthentication: true,
  handler: async ({ session }) => {
    const tags = await db
      .select()
      .from(tag)
      .where(eq(tag.userId, session.user.id));
    return NextResponse.json(tags);
  },
});

export const POST = createRoute({
  requiresAuthentication: true,
  strict: true,
  requestValidator: {
    validator: CreateTagSchema,
  },
  handler: async ({ session, data }) => {
    const newTag = await db
      .insert(tag)
      .values({
        id: crypto.randomUUID(),
        name: data.name,
        color: data.color ?? '#E5E7EB',
        userId: session.user.id,
        createdAt: new Date(),
      })
      .returning();

    return NextResponse.json(newTag[0]);
  },
});
