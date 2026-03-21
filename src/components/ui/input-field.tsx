"use client";
import { Field } from "@base-ui/react/field";
import type { ComponentProps } from "react";

interface Props extends Omit<ComponentProps<"input">, "onChange"> {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function InputField({
  label,
  type = "text",
  value,
  onChange,
  error,
  ...props
}: Props) {
  return (
    <Field.Root invalid={!!error} className="flex flex-col gap-1.5">
      <Field.Label className="text-sm font-medium text-foreground">{label}</Field.Label>
      <Field.Control
        render={
          <input type={type} value={value} onChange={(e) => onChange(e.target.value)} {...props} />
        }
        className="px-3 py-2 border border-border rounded-xl bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 transition-shadow w-full"
      />
      {error && <Field.Error className="text-red-500 text-xs">{error}</Field.Error>}
    </Field.Root>
  );
}
