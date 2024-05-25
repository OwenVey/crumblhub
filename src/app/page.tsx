import { Badge } from '@/components/Badge';
import flavors from '@/data/flavors.json';
import { pluralize } from '@/utils';
import { differenceInWeeks, isSameWeek } from 'date-fns';
import Image from 'next/image';

export default function Home() {
  return (
    <ul className="mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {flavors.map((flavor) => {
        const weeksSince = flavor.history[0]?.start
          ? differenceInWeeks(new Date(), new Date(flavor.history[0].start))
          : -1;

        const isCurrent = flavor.history[0]?.start ? isSameWeek(new Date(flavor.history[0].start), new Date()) : false;
        return (
          <li
            key={flavor.name}
            id={flavor.name}
            className="group relative flex scroll-m-20 flex-col items-start rounded-lg bg-white"
          >
            {isCurrent && <Badge className="absolute -right-2 -top-2 z-10">CURRENT</Badge>}
            <div className="flex-1 p-4">
              <div className="flex h-full gap-4">
                <a
                  href={flavor.image}
                  target="_blank"
                  title="View original image"
                  className="size-28 shrink-0 transition-transform group-hover:scale-110"
                >
                  <Image src={flavor.image} alt={flavor.name} width={150} height={150} />
                </a>

                <div className="flex flex-col justify-between">
                  <div className="">
                    <div className="line-clamp-2 text-xl font-semibold">{flavor.name}</div>
                    <p className="mt-1 line-clamp-3 h-16 text-sm text-gray-700">{flavor.description}</p>
                  </div>

                  <dl className="mt-2 text-sm">
                    <div className="grid grid-cols-2 py-1">
                      <dt className="font-semibold">Last seen</dt>
                      <dd className="">
                        {weeksSince === -1 ? 'Never' : weeksSince === 0 ? 'Now!' : `${weeksSince} weeks ago`}
                      </dd>
                    </div>
                    <div className="grid grid-cols-2 py-1">
                      <dt className="font-semibold">Occurrences</dt>
                      <dd className="">{pluralize(flavor.history.length, 'time', 'times')}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            <details className="mt-auto w-full rounded-b-xl border-t p-4 hover:cursor-pointer hover:bg-gray-50">
              <summary className="-m-4 p-4 font-semibold">View nutrition info</summary>
              <Image
                className="z-10 mt-2 origin-top-right"
                src={flavor.nutritionImage}
                alt={`Nutrition label for ${flavor.name}`}
                width={400}
                height={733}
              />
            </details>
          </li>
        );
      })}
    </ul>
  );
}
