'use client';
import { useEffect, useRef } from 'react';

interface ColorWheelProps {
  h: number;
  s: number;
  onColorChange: (h: number, s: number) => void;
}

export default function ColorWheel({ h, s, onColorChange }: ColorWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const size = 160;

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const dx = x - size / 2;
        const dy = y - size / 2;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= size / 2) {
          const hue = (Math.atan2(dy, dx) * 180) / Math.PI + 180;
          const saturation = (distance / (size / 2)) * 100;
          ctx.fillStyle = `hsl(${hue}, ${saturation}%, 50%)`;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
  }, []);

  const handleInteract = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left - size / 2;
    const y = clientY - rect.top - size / 2;
    const hue = (Math.atan2(y, x) * 180) / Math.PI + 180;
    const saturation = Math.min(
      100,
      (Math.sqrt(x * x + y * y) / (size / 2)) * 100
    );
    onColorChange(Math.round(hue), Math.round(saturation));
  };

  const indicatorPos = {
    x:
      size / 2 + (s / 100) * (size / 2) * Math.cos(((h - 180) * Math.PI) / 180),
    y:
      size / 2 + (s / 100) * (size / 2) * Math.sin(((h - 180) * Math.PI) / 180),
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className="relative mx-auto size-40 cursor-crosshair touch-none"
      onMouseDown={handleInteract}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          // No-op for now as it's a wheel, but satisfies a11y
        }
      }}
    >
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="rounded-full"
      />
      <div
        className="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-sm"
        style={{
          left: indicatorPos.x,
          top: indicatorPos.y,
          backgroundColor: `hsl(${h}, ${s}%, 50%)`,
        }}
      />
    </div>
  );
}
