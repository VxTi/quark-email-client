import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { draft } from "@/db/schema";
import { auth } from "@/lib/auth";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

async function insertDraft(userId: string, data: Record<string, string>) {
  return db
    .insert(draft)
    .values({
      id: crypto.randomUUID(),
      userId,
      to: data.to ?? "",
      cc: data.cc ?? "",
      bcc: data.bcc ?? "",
      subject: data.subject ?? "",
      body: data.body ?? "",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
}

export async function GET() {
  const session = await getSession();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  const drafts = await db.select().from(draft).where(eq(draft.userId, session.user.id));
  return NextResponse.json(drafts);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  const data = await req.json();
  const [newDraft] = await insertDraft(session.user.id, data);
  return NextResponse.json(newDraft);
}
