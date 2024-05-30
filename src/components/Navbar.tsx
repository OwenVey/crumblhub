'use client';

import logoImage from '@/images/crumblhub.png';
import { cn } from '@/lib/utils';
import Image from 'next/image';
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
    <nav className="sticky top-0 z-20 flex h-16 items-center bg-black">
      <div className="mx-auto flex w-full max-w-7xl items-center px-4">
        <a href="/" className="inline-block shrink-0">
          <Image className="h-8 w-auto" src={logoImage} alt="Crumblhub logo" />
        </a>

        <div className="ml-12 flex gap-4">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn('inline-flex rounded-lg px-3 py-2 text-sm font-semibold', [
                link.href === pathname ? 'bg-[#2a2a2a] text-white' : 'text-[#b4b4b4] hover:text-white',
              ])}
            >
              {link.label}
            </a>
          ))}
        </div>

        <ThemeDropdown />
      </div>
    </nav>
  );
}
