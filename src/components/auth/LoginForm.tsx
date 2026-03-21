"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import FormField from "@/components/ui/FormField";
import Button from "@/components/ui/Button";

interface Props { onContinue: (email: string) => void; }

function useEmailForm(onContinue: Props["onContinue"]) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error: err } = await authClient.emailOTP.sendVerificationOtp({ email, type: "sign-in" });
    if (err) { setError(err.message ?? "Failed to send code"); return; }
    onContinue(email);
  };

  return { email, setEmail, error, submit };
}

export default function LoginForm({ onContinue }: Props) {
  const { email, setEmail, error, submit } = useEmailForm(onContinue);
  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <FormField label="Email address" type="email" value={email} onChange={setEmail} error={error} />
      <Button type="submit" className="w-full mt-2">Continue</Button>
    </form>
  );
}
