"use client";
import { Field } from "@base-ui/react/field";
import { XIcon } from "lucide-react";
import ResponseInputField from "@/app/inbox/components/reply-composer/response-input-field";
import Button from "@/components/ui/button";

export interface ComposeFormProps {
  to: string; setTo: (v: string) => void;
  cc: string; setCc: (v: string) => void;
  bcc: string; setBcc: (v: string) => void;
  subject: string; setSubject: (v: string) => void;
}

interface Props extends ComposeFormProps {
  onClose: () => void;
}

function ComposeFieldRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Field.Root className="flex items-center gap-3 px-4 py-2 border-b border-border">
      <Field.Label className="text-xs font-medium text-muted-foreground w-12 shrink-0">
        {label}
      </Field.Label>
      <Field.Control
        render={<input value={value} onChange={(e) => onChange(e.target.value)} />}
        className="flex-1 bg-transparent text-sm text-foreground outline-none"
      />
    </Field.Root>
  );
}

function ComposeViewHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
      <h2 className="text-sm font-semibold text-foreground">New Message</h2>
      <Button variant="ghost" size="icon" onClick={onClose}>
        <XIcon className="size-4" />
      </Button>
    </div>
  );
}

function ComposeFormFields({ to, setTo, cc, setCc, bcc, setBcc, subject, setSubject }: ComposeFormProps) {
  return (
    <div className="shrink-0">
      <ComposeFieldRow label="To" value={to} onChange={setTo} />
      <ComposeFieldRow label="CC" value={cc} onChange={setCc} />
      <ComposeFieldRow label="BCC" value={bcc} onChange={setBcc} />
      <ComposeFieldRow label="Subject" value={subject} onChange={setSubject} />
    </div>
  );
}

export default function ComposeView({ onClose, ...form }: Props) {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <ComposeViewHeader onClose={onClose} />
      <ComposeFormFields {...form} />
      <div className="flex-1" />
      <ResponseInputField />
    </div>
  );
}
