"use client";
import {
  type LucideIcon,
  MessageCircleIcon,
  PenLineIcon,
  SendIcon,
  Trash2Icon,
} from "lucide-react";
import { type ActiveFilter, InternalTag } from "@/types/email";
import SidebarItem from "./sidebar-item";
import SidebarSectionTitle from "./sidebar-section-title";

type MailboxAction = {
  icon: LucideIcon;
  text: string;
  value: InternalTag;
};

const MAILBOX_ACTIONS: MailboxAction[] = [
  { icon: MessageCircleIcon, text: "Inbox", value: InternalTag.Inbox },
  { icon: SendIcon, text: "Sent", value: InternalTag.Sent },
  { icon: PenLineIcon, text: "Drafts", value: InternalTag.Draft },
  { icon: Trash2Icon, text: "Trash", value: InternalTag.Trash },
];

interface Props {
  filter: ActiveFilter;
  onFilter: (filter: ActiveFilter) => void;
}

export default function MailboxSection({ filter, onFilter }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <SidebarSectionTitle title="Mailbox" />
      {MAILBOX_ACTIONS.map((action) => (
        <SidebarItem
          key={action.text}
          icon={action.icon}
          text={action.text}
          active={filter?.kind === "mailbox" && filter.value === action.value}
          onClick={() => onFilter({ kind: "mailbox", value: action.value })}
        />
      ))}
    </div>
  );
}
