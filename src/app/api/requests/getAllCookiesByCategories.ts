import { uniqueItemsByKey } from '@/lib/utils';
import { getCookiesByCategory } from './getCookiesByCategory';

export const CATEGORIES = [
  'this_week',
  'last_week',
  'popular',
  'graveyard',
  'peanut_butter',
  'classics',
  'chilled',
] as const;

export async function getAllCookiesByCategories() {
  const cookies = (await Promise.all(CATEGORIES.map(getCookiesByCategory))).flat();
  const uniqueCookies = uniqueItemsByKey(cookies, 'id');

  return uniqueCookies;
}
