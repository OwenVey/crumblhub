import { DATE_FORMAT } from '@/lib/constants';
import { clsx, type ClassValue } from 'clsx';
import { format } from 'date-fns';
import { getTableColumns, sql, type SQL } from 'drizzle-orm';
import { type PgTable } from 'drizzle-orm/pg-core';
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

export function getUtcDate(date: Date) {
  const utcDate = new Date(date.valueOf() + date.getTimezoneOffset() * 60 * 1000);
  return format(utcDate, DATE_FORMAT);
}

export function uniqueItemsByKey<T, K extends keyof T>(array: T[], key: K) {
  return [...new Map(array.map((item) => [item[key], item] as [T[K], T])).values()];
}

export function conflictUpdateAllExcept<T extends PgTable, E extends (keyof T['$inferInsert'])[] = []>(
  table: T,
  except?: E,
) {
  const columns = getTableColumns(table);
  const exceptColumns = (except ?? []) as (keyof T['$inferInsert'])[];

  const updateColumns = Object.entries(columns).filter(
    ([col]) => ![...exceptColumns, 'id', 'createdAt'].includes(col as keyof T['$inferInsert']),
  );

  return updateColumns.reduce(
    (acc, [colName, table]) => ({
      ...acc,
      [colName]: sql.raw(`excluded.${table.name}`),
    }),
    {},
  ) as Omit<Record<keyof T['$inferInsert'], SQL>, E[number]>;
}
