"use client";
import { MessageCircleIcon, SendIcon, PenLineIcon, Trash2Icon, type LucideIcon } from "lucide-react";
import SidebarItem from "./sidebar-item";
import SidebarSectionTitle from "./sidebar-section-title";

type SidebarItemType = {
  icon: LucideIcon;
  text: string;
};

const SIDEBAR_ACTIONS: SidebarItemType[] = [
  { icon: MessageCircleIcon, text: "Inbox" },
  { icon: SendIcon, text: "Sent" },
  { icon: PenLineIcon, text: "Drafts" },
  { icon: Trash2Icon, text: "Trash" },
];

export default function MailboxSection() {
  return (
    <div className="flex flex-col gap-1">
      <SidebarSectionTitle title="Mailbox" />
      {SIDEBAR_ACTIONS.map((action) => (
        <SidebarItem key={action.text} {...action} onClick={() => {}} />
      ))}
    </div>
  );
}

