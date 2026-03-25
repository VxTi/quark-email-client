import { NextResponse } from 'next/server';
import { createRoute } from '@/lib/api-route';
import { getMessages } from '@/lib/mail/messages';
import { InboxQuerySchema } from '@/models';

export const GET = createRoute({
  requiresAuthentication: true,
  strict: true,
  requestValidator: {
    in: 'query',
    validator: InboxQuerySchema,
  },
  handler: async ({ data: { folderId } }) => {
    const messages = await getMessages(folderId);
    return NextResponse.json(messages);
  },
});
