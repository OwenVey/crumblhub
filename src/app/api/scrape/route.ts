import { getAppCookies, searchCookie } from '@/app/api/requests';
import { scrapeHistory } from '@/app/api/scapeHistory';
import { cleanCookieName } from '@/lib/utils';
import { db } from '@/server/db';
import { cookiesTable, weekCookiesTable, weeksTable } from '@/server/db/schema';
import { type Cookie } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const enabled = false;
  if (!enabled) return;

  const [appCookies, history] = await Promise.all([getAppCookies(), scrapeHistory()]);

  const scrapedNames = [...new Set(history.flatMap(({ cookies }) => cookies.map(({ name }) => name)))];

  const searchCookies = (await Promise.all(scrapedNames.map(searchCookie))).flat();

  const allCookies = Array.from(
    new Map([...appCookies, ...searchCookies].map((cookie) => [cookie.id, cookie])).values(),
  );

  await db.insert(cookiesTable).values(allCookies).onConflictDoNothing();

  await saveHistory(allCookies, history);

  console.table([
    { Description: 'App Cookies', Count: appCookies.length },
    { Description: 'Number of different scraped cookies', Count: scrapedNames.length },
    { Description: 'All Cookies', Count: allCookies.length },
  ]);

  return Response.json(allCookies);
}

async function saveHistory(allCookies: Cookie[], history: Awaited<ReturnType<typeof scrapeHistory>>) {
  const mappedHistory = history.map(({ start, cookies }) => ({
    start,
    cookies: cookies.map(({ name: scrapedName, isNew }) => {
      const cleanScrapedName = cleanCookieName(scrapedName).toUpperCase();

      // first try to find cookie match based on exact name match
      let cookie = allCookies.find(({ name, nameWithoutPartner }) => {
        const cleanCookie = cleanCookieName(name).toUpperCase();
        const nameWithoutPartnerUp = nameWithoutPartner?.toUpperCase();

        return (
          cleanCookie === cleanScrapedName || (nameWithoutPartner ? nameWithoutPartnerUp === cleanScrapedName : false)
        );
      });

      // if no exact cookie match found, try to find a match based on partial name match
      if (!cookie) {
        cookie = allCookies.find(({ name, nameWithoutPartner }) => {
          const cleanCookie = cleanCookieName(name).toUpperCase();
          const nameWithoutPartnerUp = nameWithoutPartner?.toUpperCase();

          return (
            cleanCookie.includes(scrapedName) ||
            scrapedName.includes(cleanCookie) ||
            (nameWithoutPartnerUp && scrapedName.includes(nameWithoutPartnerUp))
          );
        });
      }

      const id = cookie?.id ?? null;

      return { id, name: cookie?.name ?? scrapedName, isNew };
    }),
  }));

  const weekValues = mappedHistory.map(({ start }) => ({ start }));
  await db.insert(weeksTable).values(weekValues).onConflictDoNothing();

  const allWeeks = await db.select().from(weeksTable);
  const weekIdMap = new Map(allWeeks.map((week) => [week.start, week.id]));

  const weekCookieValues = mappedHistory.flatMap((week) => {
    const weekId = weekIdMap.get(week.start);
    if (!weekId) return [];

    return week.cookies.map(({ id, name, isNew }) => ({
      weekId,
      cookieId: id,
      name,
      isNew,
    }));
  });

  await db.insert(weekCookiesTable).values(weekCookieValues).onConflictDoNothing();
}
