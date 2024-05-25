'use client';

import logoImage from '@/app/crumblhub.png';
import { cn } from '@/utils';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const LINKS = [
  {
    href: '/',
    label: 'Flavors',
  },
  {
    href: '/weeks',
    label: 'Weeks',
  },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-20 flex h-16 items-center bg-black px-4">
      <div className="mx-auto flex w-full max-w-7xl items-center">
        <a href="/" className="inline-block">
          <Image className="h-8 w-auto" src={logoImage} alt="Crumblhub logo" />
        </a>

        <div className="ml-12 flex gap-4">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn('inline-flex rounded-lg px-3 py-2 text-sm font-semibold text-gray-400 hover:text-white', {
                'bg-gray-800 text-white': link.href === pathname,
              })}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}