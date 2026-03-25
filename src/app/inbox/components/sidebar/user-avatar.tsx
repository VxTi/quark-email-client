'use client';
import { UserIcon } from 'lucide-react';
import Image from 'next/image';

export default function UserAvatar({
  user,
}: {
  user?: { image?: string | null; name: string } | null;
}) {
  return (
    <div className="sidebar-text flex items-center gap-2 overflow-hidden">
      {user?.image ? (
        <Image
          src={user.image}
          alt=""
          width={24}
          height={24}
          className="rounded-full"
        />
      ) : (
        <UserIcon className="text-muted-foreground" />
      )}
      <span className="truncate text-sm font-medium">
        {user?.name ?? 'User'}
      </span>
    </div>
  );
}
