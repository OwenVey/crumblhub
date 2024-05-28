import { type getAppCookies } from '@/app/api/requests';
import { type InferSelectModel } from 'drizzle-orm';
import { type cookiesTable, type weekCookiesTable, type weeksTable } from './server/db/schema';

export type Cookie = Awaited<ReturnType<typeof getAppCookies>>[number];
// export type SelectCookie = InferSelectModel<typeof cookiesTable>;
export type Week = InferSelectModel<typeof weeksTable>;
export type WeekCookie = InferSelectModel<typeof weekCookiesTable>;
// export interface SelectCookieWithRelations extends SelectCookie {
//   // week: SelectWeek;
//   weekCookies: (SelectWeekCookies & SelectWeek)[];
// }

export type SelectCookie = InferSelectModel<typeof cookiesTable> & {
  // role: Role
  weekCookies: (WeekCookie & { week: Week })[];
};
