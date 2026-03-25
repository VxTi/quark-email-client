import { NextResponse } from 'next/server';
import { createRoute } from '@/lib/api-route';
import { getMailAccount } from '@/lib/mail/account';
import { getFolders } from '@/lib/mail/folders';

export const GET = createRoute({
  requiresAuthentication: true,
  handler: async ({ session }) => {
    const account = await getMailAccount(session.user.id);
    if (!account)
      return NextResponse.json(
        { error: 'No mail account configured' },
        { status: 404 }
      );
    const folders = await getFolders(account.id);
    return NextResponse.json(folders);
  },
});
