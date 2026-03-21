"use client";
import ColorWheel from "./color-wheel";
import { Slider } from "@base-ui/react/slider";

interface HSLWheelPickerProps {
  h: number;
  s: number;
  l: number;
  setH: (v: number) => void;
  setS: (v: number) => void;
  setL: (v: number) => void;
}

export default function HSLWheelPicker({ h, s, l, setH, setS, setL }: HSLWheelPickerProps) {
  const handleWheelChange = (hue: number, saturation: number) => {
    setH(hue);
    setS(saturation);
  };

  return (
    <div className="flex flex-col gap-4">
      <ColorWheel h={h} s={s} onColorChange={handleWheelChange} />
      <div className="flex flex-col gap-1">
        <div className="text-[10px] text-muted-foreground uppercase font-bold flex justify-between">
          <span>Lightness</span>
          <span>{l}%</span>
        </div>
        <Slider.Root
          value={l}
          onValueChange={(v) => setL(v as number)}
          min={0}
          max={100}
          className="relative flex items-center h-5 w-full"
        >
          <Slider.Track className="bg-muted h-1.5 w-full rounded-full relative">
            <Slider.Indicator className="absolute h-full bg-primary rounded-full" />
          </Slider.Track>
          <Slider.Thumb className="size-4 bg-white border-2 border-primary rounded-full shadow-sm hover:scale-110 transition-transform cursor-pointer" />
        </Slider.Root>
      </div>
    </div>
  );
}
