import { z } from 'zod/v4';

export const CreateAccountSchema = z.object({
  displayName: z.string(),
  email: z.email(),
  password: z.string(),
});

export type CreateAccountData = z.infer<typeof CreateAccountSchema>;
