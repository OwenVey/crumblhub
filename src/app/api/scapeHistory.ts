import { cleanCookieName, getUtcDate } from '@/lib/utils';
import { parse } from 'date-fns';
import { parseHTML } from 'linkedom';

export async function scrapeHistory() {
  const response = await fetch('https://crumblcookieflavors.com/all-weeks', {
    headers: {
      'Cache-Control': 'no-cache',
    },
  });

  const { document } = parseHTML(await response.text());
  const gridDiv = document.querySelector('.jet-listing-grid__items')!;
  const weekDivs = gridDiv.querySelectorAll(
    '.elementor-column.elementor-col-100.elementor-inner-column.elementor-element',
  );

  return [...weekDivs].reverse().map((weekDiv) => {
    const weekString = weekDiv.querySelector('h2')!.textContent!.split('of ')[1]!;
    const start = extractWeekStartDate(weekString);

    // console.log(`${weekString} --> ${start}`);

    const cookieDivs = weekDiv.querySelectorAll('.jet-listing-dynamic-repeater__item');

    const cookies = [...cookieDivs].map((cookieDiv) => {
      const nameSpanTextContent = cookieDiv.querySelector('span')!.textContent!;
      const isNew = nameSpanTextContent.endsWith('New');
      const name = cleanCookieName(
        nameSpanTextContent
          .toUpperCase()
          .replace(/^[^a-zA-Z]+/, '') // remove all characters before the first letter in the string
          .replace('NEW', '')
          .replace('BISCOFF', 'LOTUS BISCOFF'),
      );

      return { name, isNew };
    });

    return { start, cookies };
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
  const date = parse(`${month} ${day} ${year} +00`, 'MMMM d y x', new Date());
  return getUtcDate(date);
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
