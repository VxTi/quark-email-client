"use client";
import { useState } from "react";
import EmailList from "@/app/inbox/components/email-list";
import EmailViewer from "@/app/inbox/components/email-viewer";
import Sidebar from "@/app/inbox/components/sidebar";
import { useEmails } from "@/lib/email-context";
import type { Email } from "@/types/email";

export default function InboxPage() {
  const { emails } = useEmails();
  const [selected, setSelected] = useState<Email | null>(null);
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <EmailList emails={emails} selectedId={selected?.id} onSelect={setSelected} />
      <EmailViewer email={selected} />
    </div>
  );
}
