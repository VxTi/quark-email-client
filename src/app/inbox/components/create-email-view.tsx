'use client';
import 'prosekit/basic/style.css';
import { Field } from '@base-ui/react/field';
import { XIcon } from 'lucide-react';
import { defineBasicExtension } from 'prosekit/basic';
import { createEditor } from 'prosekit/core';
import { ProseKit } from 'prosekit/react';
import React, { useMemo, useRef, useState } from 'react';
import EmailInputMessageToolbar from '@/app/inbox/components/reply-composer/email-input-message-toolbar';
import Button from '@/components/ui/button';
import { sendEmail } from '@/lib/requests/mail';
import { toast } from 'sonner';

export interface ComposeFormProps {
  to: string;
  setTo: (v: string) => void;
  cc: string;
  setCc: (v: string) => void;
  bcc: string;
  setBcc: (v: string) => void;
  subject: string;
  setSubject: (v: string) => void;
}

interface Props extends ComposeFormProps {
  onClose: () => void;
}

interface Attachment {
  name: string;
}

interface FieldRowProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

interface ComposeFooterProps {
  fileRef: React.RefObject<HTMLInputElement | null>;
  onAttach: () => void;
  onFiles: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  sending: boolean;
}

function ComposeFieldRow({ label, value, onChange }: FieldRowProps) {
  return (
    <Field.Root className="border-border flex items-center gap-3 border-b-2 px-4 py-2">
      <Field.Label className="text-muted-foreground w-12 shrink-0 text-sm font-medium">
        {label}
      </Field.Label>
      <Field.Control
        render={
          <input
            value={value}
            onChange={e => {
              onChange(e.target.value);
            }}
          />
        }
        className="text-foreground flex-1 bg-transparent text-sm outline-none"
      />
    </Field.Root>
  );
}

function ComposeViewHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="border-border flex h-14 shrink-0 items-center justify-between border-b-2 px-4 py-3">
      <h2 className="text-foreground text-sm font-semibold">New Message</h2>
      <Button variant="ghost" size="icon" onClick={onClose}>
        <XIcon className="size-4" />
      </Button>
    </div>
  );
}

function ComposeFormFields({
  to,
  setTo,
  cc,
  setCc,
  bcc,
  setBcc,
  subject,
  setSubject,
}: ComposeFormProps) {
  return (
    <div className="shrink-0">
      <ComposeFieldRow label="To" value={to} onChange={setTo} />
      <ComposeFieldRow label="CC" value={cc} onChange={setCc} />
      <ComposeFieldRow label="BCC" value={bcc} onChange={setBcc} />
      <ComposeFieldRow label="Subject" value={subject} onChange={setSubject} />
    </div>
  );
}

function useComposeBody() {
  const editor = useMemo(
    () => createEditor({ extension: defineBasicExtension() }),
    []
  );
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const onAttach = () => fileRef.current?.click();
  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setAttachments(prev => [...prev, ...files.map(f => ({ name: f.name }))]);
    e.target.value = '';
  };
  const remove = (name: string) => {
    setAttachments(prev => prev.filter(a => a.name !== name));
  };
  return { editor, attachments, fileRef, onAttach, onFiles, remove };
}

function ComposeAttachmentChip({
  name,
  onRemove,
}: {
  name: string;
  onRemove: () => void;
}) {
  return (
    <div className="bg-muted border-border text-muted-foreground flex items-center gap-1.5 rounded-lg border-2 px-2.5 py-1 text-xs">
      <span>📎</span>
      <span className="max-w-30 truncate">{name}</span>
      <button
        type="button"
        onClick={onRemove}
        className="hover:text-foreground ml-0.5 cursor-pointer leading-none"
      >
        ×
      </button>
    </div>
  );
}

function ComposeAttachmentList({
  attachments,
  onRemove,
}: {
  attachments: Attachment[];
  onRemove: (name: string) => void;
}) {
  if (!attachments.length) return null;
  return (
    <div className="border-border flex shrink-0 flex-wrap gap-2 border-t-2 px-4 py-2">
      {attachments.map(a => (
        <ComposeAttachmentChip
          key={a.name}
          name={a.name}
          onRemove={() => {
            onRemove(a.name);
          }}
        />
      ))}
    </div>
  );
}

function ComposeBodyFooter({
  fileRef,
  onAttach,
  onFiles,
  onSend,
  sending,
}: ComposeFooterProps) {
  return (
    <div className="border-border flex shrink-0 items-center justify-between border-t-2 px-4 py-3">
      <div className="flex">
        <input
          ref={fileRef}
          type="file"
          multiple
          className="hidden"
          onChange={onFiles}
        />
        <Button variant="ghost" onClick={onAttach}>
          📎
        </Button>
      </div>
      <Button onClick={onSend} disabled={sending}>
        {sending ? 'Sending...' : 'Send'}
      </Button>
    </div>
  );
}

function ComposeBodyEditor({
  editor,
}: {
  editor: ReturnType<typeof createEditor>;
}) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <ProseKit editor={editor}>
        <EmailInputMessageToolbar />
        <div
          ref={editor.mount as React.Ref<HTMLDivElement>}
          className="text-foreground flex-1 overflow-y-auto px-4 py-3 text-sm leading-relaxed outline-none"
        />
      </ProseKit>
    </div>
  );
}

function ComposeBody({
  to,
  cc,
  bcc,
  subject,
  onClose,
}: {
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  onClose: () => void;
}) {
  const { editor, attachments, fileRef, onAttach, onFiles, remove } =
    useComposeBody();
  const [sending, setSending] = useState(false);

  const onSend = async () => {
    setSending(true);
    try {
      await sendEmail({
        to,
        cc,
        bcc,
        subject,
        body: editor.getDocHTML(),
      });

      onClose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to send email';
      toast.error(message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <ComposeBodyEditor editor={editor} />
      <ComposeAttachmentList attachments={attachments} onRemove={remove} />
      <ComposeBodyFooter
        fileRef={fileRef}
        onAttach={onAttach}
        onFiles={onFiles}
        onSend={onSend}
        sending={sending}
      />
    </div>
  );
}

export default function CreateEmailView({ onClose, ...form }: Props) {
  return (
    <div className="bg-card flex h-full flex-1 flex-col overflow-hidden">
      <ComposeViewHeader onClose={onClose} />
      <ComposeFormFields {...form} />
      <ComposeBody {...form} onClose={onClose} />
    </div>
  );
}
