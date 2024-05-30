import { Navbar } from '@/components/Navbar';
import { ThemeProvider } from '@/components/ThemeProvider';
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
    <html lang="en" className={montserrat.variable} suppressHydrationWarning>
      <body className="bg-bg">
        <ThemeProvider defaultTheme="system" enableSystem disableTransitionOnChange>
          <Navbar />
          <main className="mx-auto max-w-7xl p-4">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
