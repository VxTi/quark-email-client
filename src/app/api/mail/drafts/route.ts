import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { email } from "@/db/schema";
import { InternalTag } from "@/types/email";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

interface DraftData {
  to?: string;
  cc?: string;
  bcc?: string;
  subject?: string;
  body?: string;
}

function buildDraftValues(userId: string, data: DraftData) {
  return {
    id: crypto.randomUUID(),
    userId,
    internalTag: InternalTag.Draft,
    to: data.to ?? "",
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

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  const data = (await req.json()) as DraftData;
  const [draft] = await db
    .insert(email)
    .values(buildDraftValues(session.user.id, data))
    .returning();
  return NextResponse.json(draft, { status: 201 });
}
