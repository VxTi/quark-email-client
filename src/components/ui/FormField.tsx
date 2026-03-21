"use client";
import { Field } from "@base-ui/react/field";

interface Props {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function FormField({ label, type = "text", value, onChange, error }: Props) {
  return (
    <Field.Root invalid={!!error} className="flex flex-col gap-1.5">
      <Field.Label className="text-sm font-medium text-text">{label}</Field.Label>
      <Field.Control
        render={<input type={type} value={value} onChange={(e) => onChange(e.target.value)} />}
        className="px-3 py-2 border border-border rounded-xl bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 transition-shadow w-full"
      />
      {error && <Field.Error className="text-red-500 text-xs">{error}</Field.Error>}
    </Field.Root>
  );
}
