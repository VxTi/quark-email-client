import "server-only";
import { ImapFlow } from "imapflow";
import { decrypt } from "./encryption";

export interface ImapCredentials {
  imapHost: string;
  imapPort: number;
  imapSecure: boolean;
  email: string;
  encryptedPassword: string | null;
}

function buildImapClient(creds: ImapCredentials): ImapFlow {
  return new ImapFlow({
    host: creds.imapHost,
    port: creds.imapPort,
    secure: creds.imapSecure,
    auth: { user: creds.email, pass: decrypt(creds.encryptedPassword ?? "") },
    logger: false,
  });
}

export async function withImapClient<T>(
  creds: ImapCredentials,
  fn: (client: ImapFlow) => Promise<T>,
): Promise<T> {
  const client = buildImapClient(creds);
  await client.connect();
  try {
    return await fn(client);
  } finally {
    client.close();
  }
}
