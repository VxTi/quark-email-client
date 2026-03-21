"use client";

interface Props {
  label: string;
  count?: number;
  active?: boolean;
  onClick?: () => void;
}

export default function SidebarItem({ label, count, active = false, onClick }: Props) {
  const activeClass = active
    ? "bg-primary text-primary-foreground font-semibold"
    : "text-foreground hover:bg-background";
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-md text-sm flex justify-between items-center transition-colors ${activeClass}`}
    >
      <span>{label}</span>
      {count !== undefined && <span className="text-xs text-muted-foreground">{count}</span>}
    </button>
  );
}
