"use client";
import type { LucideIcon } from "lucide-react";
import Button from "@/components/ui/button";

interface SidebarItemProps {
  icon?: LucideIcon;
  color?: string;
  text: string;
  onClick: () => void;
}

export default function SidebarItem({ icon: Icon, color, text, onClick }: SidebarItemProps) {
  return (
    <Button variant="ghost" className="w-full justify-start gap-2" onClick={onClick}>
      <span className="flex h-4 w-4 items-center justify-center shrink-0">
        {color ? (
          <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
        ) : Icon ? (
          <Icon className="h-4 w-4" />
        ) : null}
      </span>
      <span className="whitespace-nowrap overflow-hidden transition-all">{text}</span>
    </Button>
  );
}
