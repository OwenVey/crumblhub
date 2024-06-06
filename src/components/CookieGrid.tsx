'use client';

import { CookieCard } from '@/components/CookieCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type SelectCookie } from '@/types';
import { ArrowDownNarrowWideIcon, ArrowDownWideNarrowIcon } from 'lucide-react';
import { memo, useMemo, useState } from 'react';

interface CookieGridProps extends React.HTMLAttributes<HTMLDivElement> {
  cookies: SelectCookie[];
}

export function CookieGrid({ cookies }: CookieGridProps) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredCookies = useMemo(() => {
    let filtered = cookies.filter((cookie) => cookie.name.toLowerCase().includes(search.toLowerCase()));
    filtered = filtered.sort((a, b) => {
      const one = sortOrder === 'asc' ? a : b;
      const two = sortOrder === 'asc' ? b : a;

      if (sort === 'name') return one.name.localeCompare(two.name);
      if (sort === 'calories') return (one.calories ?? 0) - (two.calories ?? 0);
      if (sort === 'rating') return one.averageRating - two.averageRating;
      if (sort === 'reviews') return one.totalReviews - two.totalReviews;
      if (sort === 'occurances') return one.weekCookies.length - two.weekCookies.length;
      else return 0;
    });

    return filtered;
  }, [cookies, search, sort, sortOrder]);

  return (
    <div>
      <div className="flex gap-4 flex-col sm:flex-row sm:items-end">
        <div className="grid w-full sm:max-w-64 items-center gap-1.5">
          <Label htmlFor="search">Search</Label>
          <Input
            type="text"
            id="search"
            placeholder="Search by cookie name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="search">Sort</Label>
          <div className="flex">
            <Button
              className="rounded-r-none -mr-px"
              onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
              size="icon"
              variant="outline"
            >
              {sortOrder === 'asc' ? (
                <ArrowDownNarrowWideIcon className="size-5" />
              ) : (
                <ArrowDownWideNarrowIcon className="size-5" />
              )}
            </Button>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="sm:w-40 rounded-l-none">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="calories">Calories</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="reviews">Reviews</SelectItem>
                  <SelectItem value="occurances">Occurances</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <span className="shrink-0 text-sm font-medium text-right text-gray-11 sm:leading-10">
          {filteredCookies.length} cookies
        </span>
      </div>

      <CookieList cookies={filteredCookies} />
    </div>
  );
}

const CookieList = memo(function CookieList({ cookies }: { cookies: SelectCookie[] }) {
  return (
    <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cookies.map((cookie) => (
        <CookieCard key={cookie.name} cookie={cookie} />
      ))}
    </ul>
  );
});
