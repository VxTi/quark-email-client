'use client';

export default function SidebarSectionTitle({ title }: { title: string }) {
  return (
    <h2 className="text-muted-foreground mb-2 overflow-hidden text-xs font-medium tracking-wide whitespace-nowrap uppercase">
      {title}
    </h2>
  );
}
