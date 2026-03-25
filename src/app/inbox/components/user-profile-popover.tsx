'use client';
import { Popover } from '@base-ui/react/popover';
import { LogOutIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type * as React from 'react';
import Button from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

function useSignOut() {
  const router = useRouter();
  return async () => {
    await authClient.signOut();
    router.push('/login');
  };
}

function ProfileMenu({
  user,
}: {
  user?: { name: string; email?: string } | null;
}) {
  const signOut = useSignOut();
  return (
    <div className="flex min-w-48 flex-col gap-2 p-2">
      <div className="flex flex-col px-2 py-1.5">
        <span className="text-sm font-medium">{user?.name ?? 'User'}</span>
        <span className="text-muted-foreground text-xs">{user?.email}</span>
      </div>
      <div className="bg-border -mx-2 h-px" />
      <Button
        variant="ghost"
        size="sm"
        className="text-primary justify-start gap-2"
        onClick={signOut}
      >
        <LogOutIcon className="h-4 w-4" />
        <span>Sign Out</span>
      </Button>
    </div>
  );
}

export default function UserProfilePopover({
  children,
  user,
}: {
  children: React.ReactElement;
  user?: { name: string; email?: string } | null;
}) {
  return (
    <Popover.Root>
      <Popover.Trigger render={children} />
      <Popover.Portal>
        <Popover.Positioner side="right" sideOffset={8} align="end">
          <Popover.Popup className="bg-card border-border origin-(--transform-origin) rounded-lg border shadow-lg transition-all duration-200 outline-none data-[state=closed]:scale-95 data-[state=closed]:opacity-0">
            <ProfileMenu user={user} />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
