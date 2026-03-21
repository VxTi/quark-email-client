"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Email, Tag } from "@/types/email";
import { mockEmails } from "@/lib/mock-emails";

interface EmailContextType {
  emails: Email[];
  setEmails: (emails: Email[]) => void;
  updateEmailTags: (id: string, tags: Tag[]) => void;
  deleteEmails: (ids: string[]) => void;
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

export function EmailProvider({ children }: { children: ReactNode }) {
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const updateEmailTags = (id: string, tags: Tag[]) =>
    setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, tags } : e)));
  const deleteEmails = (ids: string[]) =>
    setEmails((prev) => prev.filter((e) => !ids.includes(e.id)));
  return (
    <EmailContext.Provider value={{ emails, setEmails, updateEmailTags, deleteEmails }}>
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
