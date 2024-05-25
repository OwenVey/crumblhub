import { Navbar } from '@/components/Navbar';
import { cn } from '@/utils';
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Crumblhub',
    default: 'Crumblhub', // a default is required when creating a template
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(montserrat.variable)}>
      <body className="bg-[#EFEFEF]">
        <Navbar />
        <main className="mx-auto max-w-7xl p-4">{children}</main>
      </body>
    </html>
  );
}
