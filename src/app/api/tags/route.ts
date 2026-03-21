import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { tag } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const tags = await db.select().from(tag).where(eq(tag.userId, session.user.id));

  return NextResponse.json(tags);
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const { name, color } = await req.json();
  const newTag = await db
    .insert(tag)
    .values({
      id: crypto.randomUUID(),
      name,
      color: color ?? "#E5E7EB",
      userId: session.user.id,
      createdAt: new Date(),
    })
    .returning();

  return NextResponse.json(newTag[0]);
}
