import { config } from "dotenv";
import path from "path";

config({ path: path.resolve(process.cwd(), ".env.local") });

import { db } from "@/db";
import { email, account } from "@/db/schema";
import { InternalTag } from "@/types/email";

async function simulateReceive() {
  const [acc] = await db.select().from(account).limit(1);
  if (!acc) {
    console.error("No mail account found to simulate receiving email.");
    process.exit(1);
  }

  // We simulate "receiving" by inserting an email into the Inbox.
  // The user suggested "by triggering the send API", which we've also
  // enabled in the API itself via a `simulateReceive` flag.

  const payload = {
    userId: acc.userId,
    accountId: acc.id,
    internalTag: InternalTag.Inbox,
    fromAddress: "simulation@example.com",
    fromName: "Simulation Bot",
    to: acc.accountId,
    subject: "Hello from Simulation!",
    body: "<p>This is a simulated email body.</p>",
    preview: "This is a simulated email body.",
    read: false,
    starred: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.insert(email).values({
    id: crypto.randomUUID(),
    ...payload,
  });

  console.log("Simulated email received (inserted into Inbox) for", acc.accountId);
}

simulateReceive().catch(console.error);
