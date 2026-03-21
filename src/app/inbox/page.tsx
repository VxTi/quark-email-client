"use client";
import { useState } from "react";
import ComposeView from "@/app/inbox/components/compose-view";
import EmailList from "@/app/inbox/components/email-list";
import EmailViewer from "@/app/inbox/components/email-viewer";
import Sidebar from "@/app/inbox/components/sidebar";
import { useEmails } from "@/lib/email-context";
import type { Email } from "@/types/email";

function useInboxState() {
  const { emails } = useEmails();
  const [selected, setSelected] = useState<Email | null>(null);
  const [composing, setComposing] = useState(false);
  return { emails, selected, setSelected, composing, setComposing };
}

export default function InboxPage() {
  const { emails, selected, setSelected, composing, setComposing } = useInboxState();
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar onCompose={() => setComposing(true)} />
      <EmailList emails={emails} selectedId={selected?.id} onSelect={setSelected} />
      {composing
        ? <ComposeView onClose={() => setComposing(false)} />
        : <EmailViewer email={selected} />}
    </div>
  );
}
