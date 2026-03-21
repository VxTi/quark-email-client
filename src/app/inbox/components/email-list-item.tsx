"use client";
import { cn, getContrastColor } from "@/lib/utils";
import type { Email, Tag } from "@/types/email";

interface Props {
  email: Email;
  selected: boolean;
  onClick: () => void;
  selectable?: boolean;
  checked?: boolean;
  onCheck?: () => void;
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

function SelectIndicator({ checked }: { checked: boolean }) {
  return (
    <div
      className={cn(
        "mt-0.5 size-4 rounded border-2 shrink-0 transition-colors",
        checked ? "bg-primary border-primary" : "border-border",
      )}
    />
  );
}

export default function EmailListItem({
  email,
  selected,
  onClick,
  selectable,
  checked,
  onCheck,
}: Props) {
  return (
    <button
      type="button"
      onClick={selectable ? onCheck : onClick}
      className={cn(
        "w-full text-left px-4 py-3 border-b border-border transition-colors flex items-start gap-3",
        selected
          ? "bg-card border-l-2 border-l-primary"
          : "hover:bg-card border-l-2 border-l-transparent",
      )}
    >
      {selectable && <SelectIndicator checked={!!checked} />}
      <div className="min-w-0 flex-1">
        <EmailMeta email={email} />
        <p
          className={cn(
            "text-sm mt-1 truncate",
            email.read ? "text-muted-foreground" : "font-semibold text-foreground",
          )}
        >
          {email.subject}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">{email.preview}</p>
      </div>
    </button>
  );
}
