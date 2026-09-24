import { clsx, type ClassValue } from "clsx";
import { Area } from "react-easy-crop";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToDate(dateString: string): Date {
  const [year, month, day] = dateString.split(".").map(Number);

  return new Date(year, month - 1, day);
}

export function convertToDateOnly(dateString: string): Date {
  const [year, month, day] = dateString.split(".").map(Number);
  return new Date(year, month - 1, day);
}

export function formatDateString(date: string): string {
  return convertToDate(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateOnlyString(date: string): string {
  return convertToDateOnly(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Formats a date as `YYYY-MM-DD` using its local calendar day. `toISOString()`
 * must not be used for this: it converts to UTC and shifts the day for
 * timezones ahead of UTC.
 */
export function toDateOnlyString(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * Parses a `YYYY-MM-DD` string into a date at local midnight, the counterpart
 * of {@link toDateOnlyString}.
 */
export function parseDateOnlyString(date: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function beautifyDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
): Promise<Blob> {
  const image = new Image();
  image.src = imageSrc;

  await new Promise((resolve) => {
    image.onload = resolve;
  });

  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("No 2D context");

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
    }, "image/jpeg");
  });
}

/**
 * Type guard that checks whether a value is an object containing all given keys.
 * Used as the building block for runtime validation of API responses.
 *
 * @param value - The value to inspect, typically parsed JSON of unknown shape.
 * @param keys - Property names that have to be present.
 */
export const hasKeys = <K extends string>(
  value: unknown,
  ...keys: K[]
): value is Record<K, unknown> =>
  typeof value === "object" && value !== null && keys.every((k) => k in value);

/** Persists the chosen UI language for one year; the server reads it per request. */
export function setLocaleCookie(locale: string): void {
  document.cookie = `locale=${locale}; path=/; max-age=31536000; SameSite=Lax`;
}
