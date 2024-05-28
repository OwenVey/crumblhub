import { Badge } from '@/components/Badge';
import { StarProgress } from '@/components/StarProgress';
import { pluralize } from '@/lib/utils';
import { db } from '@/server/db';
import { cookiesTable } from '@/server/db/schema';
import { format, isSameWeek } from 'date-fns';
import { asc } from 'drizzle-orm';
import Image from 'next/image';
import { Fragment } from 'react';

export default async function Home() {
  const cookies = await db.query.cookiesTable.findMany({
    orderBy: [asc(cookiesTable.name)],
    with: { weekCookies: { with: { week: true } } },
  });
  return (
    <ul className="mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cookies.map((cookie) => {
        const firstWeekStart = cookie.weekCookies[0]?.week?.start;
        const releaseDate = cookie.weekCookies.at(-1)?.week.start;

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
                  href={cookie.aerialImage}
                  target="_blank"
                  title="View original image"
                  className="size-28 shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-12"
                >
                  <Image src={cookie.aerialImage} alt={cookie.name} width={150} height={150} />
                </a>

                <div className="flex flex-col gap-2">
                  <div className="flex-1">
                    <div className="line-clamp-2 text-xl font-semibold">{cookie.name}</div>
                    <p className="mt-1 line-clamp-3 h-16 text-sm text-gray-700">{cookie.description}</p>
                  </div>

                  <dl className="text-sm grid grid-cols-2 gap-y-1">
                    {[
                      { label: 'Last seen', value: firstWeekStart ? format(firstWeekStart, 'MMM do, yyyy') : 'Never' },
                      { label: 'Occurrences', value: pluralize(cookie.weekCookies.length, 'time', 'times') },
                      { label: 'Release date', value: releaseDate ? format(releaseDate, 'MMM do, yyyy') : 'N/A' },
                      { label: 'Calories', value: cookie.calories },
                      { label: 'Served', value: cookie.servingMethod ?? 'N/A' },
                    ].map(({ label, value }) => (
                      <Fragment key={label}>
                        <dt className="font-semibold">{label}</dt>
                        <dd className="">{value}</dd>
                      </Fragment>
                    ))}
                  </dl>

                  <StarProgress averageRating={cookie.averageRating} totalReviews={cookie.totalReviews} />
                </div>
              </div>
            </div>

            {cookie.nutritionLabelImage ? (
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
            ) : (
              <div className="mt-auto w-full rounded-b-xl border-t p-4 font-semibold">No nutrition info</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
