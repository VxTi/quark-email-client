import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getMailAccount } from "@/lib/mail/account";
import { getFolders } from "@/lib/mail/folders";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function GET() {
  const session = await getSession();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  const account = await getMailAccount(session.user.id);
  if (!account) return new NextResponse("No mail account configured", { status: 404 });
  const folders = await getFolders(account.id);
  return NextResponse.json(folders);
}
