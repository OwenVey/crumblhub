// import flavors from '@/data/flavors.json';
import { Badge } from '@/components/Badge';
import { db } from '@/server/db';
import { cookiesTable } from '@/server/db/schema';
import { pluralize } from '@/utils';
import { format, isSameWeek } from 'date-fns';
import { asc } from 'drizzle-orm';
import Image from 'next/image';

export default async function Home() {
  const cookies = await db.query.cookiesTable.findMany({
    orderBy: [asc(cookiesTable.name)],
    with: { weekCookies: { with: { week: true } } },
  });
  return (
    <ul className="mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cookies.map((cookie) => {
        const firstWeekStart = cookie.weekCookies[0]?.week?.start;

        const isCurrent = firstWeekStart ? isSameWeek(firstWeekStart, new Date()) : false;
        return (
          <li
            key={cookie.name}
            id={cookie.name}
            className="group relative flex scroll-m-20 flex-col items-start rounded-lg bg-white"
          >
            {isCurrent && <Badge className="absolute -right-2 -top-2 z-10">CURRENT</Badge>}
            <div className="flex-1 p-4">
              <div className="flex h-full gap-4">
                <a
                  href={cookie.image}
                  target="_blank"
                  title="View original image"
                  className="size-28 shrink-0 transition-transform group-hover:scale-110"
                >
                  <Image src={cookie.image} alt={cookie.name} width={150} height={150} />
                </a>

                <div className="flex flex-col">
                  <div className="flex-1">
                    <div className="line-clamp-2 text-xl font-semibold">{cookie.name}</div>
                    <p className="mt-1 line-clamp-3 h-16 text-sm text-gray-700">{cookie.description}</p>
                  </div>

                  <dl className="mt-2 text-sm">
                    <div className="grid grid-cols-2 py-1">
                      <dt className="font-semibold">Last seen</dt>
                      <dd className="">{firstWeekStart ? format(firstWeekStart, 'MMM do, yyyy') : 'Never'}</dd>
                    </div>
                    <div className="grid grid-cols-2 py-1">
                      <dt className="font-semibold">Occurrences</dt>
                      <dd className="">{pluralize(cookie.weekCookies.length, 'time', 'times')}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            {cookie.nutritionLabelImage && (
              <details className="mt-auto w-full rounded-b-xl border-t p-4 hover:cursor-pointer hover:bg-gray-50">
                <summary className="-m-4 p-4 font-semibold">View nutrition info</summary>
                <Image
                  className="z-10 mt-2 origin-top-right"
                  src={cookie.nutritionLabelImage}
                  alt={`Nutrition label for ${cookie.name}`}
                  width={400}
                  height={733}
                />
              </details>
            )}
          </li>
        );
      })}
    </ul>
  );
}
