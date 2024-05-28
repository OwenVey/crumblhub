import { Navbar } from '@/components/Navbar';
import '@/styles/globals.css';

import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

export const metadata = {
  title: {
    template: '%s | Crumblhub',
    default: 'Crumblhub',
  },
  description: 'View information about all of the flavors Crumbl has released',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="bg-[#EFEFEF]">
        <Navbar />
        <main className="mx-auto max-w-screen-xl p-4">{children}</main>
      </body>
    </html>
  );
}
