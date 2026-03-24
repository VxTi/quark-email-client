"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

function usePasskeySignIn() {
  const router = useRouter();
  const [error, setError] = useState("");
  const signIn = async () => {
    const { error: err } = await authClient.signIn.passkey();
    if (err) { setError((err as { message?: string }).message ?? "Passkey sign-in failed"); return; }
    router.push("/inbox");
  };
  return { signIn, error };
}

export default function PasskeySignInButton() {
  const { signIn, error } = usePasskeySignIn();
  return (
    <div className="flex flex-col gap-2">
      {error && <p className="text-destructive text-xs text-center">{error}</p>}
      <Button variant="ghost" className="w-full" onClick={signIn}>
        Sign in with passkey
      </Button>
    </div>
  );
}
