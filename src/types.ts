import { type getAllCookiesByCategories } from '@/app/api/requests';
import { type CATEGORIES } from '@/app/api/requests/getAllCookiesByCategories';
import { type InferSelectModel } from 'drizzle-orm';
import { type cookiesTable, type storesTable, type weeklyCookiesTable, type weeksTable } from './server/db/schema';

export type Cookie = Awaited<ReturnType<typeof getAllCookiesByCategories>>[number];

export type Week = InferSelectModel<typeof weeksTable>;
export type WeekCookie = InferSelectModel<typeof weeklyCookiesTable>;
export type Store = InferSelectModel<typeof storesTable>;

export type SelectCookie = InferSelectModel<typeof cookiesTable> & {
  weekCookies: (WeekCookie & { week: Week })[];
};

export type CookieCategory = (typeof CATEGORIES)[number];
