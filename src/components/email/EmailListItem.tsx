"use client";
import type { Email } from "@/types/email";

interface Props {
  email: Email;
  selected: boolean;
  onClick: () => void;
}

function EmailMeta({ from, date }: { from: string; date: string }) {
  return (
    <div className="flex justify-between items-center gap-2">
      <span className="text-sm font-medium text-foreground truncate">{from}</span>
      <span className="text-xs text-muted-foreground shrink-0">{date}</span>
    </div>
  );
}

export default function EmailListItem({ email, selected, onClick }: Props) {
  const bg = selected
    ? "bg-card border-l-2 border-l-primary"
    : "hover:bg-card border-l-2 border-l-transparent";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-3 border-b border-border transition-colors ${bg}`}
    >
      <EmailMeta from={email.from} date={email.date} />
      <p
        className={`text-sm mt-1 truncate ${email.read ? "text-muted-foreground" : "font-semibold text-foreground"}`}
      >
        {email.subject}
      </p>
      <p className="text-xs text-muted-foreground mt-0.5 truncate">{email.preview}</p>
    </button>
  );
}
