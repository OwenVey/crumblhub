'use client';

import logoImage from '@/images/crumblhub.png';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeDropdown } from './ThemeDropdown';

const LINKS = [
  {
    href: '/',
    label: 'Cookies',
  },
  {
    href: '/weeks',
    label: 'Weeks',
  },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-gray-3 sticky top-0 z-20 flex h-16 items-center border-b bg-black">
      <div className="mx-auto flex w-full max-w-7xl items-center px-4">
        <Link
          href="/"
          className="inline-block shrink-0 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-black"
        >
          <Image className="h-7 w-auto" src={logoImage} alt="Crumblhub logo" />
        </Link>

        <div className="ml-8 flex gap-4 sm:ml-12">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'inline-flex rounded-lg py-2 px-3 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-white',
                [link.href === pathname ? 'bg-[#2a2a2a] text-white' : 'text-[#b4b4b4] hover:text-white'],
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <ThemeDropdown />
      </div>
    </nav>
  );
}
