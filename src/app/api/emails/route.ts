import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { email } from "@/db/schema";
import { auth } from "@/lib/auth";
import { InternalTag } from "@/types/email";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

async function insertEmail(userId: string, data: Record<string, string>) {
  return db
    .insert(email)
    .values({
      id: crypto.randomUUID(),
      userId,
      tagId: data.tagId,
      internalTag: (data.internalTag as InternalTag) ?? InternalTag.Draft,
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
  const emails = await db.select().from(email).where(eq(email.userId, session.user.id));
  return NextResponse.json(emails);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  const data = await req.json();
  const [newEmail] = await insertEmail(session.user.id, data);
  return NextResponse.json(newEmail);
}
