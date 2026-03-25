import 'server-only';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { emailOTP, twoFactor } from 'better-auth/plugins';
import { passkey } from '@better-auth/passkey';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { encrypt } from './mail/encryption';

const sendVerificationOTP = async ({
  email,
  otp,
}: {
  email: string;
  otp: string;
  type: string;
}) => {
  // TODO: Replace with a real email provider (e.g. Resend, Nodemailer).
  console.log(`[DEV] Email OTP for ${email}: ${otp}`);
};

const sendSmsOtp = async ({
  user,
  otp,
}: {
  user: { email: string };
  otp: string;
}) => {
  // TODO: Replace with a real SMS provider (e.g. Twilio, AWS SNS).
  console.log(`[DEV] SMS OTP for ${user.email}: ${otp}`);
};

const mailHost = process.env.MAIL_HOST!;

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg', schema }),
  databaseHooks: {
    user: {
      create: {
        after: async user => {
          await db.insert(schema.account).values({
            id: crypto.randomUUID(),
            userId: user.id,
            accountId: user.email,
            providerId: 'email',
            displayName: user.name || user.email.split('@')[0],
            password: encrypt('simulation-password'),
            imapHost: mailHost,
            imapPort: 993,
            imapSecure: true,
            smtpHost: mailHost,
            smtpPort: 465,
            smtpSecure: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        },
      },
    },
  },
  emailAndPassword: { enabled: true },
  plugins: [
    emailOTP({ sendVerificationOTP }),
    twoFactor({ otpOptions: { sendOTP: sendSmsOtp } }),
    passkey({ rpID: 'localhost', rpName: 'Email Client' }),
  ],
});
