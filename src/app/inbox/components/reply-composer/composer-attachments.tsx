'use client';
import React, { useRef, useState } from 'react';
import Button from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface Attachment {
  name: string;
}

export function useAttachments() {
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
  return { attachments, fileRef, onAttach, onFiles, remove };
}

function AttachmentChip({
  name,
  onRemove,
}: {
  name: string;
  onRemove: () => void;
}) {
  return (
    <div className="bg-muted border-border text-muted-foreground flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs">
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

export default function AttachmentList({
  attachments,
  onRemove,
  className,
}: {
  attachments: Attachment[];
  onRemove: (name: string) => void;
  className?: string;
}) {
  if (!attachments.length) return null;
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {attachments.map(a => (
        <AttachmentChip
          key={a.name}
          name={a.name}
          onRemove={() => onRemove(a.name)}
        />
      ))}
    </div>
  );
}

export interface ComposerFooterProps {
  fileRef: React.RefObject<HTMLInputElement | null>;
  onAttach: () => void;
  onFiles: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  sending: boolean;
  className?: string;
  children?: React.ReactNode;
}

function FileInput({
  fileRef,
  onAttach,
  onFiles,
}: Pick<ComposerFooterProps, 'fileRef' | 'onAttach' | 'onFiles'>) {
  return (
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
  );
}

export function ComposerFooter({
  fileRef,
  onAttach,
  onFiles,
  onSend,
  sending,
  className,
  children,
}: ComposerFooterProps) {
  return (
    <div className={cn('border-border flex shrink-0 items-center justify-between border-t', className)}>
      <FileInput fileRef={fileRef} onAttach={onAttach} onFiles={onFiles} />
      <Button onClick={onSend} disabled={sending}>
        {sending ? 'Sending...' : 'Send'}
        {children}
      </Button>
    </div>
  );
}
