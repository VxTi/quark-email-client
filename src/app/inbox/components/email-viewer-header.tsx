import type { Email } from '@/types/email';

interface Props {
  email: Email;
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <span className="text-muted-foreground text-sm">
      <span className="text-foreground font-medium">{label}:</span> {value}
    </span>
  );
}

export default function EmailViewerHeader({ email }: Props) {
  return (
    <div className="border-border shrink-0 border-b px-6 py-4">
      <h1 className="text-foreground text-lg font-semibold">{email.subject}</h1>
      <div className="mt-2 flex flex-wrap gap-4">
        <MetaRow label="From" value={email.from} />
        <MetaRow label="To" value={email.to} />
        <MetaRow label="Date" value={email.date} />
      </div>
    </div>
  );
}
