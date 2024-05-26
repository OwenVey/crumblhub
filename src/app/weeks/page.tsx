import { Badge } from '@/components/Badge';
import { DATE_FORMAT } from '@/lib/constants';
import { db } from '@/server/db';
import { weekCookiesTable, weeksTable } from '@/server/db/schema';
import { format, parse } from 'date-fns';
import { asc, desc } from 'drizzle-orm';
import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Weeks',
};

export default async function WeeksPage() {
  const weeks = await db.query.weeksTable.findMany({
    orderBy: [desc(weeksTable.start)],
    with: { cookies: { orderBy: [asc(weekCookiesTable.id)], with: { cookie: true } } },
  });

  return (
    <>
      <div className="mb-2 text-gray-600 text-sm text-right">Last updated {new Date().toLocaleString()}</div>
      <ul className="flex flex-col gap-4">
        {weeks.map((week) => {
          const startDate = parse(week.start, DATE_FORMAT, new Date());
          const endDate = parse(week.end, DATE_FORMAT, new Date());
          return (
            <li key={week.id} className="rounded-lg bg-white p-4">
              <div className="text-xl font-semibold">
                <time dateTime={startDate.toISOString()}>{format(startDate, 'MMM do, yyyy')}</time>
                {' – '}
                <time dateTime={endDate.toISOString()}>{format(endDate, 'MMM do, yyyy')}</time>
              </div>

              <div
                className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-[repeat(var(--num-cookies),minmax(0,1fr))]"
                style={
                  {
                    '--num-cookies': week.cookies.length,
                  } as React.CSSProperties
                }
              >
                {week.cookies.map(({ cookie, isNew, name }) => (
                  <a key={name} href={`/#${name}`} className="group grid place-items-center">
                    <div className="relative transition-transform group-hover:scale-110">
                      {isNew && <Badge className="absolute right-0 top-0 z-10">NEW</Badge>}
                      {cookie ? (
                        <Image className="size-28" src={cookie.image} alt={cookie.name} width={150} height={150} />
                      ) : (
                        <div className="grid size-28 place-items-center rounded-full bg-gray-200">
                          <svg
                            className="size-12 text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              d="M14.6 8.075q0-1.075-.712-1.725T12 5.7q-.725 0-1.312.313t-1.013.912q-.4.575-1.088.663T7.4 7.225q-.35-.325-.387-.8t.237-.9q.8-1.2 2.038-1.862T12 3q2.425 0 3.938 1.375t1.512 3.6q0 1.125-.475 2.025t-1.75 2.125q-.925.875-1.25 1.363T13.55 14.6q-.1.6-.513 1t-.987.4t-.987-.387t-.413-.963q0-.975.425-1.787T12.5 11.15q1.275-1.125 1.688-1.737t.412-1.338M12 22q-.825 0-1.412-.587T10 20t.588-1.412T12 18t1.413.588T14 20t-.587 1.413T12 22"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="mt-1 text-balance text-center font-medium capitalize">
                      {cookie ? cookie.name : name.toLowerCase()}
                    </div>
                  </a>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
