import { NextResponse } from 'next/server';
import { createRoute } from '@/lib/api-route';
import { getMailAccountById } from '@/lib/mail/account';
import { getFolderById } from '@/lib/mail/folders';
import {
  ensureBodyLoaded,
  getMessageById,
  updateMessageFlags,
} from '@/lib/mail/messages';
import { z } from 'zod/v4';
import { MessageFlagsSchema } from '@/models';

async function loadMessage(id: string, userId: string) {
  const msg = await getMessageById(id, userId);
  if (!msg?.uid || !msg.folderId || !msg.accountId) return msg;
  const [account, folder] = await Promise.all([
    getMailAccountById(msg.accountId),
    getFolderById(msg.folderId),
  ]);
  if (!account || !folder) return msg;
  return ensureBodyLoaded(msg, account, folder.path);
}

const paramsValidator = z.object({
  id: z.string(),
});

export const GET = createRoute({
  requiresAuthentication: true,
  strict: true,
  paramsValidator,
  handler: async ({ session, params }) => {
    const msg = await loadMessage(params.id, session.user.id);
    if (!msg) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(msg);
  },
});

export const PATCH = createRoute({
  requiresAuthentication: true,
  strict: true,
  paramsValidator,
  requestValidator: {
    validator: MessageFlagsSchema,
  },
  handler: async ({ session, data, params }) => {
    const updated = await updateMessageFlags(params.id, session.user.id, data);
    if (!updated)
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  },
});
