"use client";
import { useState } from "react";
import ComposeView from "@/app/inbox/components/compose-view";
import EmailList from "@/app/inbox/components/email-list";
import EmailViewer from "@/app/inbox/components/email-viewer";
import SaveDraftDialog from "@/app/inbox/components/save-draft-dialog";
import Sidebar from "@/app/inbox/components/sidebar";
import { saveDraft } from "@/lib/requests/drafts";
import { useEmails } from "@/lib/email-context";
import type { Email } from "@/types/email";

function useComposeForm() {
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState("");
  const isDirty = [to, cc, bcc, subject].some(Boolean);
  const reset = () => { setTo(""); setCc(""); setBcc(""); setSubject(""); };
  return { to, setTo, cc, setCc, bcc, setBcc, subject, setSubject, isDirty, reset };
}

function useComposing(form: { isDirty: boolean; reset: () => void }) {
  const [composing, setComposing] = useState(false);
  const [pending, setPending] = useState<Email | null>(null);
  const close = () => { setComposing(false); form.reset(); setPending(null); };
  const requestSelect = (email: Email) => {
    if (composing && form.isDirty) { setPending(email); return true; }
    return false;
  };
  return { composing, setComposing, pending, close, requestSelect };
}

function useInboxState(form: ReturnType<typeof useComposeForm>) {
  const { emails } = useEmails();
  const [selected, setSelected] = useState<Email | null>(null);
  const comp = useComposing(form);
  const confirm = async (save: boolean) => {
    if (save) await saveDraft({ to: form.to, cc: form.cc, bcc: form.bcc, subject: form.subject });
    setSelected(comp.pending);
    comp.close();
  };
  const onSelect = (email: Email) => {
    if (comp.requestSelect(email)) return;
    setSelected(email);
    if (comp.composing) comp.close();
  };
  return { emails, selected, ...comp, confirm, onSelect };
}

export default function InboxPage() {
  const form = useComposeForm();
  const state = useInboxState(form);
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar onCompose={() => state.setComposing(true)} />
      <EmailList emails={state.emails} selectedId={state.selected?.id} onSelect={state.onSelect} />
      {state.composing
        ? <ComposeView onClose={state.close} {...form} />
        : <EmailViewer email={state.selected} />}
      <SaveDraftDialog open={!!state.pending} onConfirm={state.confirm} />
    </div>
  );
}
