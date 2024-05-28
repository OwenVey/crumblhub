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

export function formatNumber(num: number, digits = 0) {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ];
  const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find((item) => num >= item.value);
  return item ? (num / item.value).toFixed(digits).replace(regexp, '').concat(item.symbol) : '0';
}
