"use client";
import { authClient } from "@/lib/auth-client";
import type { ActiveFilter } from "@/types/email";
import MailboxSection from "./sidebar/mailbox-section";
import SidebarHeader from "./sidebar/sidebar-header";
import TagSection from "./sidebar/tag-section";

interface SidebarProps {
  onCompose: () => void;
  filter: ActiveFilter;
  onFilter: (filter: ActiveFilter) => void;
}

export default function Sidebar({ onCompose, filter, onFilter }: SidebarProps) {
  const { data: session } = authClient.useSession();
  return (
    <aside className="h-full w-60 p-4 flex flex-col border-r border-border bg-card gap-1 shrink-0">
      <SidebarHeader user={session?.user} onCompose={onCompose} />
      <MailboxSection filter={filter} onFilter={onFilter} />
      <TagSection filter={filter} onFilter={onFilter} />
    </aside>
  );
}
