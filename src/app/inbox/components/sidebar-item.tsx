'use client';

import { cn } from '@/lib/utils';

interface Props {
  label: string;
  count?: number;
  active?: boolean;
  onClick?: () => void;
}

export default function SidebarItem({
  label,
  count,
  active = false,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors',
        active
          ? 'bg-primary text-primary-foreground font-semibold'
          : 'text-foreground hover:bg-background'
      )}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span className="text-muted-foreground text-xs">{count}</span>
      )}
    </button>
  );
}
