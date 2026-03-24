import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getMailAccount } from "@/lib/mail/account";
import { syncFolders, getFolders } from "@/lib/mail/folders";
import { fetchEnvelopes } from "@/lib/mail/messages";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

async function syncAccount(userId: string) {
  const account = await getMailAccount(userId);
  if (!account) throw new Error("No mail account configured");
  await syncFolders(account.id, account);
  const folders = await getFolders(account.id);
  await Promise.all(folders.map((f) => fetchEnvelopes(userId, account.id, f.id, account, f.path)));
  return { folderCount: folders.length };
}

export async function POST() {
  const session = await getSession();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  const result = await syncAccount(session.user.id);
  return NextResponse.json(result);
}
