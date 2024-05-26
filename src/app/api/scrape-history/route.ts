import { db } from '@/server/db';
import { weekCookiesTable, weeksTable } from '@/server/db/schema';
import { addDays, parse } from 'date-fns';
import { parseHTML } from 'linkedom';

export async function GET() {
  const parsedWeeklyHistory = await parseWeeklyHistory();

  const weekValues = parsedWeeklyHistory.map(({ start, end }) => ({
    start: start.toISOString(),
    end: end.toISOString(),
  }));

  // Insert weeks, ignoring conflicts
  await db.insert(weeksTable).values(weekValues).onConflictDoNothing();

  // Fetch all weeks to get their IDs
  const allWeeks = await db.select().from(weeksTable);

  // Create a mapping from week data to week IDs
  const weekIdMap = new Map<string, number>();
  allWeeks.forEach((week) => {
    const key = `${week.start}_${week.end}`;
    weekIdMap.set(key, week.id);
  });

  const weekCookieValues = parsedWeeklyHistory.flatMap((week) => {
    const key = `${week.start.toISOString()}_${week.end.toISOString()}`;
    const weekId = weekIdMap.get(key);
    if (!weekId) return [];

    return week.cookies.map(({ id, name, isNew }) => ({
      weekId,
      cookieId: id,
      name,
      isNew,
    }));
  });

  // Insert week cookies, ignoring conflicts
  await db.insert(weekCookiesTable).values(weekCookieValues).onConflictDoNothing();

  return Response.json(parsedWeeklyHistory);
}

async function parseWeeklyHistory() {
  const response = await fetch('https://crumblcookieflavors.com/all-weeks');

  const { document } = parseHTML(await response.text());
  const gridDiv = document.querySelector('.jet-listing-grid__items')!;
  const weekDivs = gridDiv.querySelectorAll(
    '.elementor-column.elementor-col-100.elementor-inner-column.elementor-element',
  );

  const allCookies = await db.query.cookiesTable.findMany();

  return [...weekDivs].map((weekDiv) => {
    const weekString = weekDiv.querySelector('h2')!.textContent!.split('of ')[1]!;
    const start = extractWeekStartDate(weekString);
    const end = addDays(start, 5);

    const cookieDivs = weekDiv.querySelectorAll('.jet-listing-dynamic-repeater__item');

    const cookies = [...cookieDivs].map((cookieDiv) => {
      const nameSpanTextContent = cookieDiv.querySelector('span')!.textContent!;
      const isNew = nameSpanTextContent.endsWith('New');
      const name = nameSpanTextContent
        .replace(/^[^a-zA-Z]+/, '') // remove all characters before the first letter in the string
        .replace('New', '') // remove "New" at end of string
        .trim() // remove extra spacing
        .replace('’', `'`); // normalize quote character

      const cookie = allCookies.find((f) => f.name.toUpperCase().includes(name));
      const id = cookie?.id ?? null;

      return { id, name: cookie?.name ?? name, isNew };
    });

    return { start, end, cookies };
  });
}

function extractWeekStartDate(weekString: string) {
  const pieces = weekString.split(' ');
  let month = pieces.at(0)!;
  if (MONTH_MAP.has(month)) month = MONTH_MAP.get(month)!;
  const year = getFirstYear(weekString) ?? '2023';
  if (!year) console.error('Failed to get year for: ', weekString);

  const firstSpaceIndex = weekString.indexOf(' ');
  const day = weekString.substring(firstSpaceIndex + 1, firstSpaceIndex + 3).replace(/\D/g, ''); // remove any non-digit characters

  return parse(`${month} ${day} ${year} +00`, 'MMMM d y x', new Date());
}

function getFirstYear(weekString: string) {
  const match = weekString.match(/\b\d{4}\b/);
  return match ? match[0] : null;
}

const MONTH_MAP = new Map<string, string>([
  ['Jan', 'January'],
  ['Janruary', 'January'],
  ['Feb', 'February'],
  ['Mar', 'March'],
  ['Apr', 'April'],
  ['Jun', 'June'],
  ['Jul', 'July'],
  ['Aug', 'August'],
  ['Sep', 'September'],
  ['Sept', 'September'],
  ['Oct', 'October'],
  ['Nov', 'November'],
  ['Dec', 'December'],
]);
