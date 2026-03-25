import "server-only";
import nodemailer from "nodemailer";
import { decrypt } from "./encryption";

export interface SmtpCredentials {
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  email: string;
  encryptedPassword: string | null;
}

export function createSmtpTransport(creds: SmtpCredentials) {
  return nodemailer.createTransport({
    host: creds.smtpHost,
    port: creds.smtpPort,
    secure: creds.smtpSecure,
    auth: { user: creds.email, pass: decrypt(creds.encryptedPassword ?? "") },
  });
}
