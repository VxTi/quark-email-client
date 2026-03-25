import { createRoute } from '@/lib/api-route';
import { db } from '@/db';
import { email, type Account } from '@/db/schema';
import { getAccountByUserId } from '@/lib/mail/account';
import { createSmtpTransport } from '@/lib/mail/smtp-client';
import { InternalTag } from '@/types/email';
import { NextResponse } from 'next/server';
import { SendEmailSchema, type SendEmailData } from '@/models';

async function dispatchEmail(account: Account, data: SendEmailData) {
  const transport = await createSmtpTransport(account);
  return transport.sendMail({
    from: account.accountId, // Using accountId as it contains the email address
    to: data.to,
    cc: data.cc,
    bcc: data.bcc,
    subject: data.subject ?? '',
    html: data.bodyHtml ?? '',
  });
}

function buildSentValues(
  userId: string,
  accountId: string,
  fromAddress: string,
  data: SendEmailData
) {
  return {
    id: crypto.randomUUID(),
    userId,
    accountId,
    fromAddress,
    internalTag: InternalTag.Sent,
    to: data.to,
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

async function recordSentEmail(
  userId: string,
  accountId: string,
  fromAddress: string,
  data: SendEmailData
) {
  return db
    .insert(email)
    .values(buildSentValues(userId, accountId, fromAddress, data));
}

export const POST = createRoute({
  requiresAuthentication: true,
  strict: true,
  requestValidator: {
    validator: SendEmailSchema,
  },
  handler: async ({ session, data }) => {
    const account = await getAccountByUserId(session.user.id);

    if (!account) {
      return NextResponse.json(
        { error: 'No mail account configured' },
        { status: 404 }
      );
    }
    if (data.simulateReceive) {
      const receivedValues = {
        ...buildSentValues(
          session.user.id,
          account.id,
          account.accountId,
          data
        ),
        internalTag: InternalTag.Inbox,
        fromAddress: data.to,
        fromName: 'Simulation Bot',
        to: account.accountId,
        read: false,
      };
      await db.insert(email).values(receivedValues);

      return NextResponse.json({ status: 'Success' }, { status: 204 });
    }

    await dispatchEmail(account, data);
    await recordSentEmail(session.user.id, account.id, account.accountId, data);

    return NextResponse.json({ status: 'Success' }, { status: 204 });
  },
});
