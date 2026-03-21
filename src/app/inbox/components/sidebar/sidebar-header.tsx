"use client";
import { SquarePenIcon } from "lucide-react";
import UserProfilePopover from "@/app/inbox/components/user-profile-popover";
import Button from "@/components/ui/button";
import UserAvatar from "./user-avatar";

interface SidebarHeaderProps {
  user?: { image?: string | null; name: string; email?: string } | null;
  onCompose: () => void;
}

export default function SidebarHeader({ user, onCompose }: SidebarHeaderProps) {
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

