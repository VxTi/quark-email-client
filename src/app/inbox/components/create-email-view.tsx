'use client';
import 'prosekit/basic/style.css';
import { Field } from '@base-ui/react/field';
import { XIcon } from 'lucide-react';
import { defineBasicExtension } from 'prosekit/basic';
import { createEditor } from 'prosekit/core';
import { ProseKit } from 'prosekit/react';
import React, { useEffect, useMemo, useState } from 'react';
import EmailInputMessageToolbar from '@/app/inbox/components/reply-composer/email-input-message-toolbar';
import SaveEmailDialog from '@/app/inbox/components/save-email-dialog';
import AttachmentList, {
  useAttachments,
  ComposerFooter,
} from '@/app/inbox/components/reply-composer/composer-attachments';
import Button from '@/components/ui/button';
import { sendEmail } from '@/lib/requests/mail';
import { type DraftData } from '@/models/email';
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
  onSave: (data: DraftData) => Promise<void>;
  getBodyRef?: React.RefObject<() => string>;
}

interface FieldRowProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
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

function isEditorEmpty(editor: ReturnType<typeof createEditor>): boolean {
  return (
    editor
      .getDocHTML()
      .replace(/<[^>]*>/g, '')
      .trim() === ''
  );
}

function hasFormContent({ to, cc, bcc, subject }: ComposeFormProps): boolean {
  return !!(to || cc || bcc || subject);
}

function gatherDraftData(
  form: ComposeFormProps,
  editor: ReturnType<typeof createEditor>
): DraftData {
  return {
    to: form.to,
    cc: form.cc,
    bcc: form.bcc,
    subject: form.subject,
    bodyHtml: editor.getDocHTML(),
  };
}

function useCloseGuard(
  form: ComposeFormProps,
  editor: ReturnType<typeof createEditor>,
  onClose: () => void,
  onSave: (data: DraftData) => Promise<void>
) {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const handleClose = () => {
    const hasContent = hasFormContent(form) || !isEditorEmpty(editor);
    if (hasContent) {
      setShowSaveDialog(true);
    } else {
      onClose();
    }
  };
  const handleConfirm = async (save: boolean) => {
    if (save) await onSave(gatherDraftData(form, editor));
    setShowSaveDialog(false);
    onClose();
  };
  return { showSaveDialog, handleClose, handleConfirm };
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

interface ComposeBodyProps {
  form: ComposeFormProps;
  editor: ReturnType<typeof createEditor>;
  onClose: () => void;
}

function useComposeSend(
  form: ComposeFormProps,
  editor: ReturnType<typeof createEditor>,
  onClose: () => void
) {
  const [sending, setSending] = useState(false);
  const handleSend = async () => {
    setSending(true);
    try {
      const { to, cc, bcc, subject } = form;
      await sendEmail({ to, cc, bcc, subject, bodyHtml: editor.getDocHTML() });
      onClose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to send email';
      toast.error(message);
    } finally {
      setSending(false);
    }
  };
  return { sending, handleSend };
}

function ComposeBody({ form, editor, onClose }: ComposeBodyProps) {
  const { attachments, fileRef, onAttach, onFiles, remove } = useAttachments();
  const { sending, handleSend } = useComposeSend(form, editor, onClose);
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <ComposeBodyEditor editor={editor} />
      <AttachmentList
        attachments={attachments}
        onRemove={remove}
        className="border-border shrink-0 border-t-2 px-4 py-2"
      />
      <ComposerFooter
        fileRef={fileRef}
        onAttach={onAttach}
        onFiles={onFiles}
        onSend={handleSend}
        sending={sending}
        className="border-t-2 px-4 py-3"
      />
    </div>
  );
}

export default function CreateEmailView({
  onClose,
  onSave,
  getBodyRef,
  ...form
}: Props) {
  const editor = useMemo(
    () => createEditor({ extension: defineBasicExtension() }),
    []
  );
  useEffect(() => {
    if (getBodyRef) getBodyRef.current = () => editor.getDocHTML();
  }, [editor, getBodyRef]);
  const { showSaveDialog, handleClose, handleConfirm } = useCloseGuard(
    form,
    editor,
    onClose,
    onSave
  );

  return (
    <div className="bg-card flex h-full flex-1 flex-col overflow-hidden">
      <ComposeViewHeader onClose={handleClose} />
      <ComposeFormFields {...form} />
      <ComposeBody form={form} editor={editor} onClose={onClose} />
      <SaveEmailDialog open={showSaveDialog} onConfirm={handleConfirm} />
    </div>
  );
}
