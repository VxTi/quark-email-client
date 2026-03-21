"use client";
import { getContrastColor } from "@/lib/utils";
import type { Email, Tag } from "@/types/email";

interface Props {
  email: Email;
  selected: boolean;
  onClick: () => void;
}

function TagBadge({ tag }: { tag: Tag }) {
  const fg = getContrastColor(tag.color);
  return (
    <span
      className="px-1.5 py-0.5 rounded-full text-[10px] font-medium"
      style={{ backgroundColor: tag.color, color: fg }}
    >
      {tag.name}
    </span>
  );
}

function EmailMeta({ email }: { email: Email }) {
  return (
    <div className="flex justify-between items-start gap-2">
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-sm font-medium text-foreground truncate">{email.from}</span>
        <div className="flex flex-wrap gap-1">
          {email.tags.map((tag) => (
            <TagBadge key={tag.name} tag={tag} />
          ))}
        </div>
      </div>
      <span className="text-xs text-muted-foreground shrink-0">{email.date}</span>
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
      <EmailMeta email={email} />
      <p
        className={`text-sm mt-1 truncate ${
          email.read ? "text-muted-foreground" : "font-semibold text-foreground"
        }`}
      >
        {email.subject}
      </p>
      <p className="text-xs text-muted-foreground mt-0.5 truncate">{email.preview}</p>
    </button>
  );
}
