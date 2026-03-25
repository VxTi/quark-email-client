'use client';
import { Dialog } from '@base-ui/react/dialog';
import Button from '@/components/ui/button';

interface Props {
  open: boolean;
  onConfirm: (save: boolean) => void;
}

export default function SaveEmailDialog({ open, onConfirm }: Props) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={o => {
        if (!o) onConfirm(false);
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/40" />
        <Dialog.Popup className="bg-card border-border fixed top-1/2 left-1/2 flex w-80 -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-xl border p-6 shadow-lg">
          <Dialog.Title className="text-foreground text-sm font-semibold">
            Save email?
          </Dialog.Title>
          <Dialog.Description className="text-muted-foreground text-xs">
            Do you wish to save this email before switching?
          </Dialog.Description>
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                onConfirm(false);
              }}
            >
              No
            </Button>
            <Button
              onClick={() => {
                onConfirm(true);
              }}
            >
              Yes
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
