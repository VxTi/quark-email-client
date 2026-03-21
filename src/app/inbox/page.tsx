"use client";
import { useState } from "react";
import ComposeView from "@/app/inbox/components/compose-view";
import EmailList from "@/app/inbox/components/email-list";
import EmailViewer from "@/app/inbox/components/email-viewer";
import SaveEmailDialog from "@/app/inbox/components/save-email-dialog";
import Sidebar from "@/app/inbox/components/sidebar";
import { useEmails } from "@/lib/email-context";
import { InternalTag, type ActiveFilter } from "@/types/email";
import { saveEmail } from "@/lib/requests/emails";
import type { Email } from "@/types/email";

function useComposeForm() {
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState("");
  const isDirty = [to, cc, bcc, subject].some(Boolean);
  const reset = () => {
    setTo("");
    setCc("");
    setBcc("");
    setSubject("");
  };
  return { to, setTo, cc, setCc, bcc, setBcc, subject, setSubject, isDirty, reset };
}

function useComposing(form: { isDirty: boolean; reset: () => void }) {
  const [composing, setComposing] = useState(false);
  const [pending, setPending] = useState<Email | null>(null);
  const close = () => {
    setComposing(false);
    form.reset();
    setPending(null);
  };
  const requestSelect = (email: Email) => {
    if (composing && form.isDirty) {
      setPending(email);
      return true;
    }
    return false;
  };
  return { composing, setComposing, pending, close, requestSelect };
}

function useFilter() {
  const [filter, setFilter] = useState<ActiveFilter>(null);
  return { filter, setFilter };
}

function useInboxState(form: ReturnType<typeof useComposeForm>) {
  const { emails, deleteEmails } = useEmails();
  const [selected, setSelected] = useState<Email | null>(null);
  const comp = useComposing(form);
  const confirm = async (save: boolean) => {
    if (save)
      await saveEmail({
        to: form.to,
        cc: form.cc,
        bcc: form.bcc,
        subject: form.subject,
        internalTag: InternalTag.Draft,
      });
    setSelected(comp.pending);
    comp.close();
  };
  const onSelect = (email: Email) => {
    if (comp.requestSelect(email)) return;
    setSelected(email);
    if (comp.composing) comp.close();
  };
  return { emails, selected, deleteEmails, ...comp, confirm, onSelect };
}

export default function InboxPage() {
  const form = useComposeForm();
  const state = useInboxState(form);
  const { filter, setFilter } = useFilter();
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar onCompose={() => state.setComposing(true)} filter={filter} onFilter={setFilter} />
      <EmailList
        emails={state.emails}
        selectedId={state.selected?.id}
        onSelect={state.onSelect}
        onDelete={state.deleteEmails}
        filter={filter}
      />
      {state.composing ? (
        <ComposeView onClose={state.close} {...form} />
      ) : (
        <EmailViewer email={state.selected} />
      )}
      <SaveEmailDialog open={!!state.pending} onConfirm={state.confirm} />
    </div>
  );
}
