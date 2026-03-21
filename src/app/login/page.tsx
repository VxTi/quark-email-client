"use client";
import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import OtpVerificationForm from "@/components/auth/OtpVerificationForm";

type Step = "email" | "otp";

function LoginCard({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-card border border-border rounded-xl p-8 shadow-sm">
        {children}
      </div>
    </main>
  );
}

function LoginHeader({ step }: { step: Step }) {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-2xl font-bold text-foreground">
        {step === "email" ? "Welcome" : "Check your inbox"}
      </h1>
      <p className="text-muted-foreground mt-1 text-sm">
        {step === "email"
          ? "Enter your email to sign in or register"
          : "Enter the code we sent you"}
      </p>
    </div>
  );
}

export default function LoginPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  return (
    <LoginCard>
      <LoginHeader step={step} />
      {step === "email" ? (
        <LoginForm
          onContinue={(e) => {
            setEmail(e);
            setStep("otp");
          }}
        />
      ) : (
        <OtpVerificationForm email={email} />
      )}
    </LoginCard>
  );
}
