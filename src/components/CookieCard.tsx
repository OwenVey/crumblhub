import { StarProgress } from '@/components/StarProgress';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn, pluralize } from '@/lib/utils';
import { type SelectCookie } from '@/types';
import { format, isSameWeek } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';

interface CookieCardProps extends React.HTMLAttributes<HTMLLIElement> {
  cookie: SelectCookie;
}

export function CookieCard({ cookie, className, ...rest }: CookieCardProps) {
  const [cookieInHash, setCookieInHash] = useState(false);

  const lastSeen = cookie.weekCookies.at(-1)?.week?.start;
  const releaseDate = cookie.weekCookies.at(0)?.week.start;

  const isCurrentCookie = lastSeen ? isSameWeek(lastSeen, new Date()) : false;

  useEffect(() => {
    const decodedHash = decodeURIComponent(window.location.hash.substring(1));
    if (decodedHash === cookie.name) setCookieInHash(true);
  }, [cookie]);

  return (
    <Card
      asChild
      id={cookie.name}
      className={cn(
        className,
        'group relative flex scroll-m-20 flex-col items-start p-0',
        cookieInHash && 'border-pink ring-pink ring',
      )}
    >
      <li {...rest}>
        {isCurrentCookie && <Badge className="absolute -top-2 -right-2 z-10">CURRENT</Badge>}
        <div className="flex-1 p-4">
          <div className="flex h-full gap-4">
            <Link
              href={cookie.aerialImage}
              target="_blank"
              title="View original image"
              className="size-28 shrink-0 rounded-full outline-none transition-transform group-hover:scale-110 group-hover:rotate-12 focus-within:ring-2"
            >
              <Image src={cookie.aerialImage} alt={cookie.name} width={150} height={150} />
            </Link>

            <div className="flex flex-col gap-3">
              <div className="flex-1">
                <div className="text-gray-12 text-lg font-semibold">{cookie.name}</div>
                <p className="text-gray-11 line-clamp-3 text-sm">{cookie.description}</p>
              </div>

              <dl className="grid grid-cols-2 gap-y-1 text-sm">
                {[
                  { label: 'Last seen', value: lastSeen ? format(lastSeen, 'MMM do, yyyy') : 'Never' },
                  { label: 'Occurrences', value: pluralize(cookie.weekCookies.length, 'time', 'times') },
                  { label: 'Release date', value: releaseDate ? format(releaseDate, 'MMM do, yyyy') : 'N/A' },
                  { label: 'Calories', value: cookie.calories === 0 ? '-' : cookie.calories },
                  { label: 'Served', value: cookie.servingMethod ?? 'N/A' },
                ].map(({ label, value }) => (
                  <Fragment key={label}>
                    <dt className="text-gray-11 font-medium">{label}</dt>
                    <dd className="text-gray-12">{value}</dd>
                  </Fragment>
                ))}
              </dl>

              <StarProgress averageRating={+cookie.averageRating} totalReviews={cookie.totalReviews} />
            </div>
          </div>
        </div>

        {cookie.nutritionLabelImage ? (
          <details className="border-gray-5 text-gray-12 hover:bg-gray-3 active:bg-gray-4 focus-visible:ring-gray-12 mt-auto w-full rounded-b-xl border-t p-4 hover:cursor-pointer">
            <summary className="-m-4 rounded-b-xl p-4 text-sm font-medium outline-none focus-visible:ring-2">
              View nutrition info
            </summary>
            <Image
              className="z-10 mt-2 origin-top-right"
              src={cookie.nutritionLabelImage}
              alt={`Nutrition label for ${cookie.name}`}
              width={400}
              height={733}
            />
          </details>
        ) : (
          <div className="border-gray-5 text-gray-12 mt-auto w-full rounded-b-xl border-t p-4 text-sm font-medium">
            No nutrition info
          </div>
        )}
      </li>
    </Card>
  );
}
