'use client';

import { CookieCard } from '@/components/CookieCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { pluralize } from '@/lib/utils';
import { type SelectCookie } from '@/types';
import { ArrowDownNarrowWideIcon, ArrowDownWideNarrowIcon, FilterXIcon } from 'lucide-react';
import { memo, useMemo, useState } from 'react';
import { Separator } from './ui/separator';

interface CookieGridProps extends React.HTMLAttributes<HTMLDivElement> {
  cookies: SelectCookie[];
}

export function CookieGrid({ cookies }: CookieGridProps) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [servedFilter, setServedFilter] = useState('');
  const [partnerFilter, setPartnerFilter] = useState('');

  const partners = [...new Set(cookies.map(({ featuredPartner }) => featuredPartner))].filter(Boolean).sort();
  const servingMethods = [...new Set(cookies.map(({ servingMethod }) => servingMethod))].filter(Boolean).sort();

  function clearFilters() {
    setSearch('');
    setSort('name');
    setSortOrder('asc');
    setServedFilter('');
    setPartnerFilter('');
  }

  const isActiveFilter =
    search !== '' || sort !== 'name' || sortOrder !== 'asc' || servedFilter !== '' || partnerFilter !== '';

  const filteredCookies = useMemo(
    () =>
      cookies
        .filter((cookie) => {
          const { name, servingMethod, featuredPartner } = cookie;

          const matchesSearch = name.length ? name.toLowerCase().includes(search.toLowerCase()) : true;
          const matchesPartner = partnerFilter ? featuredPartner === partnerFilter : true;
          const matchesServingMethod = servedFilter ? servingMethod === servedFilter : true;

          return matchesSearch && matchesServingMethod && matchesPartner;
        })
        .sort((a, b) => {
          const [one, two] = sortOrder === 'asc' ? [a, b] : [b, a];

          switch (sort) {
            case 'name':
              return one.name.localeCompare(two.name);
            case 'calories':
              return (one.calories ?? 0) - (two.calories ?? 0);
            case 'rating':
              return +one.averageRating - +two.averageRating;
            case 'reviews':
              return one.totalReviews - two.totalReviews;
            case 'occurances':
              return one.weekCookies.length - two.weekCookies.length;
            default:
              return 0;
          }
        }),
    [cookies, partnerFilter, search, servedFilter, sort, sortOrder],
  );

  return (
    <div>
      <div className="flex flex-col flex-wrap gap-4 sm:flex-row sm:items-end">
        <div className="grid w-full items-center gap-1.5 sm:max-w-64">
          <Label htmlFor="search">Search</Label>
          <Input
            type="text"
            id="search"
            placeholder="Search by cookie name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid w-full items-center gap-1.5 sm:w-auto">
          <Label htmlFor="search">Sort</Label>
          <div className="flex">
            <Button
              className="-mr-px rounded-r-none"
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
              <SelectTrigger className="rounded-l-none sm:w-40">
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

        {/* <div>
          <Label>Served</Label>
          <ToggleGroup type="multiple" variant="outline" value={servedFilter} onValueChange={setServedFilter}>
            {servingMethods.map((method) => (
              <ToggleGroupItem key={method} value={method} className="flex-1 sm:flex-auto">
                {method}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div> */}

        <div>
          <Label>Served</Label>
          <Select value={servedFilter} onValueChange={setServedFilter}>
            <SelectTrigger className="min-w-44">
              <SelectValue placeholder="Serving method" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {servingMethods.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Partner</Label>
          <Select value={partnerFilter} onValueChange={setPartnerFilter}>
            <SelectTrigger className="min-w-44">
              <SelectValue placeholder="Filter by partner" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {partners.map((partner) => (
                  <SelectItem key={partner} value={partner}>
                    {partner}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Button
          className="ml-auto w-full sm:w-auto"
          onClick={clearFilters}
          variant="outline"
          disabled={!isActiveFilter}
        >
          <FilterXIcon className="mr-2 size-4" />
          Clear
        </Button>
      </div>

      <Separator className="my-4" />

      <CookieList cookies={filteredCookies} />
    </div>
  );
}

const CookieList = memo(function CookieList({ cookies }: { cookies: SelectCookie[] }) {
  if (cookies.length === 0) {
    return <div className="text-gray-11 mt-36 grid place-items-center">No results</div>;
  }

  return (
    <div>
      <div className="text-gray-11 text-right text-sm font-medium">
        {pluralize(cookies.length, 'cookie', 'cookies')}
      </div>

      <ul className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cookies.map((cookie) => (
          <CookieCard key={cookie.id} cookie={cookie} />
        ))}
      </ul>
    </div>
  );
});
