"use client";
import { Dialog } from "@base-ui/react/dialog";
import { useState } from "react";
import Button from "@/components/ui/button";
import InputField from "@/components/ui/input-field";
import { hslToHex } from "@/lib/color-utils";
import HSLWheelPicker from "./hsl-wheel-picker";

interface CreateLabelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (name: string, color: string) => void;
}

export default function CreateTagDialog({ open, onOpenChange, onCreate }: CreateLabelDialogProps) {
  const [name, setName] = useState("");
  const [h, setH] = useState(200);
  const [s, setS] = useState(70);
  const [l, setL] = useState(50);

  const hexColor = hslToHex(h, s, l);

  const handleCreate = () => {
    if (!name) return;
    onCreate(name, hexColor);
    setName("");
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/40" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-xl p-6 flex flex-col gap-4 shadow-lg w-80">
          <Dialog.Title className="text-sm font-semibold text-foreground">
            Create a new tag
          </Dialog.Title>
          <InputField label="Label Name" value={name} onChange={setName} placeholder="e.g. Work" />
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div
                className="size-10 rounded-lg border border-border"
                style={{ backgroundColor: hexColor }}
              />
              <div className="text-xs font-mono text-muted-foreground">
                {hexColor.toUpperCase()}
              </div>
            </div>
            <HSLWheelPicker h={h} s={s} l={l} setH={setH} setS={setS} setL={setL} />
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create</Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
