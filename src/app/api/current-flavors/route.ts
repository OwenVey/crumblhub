import { conflictUpdateAllExcept, getUtcDate } from '@/lib/utils';
import { db } from '@/server/db';
import { cookiesTable, weeklyCookiesTable, weeksTable } from '@/server/db/schema';
import { startOfWeek } from 'date-fns';
import { revalidatePath } from 'next/cache';
import { getCookiesByCategory } from '../requests';

export const dynamic = 'force-dynamic';

export async function GET() {
  console.log('Fetching this weeks flavors...');

  const thisWeeksFlavors = await getCookiesByCategory('this_week');
  await db
    .insert(cookiesTable)
    .values(thisWeeksFlavors)
    .onConflictDoUpdate({
      target: cookiesTable.id,
      set: conflictUpdateAllExcept(cookiesTable),
    });

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
    await db.insert(weeklyCookiesTable).values(weekCookies);
  }

  revalidatePath('/');
  revalidatePath('/weeks');

  return Response.json(thisWeeksFlavors);
}
