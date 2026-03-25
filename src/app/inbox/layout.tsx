import { EmailProvider } from '@/lib/email-context';
import { TagProvider } from '@/lib/tag-context';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <TagProvider>
      <EmailProvider>{children}</EmailProvider>
    </TagProvider>
  );
}
