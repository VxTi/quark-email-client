import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getMailAccountById } from "@/lib/mail/account";
import { getFolderById } from "@/lib/mail/folders";
import { ensureBodyLoaded, getMessageById, updateMessageFlags } from "@/lib/mail/messages";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

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

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  const { id } = await params;
  const msg = await loadMessage(id, session.user.id);
  if (!msg) return new NextResponse("Not found", { status: 404 });
  return NextResponse.json(msg);
}

function buildFlagUpdate(data: Record<string, unknown>) {
  const update: { read?: boolean; starred?: boolean } = {};
  if (typeof data.read === "boolean") update.read = data.read;
  if (typeof data.starred === "boolean") update.starred = data.starred;
  return update;
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  const { id } = await params;
  const data = (await req.json()) as Record<string, unknown>;
  const updated = await updateMessageFlags(id, session.user.id, buildFlagUpdate(data));
  if (!updated) return new NextResponse("Not found", { status: 404 });
  return NextResponse.json(updated);
}
