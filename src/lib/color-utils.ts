import { colord } from "colord";

export function hslToHex(h: number, s: number, l: number): string {
  return colord({ h, s, l }).toHex();
}

export function hexToHsl(hex: string) {
  return colord(hex).toHsl();
}
