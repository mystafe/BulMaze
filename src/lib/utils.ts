import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function normalize(str: string): string {
  return str
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .trim()
    .toLowerCase();
}

export function diacriticInsensitiveEquals(a: string, b: string): boolean {
  return normalize(a) === normalize(b);
}
