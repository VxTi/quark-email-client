"use client";

export default function SidebarSectionTitle({ title }: { title: string }) {
  return (
    <h2 className="text-xs mb-2 font-medium uppercase tracking-wide text-muted-foreground whitespace-nowrap overflow-hidden">
      {title}
    </h2>
  );
}
