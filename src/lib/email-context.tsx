"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Email, Tag } from "@/types/email";
import { fetchEmails, type ApiEmail } from "@/lib/requests/emails";

interface EmailContextType {
  emails: Email[];
  setEmails: (emails: Email[]) => void;
  updateEmailTags: (id: string, tags: Tag[]) => void;
  deleteEmails: (ids: string[]) => void;
  addEmail: (email: ApiEmail) => void;
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

function toUiEmailBase(api: ApiEmail) {
  const from = api.fromName ? `${api.fromName} <${api.fromAddress}>` : api.fromAddress;
  return {
    id: api.id,
    from,
    to: api.to,
    subject: api.subject,
    preview: api.preview || api.body.slice(0, 100),
    date: api.date ?? api.createdAt,
    read: api.read,
    messages: [] as Email["messages"],
    tags: [] as Email["tags"],
  };
}

function toUiEmail(api: ApiEmail): Email {
  return {
    ...toUiEmailBase(api),
    cc: api.cc || undefined,
    bcc: api.bcc || undefined,
    body: api.body || undefined,
    tagId: api.tagId ?? undefined,
    internalTag: api.internalTag,
  };
}

export function EmailProvider({ children }: { children: ReactNode }) {
  const [emails, setEmails] = useState<Email[]>([]);
  useEffect(() => {
    fetchEmails().then((apiEmails) => setEmails(apiEmails.map(toUiEmail)));
  }, []);
  const addEmail = (apiEmail: ApiEmail) => setEmails((prev) => [...prev, toUiEmail(apiEmail)]);
  const updateEmailTags = (id: string, tags: Tag[]) =>
    setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, tags } : e)));
  const deleteEmails = (ids: string[]) =>
    setEmails((prev) => prev.filter((e) => !ids.includes(e.id)));
  return (
    <EmailContext.Provider value={{ emails, setEmails, updateEmailTags, deleteEmails, addEmail }}>
      {children}
    </EmailContext.Provider>
  );
}

export function useEmails() {
  const context = useContext(EmailContext);
  if (context === undefined) {
    throw new Error("useEmails must be used within an EmailProvider");
  }
  return context;
}
