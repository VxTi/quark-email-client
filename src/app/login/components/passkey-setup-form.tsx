'use client';
import { useState } from 'react';
import Button from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

interface Props {
  onComplete: () => void;
}

function usePasskeySetup(onComplete: () => void) {
  const [error, setError] = useState('');
  const setup = async () => {
    const { error: err } = await authClient.passkey.addPasskey();
    if (err) {
      setError(
        (err as { message?: string }).message ?? 'Failed to set up passkey'
      );
      return;
    }
    onComplete();
  };
  return { setup, error };
}

export default function PasskeySetupForm({ onComplete }: Props) {
  const { setup, error } = usePasskeySetup(onComplete);
  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground text-center text-sm">
        Register a passkey so you can sign in instantly next time — no code
        needed.
      </p>
      {error && <p className="text-destructive text-center text-xs">{error}</p>}
      <Button className="mt-2 w-full" onClick={setup}>
        Set up passkey
      </Button>
      <Button variant="ghost" className="w-full" onClick={onComplete}>
        Skip for now
      </Button>
    </div>
  );
}
