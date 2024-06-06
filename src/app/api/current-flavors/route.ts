import { getUtcDate } from '@/lib/utils';
import { db } from '@/server/db';
import { cookiesTable, weekCookiesTable, weeksTable } from '@/server/db/schema';
import { startOfWeek } from 'date-fns';
import { revalidatePath } from 'next/cache';
import { fetchCookiesByCategory } from '../requests';

export const dynamic = 'force-dynamic';

export async function GET() {
  console.log('Fetching this weeks flavors...');

  const thisWeeksFlavors = await fetchCookiesByCategory('this_week');
  await db.insert(cookiesTable).values(thisWeeksFlavors).onConflictDoNothing();

  const weekStartDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  const start = getUtcDate(weekStartDate);
  const week = (await db.insert(weeksTable).values({ start }).onConflictDoNothing().returning()).pop();

  if (week) {
    const weekCookies = thisWeeksFlavors.map((cookie) => ({
      weekId: week.id,
      cookieId: cookie.id,
      name: cookie.name,
      isNew: cookie.newRecipeCallout,
    }));
    await db.insert(weekCookiesTable).values(weekCookies);
  }

  revalidatePath('/');
  revalidatePath('/weeks');

  return Response.json(thisWeeksFlavors);
}
