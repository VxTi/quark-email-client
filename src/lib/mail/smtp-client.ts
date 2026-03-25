import 'server-only';
import nodemailer from 'nodemailer';
import { decrypt } from './encryption';

export interface SmtpCredentials {
  accountId: string;
  password: string | null;
}

const mailHost = process.env.MAIL_HOST ?? '';

export function createSmtpTransport(creds: SmtpCredentials) {
  return nodemailer.createTransport({
    host: mailHost,
    port: 587,
    secure: false,
    auth: { user: creds.accountId, pass: decrypt(creds.password ?? '') },
  });
}
