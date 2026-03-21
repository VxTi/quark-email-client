"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Email } from "@/types/email";
import { mockEmails } from "@/lib/mock-emails";

interface EmailContextType {
  emails: Email[];
  setEmails: (emails: Email[]) => void;
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

export function EmailProvider({ children }: { children: ReactNode }) {
  const [emails, setEmails] = useState<Email[]>(mockEmails);

  return (
    <EmailContext.Provider value={{ emails, setEmails }}>
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

