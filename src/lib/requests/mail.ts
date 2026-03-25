import { request } from '@/lib/utils';
import { type SendEmailData } from '@/models/email';
import { z } from 'zod';

export async function sendEmail(data: SendEmailData): Promise<void> {
  await request('/api/mail/send', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    decoder: z.null(),
  });
}
