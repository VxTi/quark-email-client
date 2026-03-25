import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getContrastColor(hexColor: string) {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#000000" : "#ffffff";
}

export async function request<T>(
  url: string,
  config: RequestInit & { decoder: z.ZodSchema<T> },
): Promise<T> {
  const res = await fetch(url, config);
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }

  if (res.status === 204) {
    return config.decoder.parse(null);
  }

  const data: unknown = await res.json();

  return config.decoder.parse(data);
}
