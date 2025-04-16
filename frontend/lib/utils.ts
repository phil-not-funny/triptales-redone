import { clsx, type ClassValue } from "clsx";
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

export function beautifyDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}
