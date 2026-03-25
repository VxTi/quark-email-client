'use client';
import type { LucideIcon } from 'lucide-react';
import Button from '@/components/ui/button';
import { twMerge } from 'tailwind-merge';

interface SidebarItemProps {
  icon?: LucideIcon;
  color?: string;
  text: string;
  onClick: () => void;
  active?: boolean;
}

export default function SidebarItem({
  icon: Icon,
  color,
  text,
  onClick,
  active,
}: SidebarItemProps) {
  return (
    <Button
      variant="ghost"
      className={twMerge(
        'hover:bg-accent hover:text-accent-foreground w-full justify-start gap-2 rounded-sm',
        active && 'bg-accent text-accent-foreground'
      )}
      onClick={onClick}
    >
      <span className="flex h-4 w-4 shrink-0 items-center justify-center">
        {color ? (
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: color }}
          />
        ) : Icon ? (
          <Icon className="h-4 w-4" />
        ) : null}
      </span>
      <span className="overflow-hidden whitespace-nowrap transition-all">
        {text}
      </span>
    </Button>
  );
}
