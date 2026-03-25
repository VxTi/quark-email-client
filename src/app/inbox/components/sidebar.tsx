'use client';
import { authClient } from '@/lib/auth-client';
import type { ActiveFilter } from '@/types/email';
import MailboxSection from './sidebar/mailbox-section';
import SidebarHeader from './sidebar/sidebar-header';
import TagSection from './sidebar/tag-section';

interface SidebarProps {
  onCompose: () => void;
  filter: ActiveFilter;
  onFilter: (filter: ActiveFilter) => void;
}

export default function Sidebar({ onCompose, filter, onFilter }: SidebarProps) {
  const { data: session } = authClient.useSession();
  return (
    <aside className="border-border flex h-full w-70 shrink-0 flex-col gap-1 border-r-2 p-4">
      <SidebarHeader user={session?.user} onCompose={onCompose} />
      <MailboxSection filter={filter} onFilter={onFilter} />
      <TagSection filter={filter} onFilter={onFilter} />
    </aside>
  );
}
