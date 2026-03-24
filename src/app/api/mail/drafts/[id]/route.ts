import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { email } from "@/db/schema";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

type DraftData = { to?: string; cc?: string; bcc?: string; subject?: string; body?: string };

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  const { id } = await params;
  const data = (await req.json()) as DraftData;
  const [updated] = await db
    .update(email)
    .set({
      to: data.to ?? "",
      cc: data.cc ?? "",
      bcc: data.bcc ?? "",
      subject: data.subject ?? "",
      body: data.body ?? "",
      updatedAt: new Date(),
    })
    .where(and(eq(email.id, id), eq(email.userId, session.user.id)))
    .returning();
  if (!updated) return new NextResponse("Not found", { status: 404 });
  return NextResponse.json(updated);
}
