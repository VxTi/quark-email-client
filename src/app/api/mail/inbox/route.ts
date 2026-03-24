import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getMessages } from "@/lib/mail/messages";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  const { searchParams } = new URL(req.url);
  const folderId = searchParams.get("folderId");
  if (!folderId) return new NextResponse("Missing folderId", { status: 400 });
  const messages = await getMessages(folderId);
  return NextResponse.json(messages);
}
