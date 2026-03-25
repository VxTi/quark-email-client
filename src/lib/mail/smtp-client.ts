import 'server-only';
import nodemailer from 'nodemailer';
import { decrypt } from './encryption';
import { resolveSrv, resolveMx } from 'node:dns/promises';

interface SmtpSettings {
  host: string;
  port: number;
  secure: boolean;
}

const knownProviders: Record<string, SmtpSettings | undefined> = {
  'outlook.com': { host: 'smtp-mail.outlook.com', port: 587, secure: false },
  'hotmail.com': { host: 'smtp-mail.outlook.com', port: 587, secure: false },
  'live.com': { host: 'smtp-mail.outlook.com', port: 587, secure: false },
  'gmail.com': { host: 'smtp.gmail.com', port: 587, secure: false },
  'yahoo.com': { host: 'smtp.mail.yahoo.com', port: 587, secure: false },
  'icloud.com': { host: 'smtp.mail.me.com', port: 587, secure: false },
  'me.com': { host: 'smtp.mail.me.com', port: 587, secure: false },
  'aol.com': { host: 'smtp.aol.com', port: 587, secure: false },
  'zoho.com': { host: 'smtp.zoho.com', port: 587, secure: false },
};

async function resolveSmtpSettings(email: string): Promise<SmtpSettings> {
  const domain = email.split('@').at(1)?.toLowerCase() ?? '';

  if (knownProviders[domain]) return knownProviders[domain];

  // 1. Try SRV Records (Submission / SMTPS)
  try {
    const srv = await resolveSrv(`_submission._tcp.${domain}`);
    if (srv.length > 0) {
      const best = srv.sort(
        (a, b) => a.priority - b.priority || b.weight - a.weight
      )[0];
      return { host: best.name, port: best.port, secure: best.port === 465 };
    }
  } catch {
    // Ignore error if SRV record doesn't exist
  }

  try {
    const srv = await resolveSrv(`_smtps._tcp.${domain}`);
    if (srv.length > 0) {
      const best = srv.sort(
        (a, b) => a.priority - b.priority || b.weight - a.weight
      )[0];
      return { host: best.name, port: best.port, secure: true };
    }
  } catch {
    // Ignore error if SRV record doesn't exist
  }

  // 2. Try MX records to guess provider (like Google Workspace or Microsoft 365)
  try {
    const mx = await resolveMx(domain);
    if (mx.length > 0) {
      const exchanges = mx.map(m => m.exchange.toLowerCase());
      if (
        exchanges.some(
          e => e.includes('google.com') || e.includes('googlemail.com')
        )
      ) {
        return knownProviders['gmail.com'];
      }
      if (
        exchanges.some(
          e => e.includes('outlook.com') || e.includes('protection.outlook.com')
        )
      ) {
        return knownProviders['outlook.com'];
      }
      if (exchanges.some(e => e.includes('zoho.com'))) {
        return knownProviders['zoho.com'];
      }
      if (exchanges.some(e => e.includes('yahoodns.net'))) {
        return knownProviders['yahoo.com'];
      }
      if (
        exchanges.some(e => e.includes('icloud.com') || e.includes('me.com'))
      ) {
        return knownProviders['icloud.com'];
      }
    }
  } catch {
    // Ignore error if MX lookup fails
  }

  // 3. Final Fallback (Guessing)
  return {
    host: `smtp.${domain}`,
    port: 587,
    secure: false,
  };
}

export interface SmtpCredentials {
  accountId: string;
  password: string | null;
}

export async function createSmtpTransport(creds: SmtpCredentials) {
  const smtp = await resolveSmtpSettings(creds.accountId);
  return nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: { user: creds.accountId, pass: decrypt(creds.password ?? '') },
  });
}
