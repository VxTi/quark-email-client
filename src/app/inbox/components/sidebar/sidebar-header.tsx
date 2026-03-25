'use client';
import { SquarePenIcon } from 'lucide-react';
import UserProfilePopover from '@/app/inbox/components/user-profile-popover';
import Button from '@/components/ui/button';
import UserAvatar from './user-avatar';

interface SidebarHeaderProps {
  user?: { image?: string | null; name: string; email?: string } | null;
  onCompose: () => void;
}

export default function SidebarHeader({ user, onCompose }: SidebarHeaderProps) {
  return (
    <div className="flex min-h-10 items-center justify-between">
      <UserProfilePopover user={user}>
        <button type="button" className="max-w-max cursor-pointer outline-none">
          <UserAvatar user={user} />
        </button>
      </UserProfilePopover>
      <Button className="gap-2" onClick={onCompose}>
        Create
        <SquarePenIcon className="size-4" />
      </Button>
    </div>
  );
}
