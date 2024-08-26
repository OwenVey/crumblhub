import {
  getAllCookiesByCategories,
  getAllStores,
  getCookieById,
  getCookieHistory,
  getCookiesByCategory,
  getStoresByLatLong,
  revalidatePages,
  searchCookie,
  sendDiscordNotification,
} from '@/app/api/requests';
import { log } from '@/lib/logger';
import { cleanCookieName, conflictUpdateAllExcept, getUtcDate, uniqueItemsByKey } from '@/lib/utils';
import { db } from '@/server/db';
import {
  cookiesTable,
  storesTable,
  testCookiesTable,
  testCookieStoresTable,
  weeklyCookiesTable,
  weeksTable,
} from '@/server/db/schema';
import { type Cookie, type Store, type Week } from '@/types';
import { startOfWeek } from 'date-fns';
import { type NextRequest } from 'next/server';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const startTime = performance.now();
  void sendDiscordNotification(`Starting data update...`);
  const shouldSaveHistory = Boolean(request.nextUrl.searchParams.get('saveHistory'));

  log('inserting current week');
  const currentWeek = await insertCurrentWeek();

  log('save current week cookies');
  await saveCurrentWeekCookies(currentWeek);

  log('fetching category cookies and history');
  const [categoryCookies, history] = await Promise.all([getAllCookiesByCategories(), getCookieHistory()]);

  const scrapedNames = [...new Set(history.flatMap(({ cookies }) => cookies.map(({ name }) => name)))];

  log('searching all cookies from history');
  const searchCookies = (await Promise.allSettled(scrapedNames.map(searchCookie)))
    .filter((promise) => promise.status === 'fulfilled')
    .map(({ value }) => value)
    .flat();
  log({ categoryCookies: categoryCookies.length, searchCookies: uniqueItemsByKey(searchCookies, 'id').length });
  const allCookies = uniqueItemsByKey([...categoryCookies, ...searchCookies], 'id');

  log('inserting cookies into database');
  await db
    .insert(cookiesTable)
    .values(allCookies)
    .onConflictDoUpdate({
      target: cookiesTable.id,
      set: conflictUpdateAllExcept(cookiesTable),
    });

  if (shouldSaveHistory) {
    log('saving history');
    await saveHistory(allCookies, history);
  }

  log('saving stores');
  const savedStores = await saveStores();

  log('saving weekly test cookies');
  await saveTestCookies(savedStores);

  const endTime = performance.now();
  const timeInSeconds = ((endTime - startTime) / 1000).toFixed(2);

  void sendDiscordNotification(`Completed in ${timeInSeconds} seconds`);

  await revalidatePages(request.nextUrl.origin);

  return Response.json({ success: true });
}

async function insertCurrentWeek() {
  const weekStartDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  const start = getUtcDate(weekStartDate);
  return (
    await db
      .insert(weeksTable)
      .values({ start })
      .onConflictDoUpdate({ target: weeksTable.start, set: conflictUpdateAllExcept(weeksTable) })
      .returning()
  ).pop()!;
}

async function saveCurrentWeekCookies(week: Week) {
  const currentWeekCookies = await getCookiesByCategory('this_week');
  await db
    .insert(cookiesTable)
    .values(currentWeekCookies)
    .onConflictDoUpdate({
      target: cookiesTable.id,
      set: conflictUpdateAllExcept(cookiesTable),
    });

  const weeklyCookies = currentWeekCookies.map((cookie) => ({
    weekId: week.id,
    cookieId: cookie.id,
    name: cookie.name,
    isNew: cookie.newRecipeCallout,
  }));
  await db.insert(weeklyCookiesTable).values(weeklyCookies).onConflictDoNothing();
}

async function saveHistory(allCookies: Cookie[], history: Awaited<ReturnType<typeof getCookieHistory>>) {
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

  await db.insert(weeklyCookiesTable).values(weekCookieValues).onConflictDoNothing();
}

async function saveStores() {
  const stores = await getAllStores();
  return await db
    .insert(storesTable)
    .values(stores)
    .onConflictDoUpdate({
      target: storesTable.id,
      set: conflictUpdateAllExcept(storesTable),
    })
    .returning();
}

async function saveTestCookies(stores: Store[]) {
  const storesWithTestCookies = (
    await Promise.allSettled(stores.map(({ latitude, longitude }) => getStoresByLatLong(latitude, longitude)))
  )
    .filter((promise) => promise.status === 'fulfilled')
    .flatMap(({ value }) => value);

  const testCookieIds = [...new Set(storesWithTestCookies.map((store) => store.testCookieIds).flat())];
  const testCookies = await Promise.all(testCookieIds.map((cookieId) => getCookieById(cookieId)));

  log('deleting test cookies tables');
  // eslint-disable-next-line drizzle/enforce-delete-with-where
  await db.delete(testCookiesTable);
  // eslint-disable-next-line drizzle/enforce-delete-with-where
  await db.delete(testCookieStoresTable);

  // insert the weekly test cookies into the "test_cookies" table
  log('INSERT 1');
  await db
    .insert(testCookiesTable)
    .values(testCookies)
    .onConflictDoUpdate({
      target: testCookiesTable.id,
      set: conflictUpdateAllExcept(testCookiesTable),
    });

  const testCookieStoreMappings = testCookies.flatMap((cookie) =>
    storesWithTestCookies
      .filter(({ testCookieIds }) => testCookieIds.includes(cookie.id))
      .map((store) => ({
        storeId: store.id,
        cookieId: cookie.id,
      })),
  );

  log('INSERT 2');
  await db.insert(testCookieStoresTable).values(testCookieStoreMappings).onConflictDoNothing();
}
