'use client';

import logoImage from '@/images/crumblhub.png';
import { cn } from '@/lib/utils';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { CalendarDaysIcon, CookieIcon, FlaskConicalIcon, MenuIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeDropdown } from './ThemeDropdown';

const LINKS = [
  {
    href: '/',
    label: 'Cookies',
    icon: CookieIcon,
  },
  {
    href: '/weeks',
    label: 'Weeks',
    icon: CalendarDaysIcon,
  },
  {
    href: '/testing',
    label: 'Testing',
    icon: FlaskConicalIcon,
  },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <Disclosure as="nav" className="border-gray-3 sticky top-0 z-20 border-b bg-black">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center">
          <Link
            href="/"
            className="inline-block shrink-0 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-black"
          >
            <Image className="h-7 w-auto shrink-0" src={logoImage} alt="Crumblhub logo" />
          </Link>

          <div className="hidden sm:ml-6 sm:block">
            <div className="ml-6 flex gap-4">
              {LINKS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-lg py-2 px-3 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-white',
                    href === pathname
                      ? 'bg-[#2a2a2a] text-white'
                      : 'text-[#b4b4b4] hover:bg-[#111111] hover:text-white',
                  )}
                >
                  <Icon className="size-5" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="-mr-2 flex gap-1">
          <ThemeDropdown />

          <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-[#6e6e6e] hover:bg-gray-[#191919] hover:text-white focus:ring-2 focus:ring-white focus:outline-none focus:ring-inset sm:hidden">
            <span className="absolute -inset-0.5" />
            <span className="sr-only">Open main menu</span>
            <MenuIcon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
            <XIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
          </DisclosureButton>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 pt-2 px-2 pb-3">
          {LINKS.map(({ href, label, icon: Icon }) => (
            <DisclosureButton
              key={href}
              as={Link}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-md py-2 px-3 text-base font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white',
                href === pathname ? 'bg-[#2a2a2a] text-white' : 'text-[#b4b4b4] hover:bg-[#111111] hover:text-white',
              )}
            >
              <Icon className="size-6" />
              {label}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}

const grayDark = {
  gray1: '#111111',
  gray2: '#191919',
  gray3: '#222222',
  gray4: '#2a2a2a',
  gray5: '#313131',
  gray6: '#3a3a3a',
  gray7: '#484848',
  gray8: '#606060',
  gray9: '#6e6e6e',
  gray10: '#7b7b7b',
  gray11: '#b4b4b4',
  gray12: '#eeeeee',
};
