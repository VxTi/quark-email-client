"use client";
import { useState } from "react";
import Sidebar from "@/components/email/Sidebar";
import EmailList from "@/components/email/EmailList";
import EmailViewer from "@/components/email/EmailViewer";
import { mockEmails } from "@/lib/mock-emails";
import type { Email } from "@/types/email";

export default function InboxPage() {
  const [selected, setSelected] = useState<Email | null>(null);
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <EmailList emails={mockEmails} selectedId={selected?.id} onSelect={setSelected} />
      <EmailViewer email={selected} />
    </div>
  );
}
