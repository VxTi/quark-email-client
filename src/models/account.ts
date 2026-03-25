import { z } from "zod/v4";

export const CreateAccountSchema = z.object({
  displayName: z.string(),
  email: z.string().email(),
  password: z.string(),
  imapHost: z.string(),
  imapPort: z.number(),
  imapSecure: z.boolean(),
  smtpHost: z.string(),
  smtpPort: z.number(),
  smtpSecure: z.boolean(),
});

export type CreateAccountData = z.infer<typeof CreateAccountSchema>;
