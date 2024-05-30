import { CookieGrid } from '@/components/CookieGrid';
import { db } from '@/server/db';
import { cookiesTable } from '@/server/db/schema';
import { asc } from 'drizzle-orm';

export default async function Home() {
  const cookies = await db.query.cookiesTable.findMany({
    orderBy: [asc(cookiesTable.name)],
    with: { weekCookies: { with: { week: true } } },
  });

  return <CookieGrid cookies={cookies} />;
}
