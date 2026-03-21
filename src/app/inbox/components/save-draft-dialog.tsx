"use client";
import { Dialog } from "@base-ui/react/dialog";
import Button from "@/components/ui/button";

interface Props {
  open: boolean;
  onConfirm: (save: boolean) => void;
}

export default function SaveDraftDialog({ open, onConfirm }: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={(o) => { if (!o) onConfirm(false); }}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/40" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-xl p-6 flex flex-col gap-4 shadow-lg w-80">
          <Dialog.Title className="text-sm font-semibold text-foreground">Save draft?</Dialog.Title>
          <Dialog.Description className="text-xs text-muted-foreground">Do you wish to save this draft before switching?</Dialog.Description>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => onConfirm(false)}>No</Button>
            <Button onClick={() => onConfirm(true)}>Yes</Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
