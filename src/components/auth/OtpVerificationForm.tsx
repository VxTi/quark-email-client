"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import FormField from "@/components/ui/FormField";
import Button from "@/components/ui/Button";

interface Props {
  email: string;
}

function useOtpForm(email: string) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error: err } = await authClient.signIn.emailOtp({ email, otp: code });
    if (err) {
      setError(err.message ?? "Invalid code");
      return;
    }
    router.push("/inbox");
  };

  return { code, setCode, error, submit };
}

export default function OtpVerificationForm({ email }: Props) {
  const { code, setCode, error, submit } = useOtpForm(email);
  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <p className="text-muted-foreground text-sm text-center">
        We sent a code to <strong className="text-foreground">{email}</strong>.
      </p>
      <FormField label="Verification code" value={code} onChange={setCode} error={error} />
      <Button type="submit" className="w-full mt-2">
        Verify
      </Button>
    </form>
  );
}
