import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createMailAccount } from "@/lib/mail/account";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  const data = await req.json();
  const account = await createMailAccount(session.user.id, data);
  return NextResponse.json(account, { status: 201 });
}
