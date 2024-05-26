import { db } from '@/server/db';
import { weekCookiesTable, weeksTable } from '@/server/db/schema';
import { addDays, parse } from 'date-fns';
import { type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { parseHTML } from 'linkedom';

interface WeekData {
  start: Date;
  end: Date;
  flavors: {
    id: number | null;
    name: string;
    isNew: boolean;
  }[];
}

type Week = InferSelectModel<typeof weeksTable>;
type NewWeek = InferInsertModel<typeof weeksTable>;
type WeekFlavor = InferSelectModel<typeof weekCookiesTable>;
type NewWeekFlavor = InferInsertModel<typeof weekCookiesTable>;

export async function GET() {
  const response = await fetch('https://crumblcookieflavors.com/all-weeks');

  const { document } = parseHTML(await response.text());
  const gridDiv = document.querySelector('.jet-listing-grid__items')!;
  const weekDivs = gridDiv.querySelectorAll(
    '.elementor-column.elementor-col-100.elementor-inner-column.elementor-element',
  );

  const allFlavors = await db.query.cookiesTable.findMany();

  const weekData = [...weekDivs].map((weekDiv) => {
    const weekString = weekDiv.querySelector('h2')!.textContent!.split('of ')[1]!;
    const start = extractDate(weekString);
    const end = addDays(start, 5);

    const flavorDivs = weekDiv.querySelectorAll('.jet-listing-dynamic-repeater__item');

    const flavors = [...flavorDivs].map((flavorDiv) => {
      const nameSpanTextContent = flavorDiv.querySelector('span')!.textContent!;
      const isNew = nameSpanTextContent.endsWith('New');
      const name = nameSpanTextContent
        .replace(/^[^a-zA-Z]+/, '') // remove all characters before the first letter in the string
        .replace('New', '') // remove "New" at end of string
        .trim() // remove extra spacing
        .replace('’', `'`); // normalize quote character

      const cookie = allFlavors.find((f) => f.name.toUpperCase().includes(name));
      const id = cookie?.id ?? null;

      return { id, name: cookie?.name ?? name, isNew };
    });

    return { start, end, flavors };
  });

  await insertWeekData(weekData);

  return Response.json(weekData);
}

async function insertWeekData(weekData: WeekData[]) {
  const weekValues: NewWeek[] = weekData.map((week) => ({
    start: new Date(week.start),
    end: new Date(week.end),
  }));

  // Insert weeks, ignoring conflicts
  await db.insert(weeksTable).values(weekValues).onConflictDoNothing();

  // Fetch all weeks to get their IDs
  const allWeeks = await db.select().from(weeksTable);

  // Create a mapping from week data to week IDs
  const weekIdMap = new Map<string, number>();
  allWeeks.forEach((week) => {
    const key = `${week.start.toISOString()}_${week.end.toISOString()}`;
    weekIdMap.set(key, week.id);
  });

  // Collect all week flavors for batch insert
  const weekFlavorValues: NewWeekFlavor[] = [];
  for (const week of weekData) {
    const key = `${new Date(week.start).toISOString()}_${new Date(week.end).toISOString()}`;
    const weekId = weekIdMap.get(key);
    if (weekId !== undefined) {
      for (const flavor of week.flavors) {
        weekFlavorValues.push({
          weekId,
          cookieId: flavor.id,
          name: flavor.name,
          isNew: flavor.isNew,
        });
      }
    }
  }

  // Insert week flavors, ignoring conflicts
  await db.insert(weekCookiesTable).values(weekFlavorValues).onConflictDoNothing();
}

function extractDate(weekString: string) {
  const pieces = weekString.split(' ');
  let month = pieces.at(0)!;
  if (MONTH_MAP.has(month)) month = MONTH_MAP.get(month)!;
  const year = getFirstYear(weekString) ?? '2023';
  if (!year) console.error('Failed to get year for: ', weekString);

  const firstSpaceIndex = weekString.indexOf(' ');
  const day = weekString.substring(firstSpaceIndex + 1, firstSpaceIndex + 3).replace(/\D/g, ''); // remove any non-digit characters

  return parse(`${month} ${day} ${year}`, 'MMMM d y', new Date());
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
