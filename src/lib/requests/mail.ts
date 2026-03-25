import { request } from '@/lib/utils';
import { ApiEmailSchema, type ApiEmail, type DraftData, type SendEmailData } from '@/models/email';
import { z } from 'zod';

export async function sendEmail(data: SendEmailData): Promise<void> {
  await request('/api/mail/send', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    decoder: z.null(),
  });
}

export async function saveDraft(data: DraftData): Promise<ApiEmail> {
  return request('/api/mail/drafts', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    decoder: ApiEmailSchema,
  });
}
