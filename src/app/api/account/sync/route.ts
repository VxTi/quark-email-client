import { NextResponse } from "next/server";
import { createRoute } from "@/lib/api-route";
import { getMailAccount } from "@/lib/mail/account";
import { syncFolders, getFolders } from "@/lib/mail/folders";
import { fetchEnvelopes } from "@/lib/mail/messages";

async function syncAccount(userId: string) {
  const account = await getMailAccount(userId);
  if (!account) throw new Error("No mail account configured");
  await syncFolders(account.id, account);
  const folders = await getFolders(account.id);
  await Promise.all(folders.map((f) => fetchEnvelopes(userId, account.id, f.id, account, f.path)));
  return { folderCount: folders.length };
}

export const POST = createRoute({
  requiresAuthentication: true,
  handler: async ({ session }) => {
    try {
      const result = await syncAccount(session.user.id);
      return NextResponse.json(result);
    } catch (error) {
      if (error instanceof Error && error.message === "No mail account configured") {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      throw error;
    }
  },
});
