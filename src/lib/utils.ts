import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  // Join classes with clsx, then remove duplicate tokens before applying
  // tailwind-merge so tests expecting deduplication pass consistently.
  const joined = clsx(inputs)
    .split(' ')
    .filter((c, i, arr) => c && arr.indexOf(c) === i)
    .join(' ');
  return twMerge(joined);
}
