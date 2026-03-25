"use client";

import { cn } from "@/lib/utils";

interface Props {
  label: string;
  count?: number;
  active?: boolean;
  onClick?: () => void;
}

export default function SidebarItem({ label, count, active = false, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-3 py-2 rounded-md text-sm flex justify-between items-center transition-colors",
        active
          ? "bg-primary text-primary-foreground font-semibold"
          : "text-foreground hover:bg-background",
      )}
    >
      <span>{label}</span>
      {count !== undefined && <span className="text-xs text-muted-foreground">{count}</span>}
    </button>
  );
}
