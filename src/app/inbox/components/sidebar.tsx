"use client";
import { authClient } from "@/lib/auth-client";
import LabelsSection from "./sidebar/labels-section";
import MailboxSection from "./sidebar/mailbox-section";
import SidebarHeader from "./sidebar/sidebar-header";

export default function Sidebar({ onCompose }: { onCompose: () => void }) {
  const { data: session } = authClient.useSession();

  return (
    <aside className="h-full w-60 p-4 flex flex-col border-r border-border bg-card gap-1 shrink-0">
      <SidebarHeader user={session?.user} onCompose={onCompose} />
      <MailboxSection />
      <LabelsSection />
    </aside>
  );
}

