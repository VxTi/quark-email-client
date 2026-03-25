import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { mkdir, writeFile } from 'node:fs/promises';
import { NextResponse } from 'next/server';
import { createRoute } from '@/lib/api-route';
import { db } from '@/db';
import { attachment } from '@/db/schema';

async function ensureAttachmentDir() {
  const dir = join(tmpdir(), 'mail-attachments');
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
    .values({
      id: crypto.randomUUID(),
      filename: file.name,
      contentType: file.type,
      size: file.size,
      storageKey,
      createdAt: new Date(),
    })
    .returning();
  return row;
}

export const POST = createRoute({
  requiresAuthentication: true,
  handler: async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File))
      return NextResponse.json({ error: 'Missing file' }, { status: 400 });
    const staged = await stageAttachment(file);
    return NextResponse.json(staged, { status: 201 });
  },
});
