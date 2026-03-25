import type { ReactNode } from 'react';

export interface SidebarSectionProps {
  children: ReactNode;
}

export default function SidebarSection({ children }: SidebarSectionProps) {
  return <div className="mt-0.5 mb-2 flex flex-col gap-0.5">{children}</div>;
}
