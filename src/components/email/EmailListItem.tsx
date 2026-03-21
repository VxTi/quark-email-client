"use client";
import type { Email } from "@/types/email";

interface Props { email: Email; selected: boolean; onClick: () => void; }

function EmailMeta({ from, date }: { from: string; date: string }) {
  return (
    <div className="flex justify-between items-center gap-2">
      <span className="text-sm font-medium text-text truncate">{from}</span>
      <span className="text-xs text-text-muted shrink-0">{date}</span>
    </div>
  );
}

export default function EmailListItem({ email, selected, onClick }: Props) {
  const bg = selected ? "bg-zinc-100 border-l-2 border-l-accent" : "hover:bg-bg border-l-2 border-l-transparent";
  return (
    <button onClick={onClick} className={`w-full text-left px-4 py-3 border-b border-border transition-colors ${bg}`}>
      <EmailMeta from={email.from} date={email.date} />
      <p className={`text-sm mt-1 truncate ${email.read ? "text-text-muted" : "font-semibold text-text"}`}>{email.subject}</p>
      <p className="text-xs text-text-muted mt-0.5 truncate">{email.preview}</p>
    </button>
  );
}
