'use client';
import { cn, getContrastColor } from '@/lib/utils';
import type { Email, Tag } from '@/types/email';

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
      className="rounded-full px-1.5 py-0.5 text-[10px] font-medium"
      style={{ backgroundColor: tag.color, color: fg }}
    >
      {tag.name}
    </span>
  );
}

function EmailMeta({ email }: { email: Email }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div className="flex min-w-0 flex-col gap-1">
        <span className="text-foreground truncate text-sm font-medium">
          {email.from}
        </span>
        <div className="flex flex-wrap gap-1">
          {email.tags.map(tag => (
            <TagBadge key={tag.name} tag={tag} />
          ))}
        </div>
      </div>
      <span className="text-muted-foreground shrink-0 text-xs">
        {email.date}
      </span>
    </div>
  );
}

function SelectIndicator({ checked }: { checked: boolean }) {
  return (
    <div
      className={cn(
        'mt-0.5 size-4 shrink-0 rounded border-2 transition-colors',
        checked ? 'bg-primary border-primary' : 'border-border'
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
        'border-border flex w-full items-start gap-3 border-b px-4 py-3 text-left transition-colors',
        selected
          ? 'bg-card border-l-primary border-l-2'
          : 'hover:bg-card border-l-2 border-l-transparent'
      )}
    >
      {selectable && <SelectIndicator checked={!!checked} />}
      <div className="min-w-0 flex-1">
        <EmailMeta email={email} />
        <p
          className={cn(
            'mt-1 truncate text-sm',
            email.read
              ? 'text-muted-foreground'
              : 'text-foreground font-semibold'
          )}
        >
          {email.subject}
        </p>
        <p className="text-muted-foreground mt-0.5 truncate text-xs">
          {email.bodyText?.slice(0, 150)}
        </p>
      </div>
    </button>
  );
}
