import { CookieCard } from '@/components/CookieCard';
import { db } from '@/server/db';
import { cookiesTable } from '@/server/db/schema';
import { asc } from 'drizzle-orm';

export default async function Home() {
  const cookies = await db.query.cookiesTable.findMany({
    orderBy: [asc(cookiesTable.name)],
    with: { weekCookies: { with: { week: true } } },
  });

  return (
    <ul className="mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cookies.map((cookie) => (
        <CookieCard key={cookie.name} cookie={cookie} />
      ))}
    </ul>
  );
}
