import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { email } from "@/db/schema";
import { getMailAccount } from "@/lib/mail/account";
import { createSmtpTransport } from "@/lib/mail/smtp-client";
import { InternalTag } from "@/types/email";
import type { MailAccount } from "@/db/schema";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

type SendData = { to: string; cc?: string; bcc?: string; subject?: string; body?: string };

async function dispatchEmail(account: MailAccount, data: SendData) {
  const transport = createSmtpTransport(account);
  return transport.sendMail({
    from: account.email,
    to: data.to,
    cc: data.cc,
    bcc: data.bcc,
    subject: data.subject ?? "",
    html: data.body ?? "",
  });
}

function buildSentValues(userId: string, accountId: string, data: SendData) {
  return {
    id: crypto.randomUUID(),
    userId,
    accountId,
    internalTag: InternalTag.Sent,
    to: data.to,
    cc: data.cc ?? "",
    bcc: data.bcc ?? "",
    subject: data.subject ?? "",
    body: data.body ?? "",
    read: true as const,
    starred: false as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

async function recordSentEmail(userId: string, accountId: string, data: SendData) {
  return db.insert(email).values(buildSentValues(userId, accountId, data));
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  const data = (await req.json()) as SendData;
  const account = await getMailAccount(session.user.id);
  if (!account) return new NextResponse("No mail account configured", { status: 404 });
  await dispatchEmail(account, data);
  await recordSentEmail(session.user.id, account.id, data);
  return new NextResponse(null, { status: 204 });
}
