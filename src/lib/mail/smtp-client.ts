import 'server-only';
import nodemailer from 'nodemailer';
import { decrypt } from './encryption';

export interface SmtpCredentials {
  smtpHost: string | null;
  smtpPort: number | null;
  smtpSecure: boolean | null;
  accountId: string;
  password: string | null;
}

export function createSmtpTransport(creds: SmtpCredentials) {
  return nodemailer.createTransport({
    host: creds.smtpHost ?? '',
    port: creds.smtpPort ?? 587,
    secure: creds.smtpSecure ?? false,
    auth: { user: creds.accountId, pass: decrypt(creds.password ?? '') },
  });
}
