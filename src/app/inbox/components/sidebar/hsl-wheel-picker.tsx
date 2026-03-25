'use client';
import ColorWheel from './color-wheel';

interface HSLWheelPickerProps {
  h: number;
  s: number;
  l: number;
  setH: (v: number) => void;
  setS: (v: number) => void;
  setL: (v: number) => void;
}

export default function HSLWheelPicker({
  h,
  s,
  l,
  setH,
  setS,
  setL,
}: HSLWheelPickerProps) {
  const handleWheelChange = (hue: number, saturation: number) => {
    setH(hue);
    setS(saturation);
  };

  return (
    <div className="flex flex-col gap-4">
      <ColorWheel h={h} s={s} onColorChange={handleWheelChange} />
    </div>
  );
}
