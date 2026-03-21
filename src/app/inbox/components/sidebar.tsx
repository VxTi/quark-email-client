"use client";
import { ArrowDiagonalIcon } from "@hugeicons/core-free-icons";
import {
  type LucideIcon,
  MessageCircleIcon,
  PenLineIcon,
  PlusIcon,
  SendIcon,
  SquarePenIcon,
  TagIcon,
  Trash2Icon,
  UserIcon,
} from "lucide-react";
import Image from "next/image";
import UserProfilePopover from "@/app/inbox/components/user-profile-popover";
import Button from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useTags } from "@/lib/tag-context";

interface SidebarItemProps {
  icon: LucideIcon;
  text: string;
  onClick: () => void;
}

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

function SidebarLabelGroup() {
  const { tags, createTag } = useTags();
  const sortedTags = [...tags].sort((a, b) => a.name.localeCompare(b.name));
  return (
    <div className="flex flex-col gap-1 mt-4">
      <div className="flex items-center justify-between px-3">
        <SidebarSectionTitle title="Labels" />
        {tags.length === 0 && (
          <Button variant="ghost" size="icon" onClick={() => createTag("New Label")}>
            <PlusIcon className="size-3" />
          </Button>
        )}
      </div>
      {sortedTags.map((tag) => (
        <SidebarItem key={tag.name} icon={TagIcon} text={tag.name} onClick={() => {}} />
      ))}
    </div>
  );
}

export default function Sidebar({ onCompose }: { onCompose: () => void }) {
  const { data: session } = authClient.useSession();

  return (
    <aside className="h-full w-60 p-4 flex flex-col border-r border-border bg-card gap-1 shrink-0">
      <SidebarHeader user={session?.user} onCompose={onCompose} />
      <SidebarSectionTitle title="Mailbox" />
      {SIDEBAR_ACTIONS.map((action) => (
        <SidebarItem key={action.text} {...action} onClick={() => {}} />
      ))}
      <SidebarLabelGroup />
    </aside>
  );
}

function SidebarHeader({
  user,
  onCompose,
}: {
  user?: { image?: string | null; name: string; email?: string } | null;
  onCompose: () => void;
}) {
  return (
    <div className="flex items-center justify-between min-h-10">
      <UserProfilePopover user={user}>
        <button type="button" className="max-w-max outline-none cursor-pointer">
          <UserAvatar user={user} />
        </button>
      </UserProfilePopover>
      <Button variant="ghost" size="icon" onClick={onCompose}>
        <SquarePenIcon className="size-4" />
      </Button>
    </div>
  );
}

function UserAvatar({ user }: { user?: { image?: string | null; name: string } | null }) {
  return (
    <div className="sidebar-text flex items-center gap-2 overflow-hidden *:size-4">
      {user?.image ? (
        <Image src={user.image} alt="" width={24} height={24} className="rounded-full" />
      ) : (
        <UserIcon className="text-muted-foreground" />
      )}
      <span className="text-sm font-medium truncate">{user?.name || "User"}</span>
    </div>
  );
}

function SidebarSectionTitle({ title }: { title: string }) {
  return (
    <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground whitespace-nowrap overflow-hidden">
      {title}
    </h2>
  );
}

function SidebarItem({ icon: Icon, text, onClick }: SidebarItemProps) {
  return (
    <Button variant="ghost" className="w-full justify-start gap-2" onClick={onClick}>
      <span className="flex h-4 w-4 items-center justify-center shrink-0">
        <Icon className="h-4 w-4" />
      </span>
      <span className="whitespace-nowrap overflow-hidden transition-all">{text}</span>
    </Button>
  );
}
