'use client';
import 'prosekit/basic/style.css';
import { SendIcon } from 'lucide-react';
import { defineBasicExtension } from 'prosekit/basic';
import { createEditor } from 'prosekit/core';
import { ProseKit } from 'prosekit/react';
import React, { useMemo, useState } from 'react';
import AttachmentList, {
  useAttachments,
  ComposerFooter,
} from '@/app/inbox/components/reply-composer/composer-attachments';
import EmailInputMessageToolbar from '@/app/inbox/components/reply-composer/email-input-message-toolbar';

interface ResponseInputProps {
  onSend: (body: string) => Promise<void>;
}

function useEmailInputComposer(onSend: (body: string) => Promise<void>) {
  const editor = useMemo(
    () => createEditor({ extension: defineBasicExtension() }),
    []
  );
  const [sending, setSending] = useState(false);
  const attachmentState = useAttachments();

  const handleSend = async () => {
    setSending(true);
    try {
      await onSend(editor.getDocHTML());
    } finally {
      setSending(false);
    }
  };

  return { editor, sending, handleSend, ...attachmentState };
}

function ComposerInput({
  editor,
  fileRef,
  onAttach,
  onFiles,
  onSend,
  sending,
}: {
  editor: ReturnType<typeof createEditor>;
  fileRef: React.RefObject<HTMLInputElement | null>;
  onAttach: () => void;
  onFiles: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  sending: boolean;
}) {
  return (
    <div className="bg-card border-border flex flex-col overflow-hidden rounded-xl border">
      <ProseKit editor={editor}>
        <EmailInputMessageToolbar />
        <div
          ref={editor.mount as React.Ref<HTMLDivElement>}
          className="text-foreground max-h-40 min-h-15 overflow-y-auto px-3 py-2 text-sm leading-relaxed outline-none"
        />
      </ProseKit>
      <ComposerFooter
        fileRef={fileRef}
        onAttach={onAttach}
        onFiles={onFiles}
        onSend={onSend}
        sending={sending}
        className="px-2 py-1.5"
      >
        <SendIcon className="size-4" />
      </ComposerFooter>
    </div>
  );
}

export default function EmailInputField({ onSend }: ResponseInputProps) {
  const {
    editor,
    attachments,
    fileRef,
    onAttach,
    onFiles,
    remove,
    sending,
    handleSend,
  } = useEmailInputComposer(onSend);
  return (
    <div className="border-border flex max-h-70 shrink-0 flex-col gap-2 px-4 py-3">
      <AttachmentList attachments={attachments} onRemove={remove} />
      <ComposerInput
        editor={editor}
        fileRef={fileRef}
        onAttach={onAttach}
        onFiles={onFiles}
        onSend={handleSend}
        sending={sending}
      />
    </div>
  );
}
