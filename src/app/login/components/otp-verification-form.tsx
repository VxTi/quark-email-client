"use client";
import { useState } from "react";
import Button from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";

interface Props {
  email: string;
  onSuccess: () => void;
}

function useOtpForm(email: string, onSuccess: () => void) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error: err } = await authClient.signIn.emailOtp({ email, otp: code });
    if (err) { setError(err.message ?? "Invalid code"); return; }
    onSuccess();
  };
  return { code, setCode, error, submit };
}

export default function OtpVerificationForm({ email, onSuccess }: Props) {
  const { setCode, submit, code, error } = useOtpForm(email, onSuccess);
  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <p className="text-muted-foreground text-sm text-center">
        We sent a code to <strong className="text-foreground">{email}</strong>.
      </p>
      <div className="flex flex-col items-center">
        <InputOTP
          maxLength={6}
          value={code}
          onChange={(value) => setCode(value)}
          className={error ? "border-destructive" : ""}
        >
          <InputOTPGroup className="w-full">
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        {error && <p className="text-destructive text-sm mt-2">{error}</p>}
      </div>
      <Button type="submit" className="w-full mt-2">
        Verify
      </Button>
    </form>
  );
}
