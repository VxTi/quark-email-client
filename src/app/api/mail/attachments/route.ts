import { join } from "node:path";
import { tmpdir } from "node:os";
import { mkdir, writeFile } from "node:fs/promises";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { attachment } from "@/db/schema";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

async function ensureAttachmentDir() {
  const dir = join(tmpdir(), "mail-attachments");
  await mkdir(dir, { recursive: true });
  return dir;
}

async function stageAttachment(file: File) {
  const dir = await ensureAttachmentDir();
  const key = `${crypto.randomUUID()}-${file.name}`;
  const storageKey = join(dir, key);
  await writeFile(storageKey, Buffer.from(await file.arrayBuffer()));
  const [row] = await db
    .insert(attachment)
    .values({ id: crypto.randomUUID(), filename: file.name, contentType: file.type, size: file.size, storageKey, createdAt: new Date() })
    .returning();
  return row;
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) return new NextResponse("Missing file", { status: 400 });
  const staged = await stageAttachment(file);
  return NextResponse.json(staged, { status: 201 });
}
