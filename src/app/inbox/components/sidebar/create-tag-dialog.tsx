'use client';
import { useState } from 'react';
import Button from '@/components/ui/button';
import InputField from '@/components/ui/input-field';
import { hslToHex } from '@/lib/color-utils';
import HSLWheelPicker from './hsl-wheel-picker';

interface Props {
  onCreate: (name: string, color: string) => void;
  onClose: () => void;
}

function useCreateTagForm(
  onCreate: Props['onCreate'],
  onClose: Props['onClose']
) {
  const [name, setName] = useState('');
  const [h, setH] = useState(200);
  const [s, setS] = useState(70);
  const [l, setL] = useState(50);
  const hexColor = hslToHex(h, s, l);
  const handleCreate = () => {
    if (!name) return;
    onCreate(name, hexColor);
    setName('');
    onClose();
  };
  return { name, setName, h, setH, s, setS, l, setL, hexColor, handleCreate };
}

function ActionButtons({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: () => void;
}) {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="ghost" onClick={onClose}>
        Cancel
      </Button>
      <Button onClick={onCreate}>Create</Button>
    </div>
  );
}

export default function CreateTagForm({ onCreate, onClose }: Props) {
  const { name, setName, h, setH, s, setS, l, setL, hexColor, handleCreate } =
    useCreateTagForm(onCreate, onClose);
  return (
    <div className="flex flex-col gap-4 p-4">
      <p className="text-foreground text-sm font-semibold">Create a new tag</p>
      <InputField
        label="Tag Name"
        value={name}
        onChange={setName}
        placeholder="e.g. Work"
      />
      <div className="flex items-center gap-3">
        <div
          className="border-border size-10 rounded-lg border"
          style={{ backgroundColor: hexColor }}
        />
        <span className="text-muted-foreground font-mono text-xs">
          {hexColor.toUpperCase()}
        </span>
      </div>
      <HSLWheelPicker h={h} s={s} l={l} setH={setH} setS={setS} setL={setL} />
      <ActionButtons onClose={onClose} onCreate={handleCreate} />
    </div>
  );
}
