'use client';
import { Field } from '@base-ui/react/field';
import type { ComponentProps } from 'react';

interface Props extends Omit<ComponentProps<'input'>, 'onChange'> {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function InputField({
  label,
  type = 'text',
  value,
  onChange,
  error,
  ...props
}: Props) {
  return (
    <Field.Root invalid={!!error} className="flex flex-col gap-1.5">
      <Field.Label className="text-foreground text-sm font-medium">
        {label}
      </Field.Label>
      <Field.Control
        render={
          <input
            type={type}
            value={value}
            onChange={e => {
              onChange(e.target.value);
            }}
            {...props}
          />
        }
        className="border-border bg-card text-foreground focus:ring-ring/30 w-full rounded-xl border px-3 py-2 text-sm transition-shadow focus:ring-2 focus:outline-none"
      />
      {error && (
        <Field.Error className="text-xs text-red-500">{error}</Field.Error>
      )}
    </Field.Root>
  );
}
