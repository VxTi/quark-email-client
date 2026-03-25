'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import LoginForm from '@/app/login/components/login-form';
import OtpVerificationForm from '@/app/login/components/otp-verification-form';
import PasskeySetupForm from '@/app/login/components/passkey-setup-form';
import PasskeySignInButton from '@/app/login/components/passkey-sign-in-button';

type Step = 'email' | 'otp' | 'passkey-setup';

const TITLES: Record<Step, string> = {
  email: 'Welcome',
  otp: 'Check your inbox',
  'passkey-setup': 'One more thing',
};

const SUBTITLES: Record<Step, string> = {
  email: 'Enter your email to sign in or create an account',
  otp: 'Enter the code we sent you',
  'passkey-setup': 'Set up a passkey for faster sign-in next time',
};

function LoginCard({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-muted flex min-h-screen items-center justify-center p-4">
      <div className="bg-card border-border w-full max-w-sm rounded-xl border p-8 shadow-sm">
        {children}
      </div>
    </main>
  );
}

function LoginHeader({ step }: { step: Step }) {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-foreground text-2xl font-medium">{TITLES[step]}</h1>
      <p className="text-muted-foreground mt-1 text-sm">{SUBTITLES[step]}</p>
    </div>
  );
}

function Divider() {
  return (
    <div className="my-1 flex items-center gap-3">
      <div className="bg-border h-px flex-1" />
      <span className="text-muted-foreground text-xs">or</span>
      <div className="bg-border h-px flex-1" />
    </div>
  );
}

function EmailStep({ onContinue }: { onContinue: (email: string) => void }) {
  return (
    <>
      <LoginForm onContinue={onContinue} />
      <Divider />
      <PasskeySignInButton />
    </>
  );
}

export default function LoginPage() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const router = useRouter();
  return (
    <LoginCard>
      <LoginHeader step={step} />
      {step === 'email' && (
        <EmailStep
          onContinue={e => {
            setEmail(e);
            setStep('otp');
          }}
        />
      )}
      {step === 'otp' && (
        <OtpVerificationForm
          email={email}
          onSuccess={() => {
            setStep('passkey-setup');
          }}
        />
      )}
      {step === 'passkey-setup' && (
        <PasskeySetupForm
          onComplete={() => {
            router.push('/inbox');
          }}
        />
      )}
    </LoginCard>
  );
}
