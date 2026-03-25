import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import { Geist, Figtree } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { TooltipProvider } from '@/components/ui/tooltip';

const figtree = Figtree({ subsets: ['latin'], variable: '--font-sans' });

const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Email Client',
  description: 'A minimal email client',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn('font-sans', figtree.variable)}>
      <body className={`${geist.variable} antialiased`}>
        <Toaster />
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
