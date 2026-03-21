import type { Email } from "@/types/email";

interface Props {
  email: Email;
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <span className="text-sm text-muted-foreground">
      <span className="font-medium text-foreground">{label}:</span> {value}
    </span>
  );
}

export default function EmailViewerHeader({ email }: Props) {
  return (
    <div className="px-6 py-4 border-b border-border shrink-0">
      <h1 className="text-lg font-semibold text-foreground">{email.subject}</h1>
      <div className="mt-2 flex flex-wrap gap-4">
        <MetaRow label="From" value={email.from} />
        <MetaRow label="To" value={email.to} />
        <MetaRow label="Date" value={email.date} />
      </div>
    </div>
  );
}
