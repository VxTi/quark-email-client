import { NextResponse } from 'next/server';
import { createRoute } from '@/lib/api-route';
import { createMailAccount } from '@/lib/mail/account';
import { CreateAccountSchema } from '@/models';

export const POST = createRoute({
  requiresAuthentication: true,
  strict: true,
  requestValidator: {
    validator: CreateAccountSchema,
    in: 'body',
  },
  handler: async ({ session, data }) => {
    const account = await createMailAccount(session.user.id, data);
    return NextResponse.json(account, { status: 201 });
  },
});
