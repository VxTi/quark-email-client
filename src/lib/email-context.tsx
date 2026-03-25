'use client';

import type { ApiEmail } from '@/models/email';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { fetchEmails } from '@/lib/requests/emails';
import type { Email, Tag } from '@/types/email';

interface EmailContextType {
  emails: Email[];
  setEmails: (emails: Email[]) => void;
  updateEmailTags: (id: string, tags: Tag[]) => void;
  updateEmail: (id: string, patch: Partial<Email>) => void;
  deleteEmails: (ids: string[]) => void;
  addEmail: (email: ApiEmail) => void;
  refresh: () => Promise<void>;
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

function buildFrom(api: ApiEmail) {
  return api.fromName
    ? `${api.fromName} <${api.fromAddress}>`
    : api.fromAddress;
}

function buildMessages(api: ApiEmail): Email['messages'] {
  const body = api.bodyText || api.bodyHtml || '';
  if (!body) return [];
  return [{
    id: `${api.id}-0`,
    from: buildFrom(api),
    date: api.date ?? api.createdAt,
    body,
    isFromMe: api.internalTag === 'sent' || api.internalTag === 'draft',
  }];
}

function toUiEmailBase(api: ApiEmail) {
  return {
    id: api.id,
    from: buildFrom(api),
    to: api.to,
    subject: api.subject,
    date: api.date ?? api.createdAt,
    read: api.read,
    messages: buildMessages(api),
    tags: [] as Email['tags'],
  };
}

function toUiEmail(api: ApiEmail): Email {
  return {
    ...toUiEmailBase(api),
    cc: api.cc || undefined,
    bcc: api.bcc || undefined,
    bodyHtml: api.bodyHtml ?? undefined,
    bodyText: api.bodyText ?? undefined,
    tagId: api.tagId ?? undefined,
    internalTag: api.internalTag,
  };
}

export function EmailProvider({ children }: { children: ReactNode }) {
  const [emails, setEmails] = useState<Email[]>([]);

  const refresh = async () => {
    const apiEmails = await fetchEmails();
    setEmails(apiEmails.map(toUiEmail));
  };

  useEffect(() => {
    void refresh();
  }, []);

  const addEmail = (apiEmail: ApiEmail) => {
    setEmails(prev => [...prev, toUiEmail(apiEmail)]);
  };

  const updateEmailTags = (id: string, tags: Tag[]) => {
    setEmails(prev => prev.map(e => (e.id === id ? { ...e, tags } : e)));
  };

  const updateEmail = (id: string, patch: Partial<Email>) => {
    setEmails(prev => prev.map(e => (e.id === id ? { ...e, ...patch } : e)));
  };

  const deleteEmails = (ids: string[]) => {
    setEmails(prev => prev.filter(e => !ids.includes(e.id)));
  };

  return (
    <EmailContext.Provider
      value={{ emails, setEmails, updateEmailTags, updateEmail, deleteEmails, addEmail, refresh }}
    >
      {children}
    </EmailContext.Provider>
  );
}

export function useEmails() {
  const context = useContext(EmailContext);
  if (context === undefined) {
    throw new Error('useEmails must be used within an EmailProvider');
  }
  return context;
}
