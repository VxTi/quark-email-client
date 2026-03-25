import { NextResponse } from "next/server";
import { createRoute } from "@/lib/api-route";
import { createMailAccount } from "@/lib/mail/account";
import { CreateMailAccountSchema } from "@/models";

export const POST = createRoute({
  requiresAuthentication: true,
  strict: true,
  requestValidator: {
    validator: CreateMailAccountSchema,
    in: "body",
  },
  handler: async ({ session, data }) => {
    const account = await createMailAccount(session.user.id, data);
    return NextResponse.json(account, { status: 201 });
  },
});
