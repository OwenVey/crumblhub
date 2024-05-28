import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function range(n: number) {
  return Array.from({ length: n }, (_, i) => i);
}

export function cleanCookieName(name: string) {
  return name
    .replaceAll('’', `'`)
    .replaceAll('  ', ' ')
    .replaceAll('®', '')
    .replaceAll('Ⓡ', '')
    .replaceAll('™️', '')
    .replaceAll('™', '')
    .replace(/\(NEW\)/gi, '')
    .replace(/\(LTO\)/gi, '')
    .replace(/featuring/gi, 'ft.')
    .trim();
}
