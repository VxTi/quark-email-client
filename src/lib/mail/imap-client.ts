import 'server-only';
import { ImapFlow } from 'imapflow';
import { decrypt } from './encryption';

export interface ImapCredentials {
  accountId: string;
  password: string | null;
}

function buildImapClient(creds: ImapCredentials): ImapFlow {
  return new ImapFlow({
    host: process.env.MAIL_HOST!,
    port: 993,
    secure: true,
    auth: { user: creds.accountId, pass: decrypt(creds.password ?? '') },
    logger: false,
  });
}

export async function withImapClient<T>(
  creds: ImapCredentials,
  fn: (client: ImapFlow) => Promise<T>
): Promise<T> {
  const client = buildImapClient(creds);
  await client.connect();
  try {
    return await fn(client);
  } finally {
    client.close();
  }
}
