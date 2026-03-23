"use client";
import "prosekit/basic/style.css";
import { SendIcon } from "lucide-react";
import { defineBasicExtension } from "prosekit/basic";
import { createEditor } from "prosekit/core";
import { ProseKit } from "prosekit/react";
import { useMemo, useRef, useState } from "react";
import ResponseInputToolbar from "@/app/inbox/components/reply-composer/response-input-toolbar";
import Button from "@/components/ui/button";

interface Attachment {
  name: string;
}

interface FooterProps {
  fileRef: React.RefObject<HTMLInputElement | null>;
  onAttach: () => void;
  onFiles: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface InputProps extends FooterProps {
  editor: ReturnType<typeof createEditor>;
}

function useReplyComposer() {
  const editor = useMemo(() => createEditor({ extension: defineBasicExtension() }), []);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const onAttach = () => fileRef.current?.click();
  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setAttachments((prev) => [...prev, ...files.map((f) => ({ name: f.name }))]);
    e.target.value = "";
  };
  const remove = (name: string) => setAttachments((prev) => prev.filter((a) => a.name !== name));
  return { editor, attachments, fileRef, onAttach, onFiles, remove };
}

function AttachmentChip({ name, onRemove }: { name: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-muted border border-border rounded-lg text-xs text-muted-foreground">
      <span>📎</span>
      <span className="truncate max-w-30">{name}</span>
      <button
        type="button"
        onClick={onRemove}
        className="ml-0.5 leading-none hover:text-foreground cursor-pointer"
      >
        ×
      </button>
    </div>
  );
}

function AttachmentList({
  attachments,
  onRemove,
}: {
  attachments: Attachment[];
  onRemove: (name: string) => void;
}) {
  if (!attachments.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {attachments.map((a) => (
        <AttachmentChip key={a.name} name={a.name} onRemove={() => onRemove(a.name)} />
      ))}
    </div>
  );
}

function ComposerFooter({ fileRef, onAttach, onFiles }: FooterProps) {
  return (
    <div className="flex items-center justify-between px-2 py-1.5 border-t border-border">
      <div className="flex">
        <input ref={fileRef} type="file" multiple className="hidden" onChange={onFiles} />
        <Button variant="ghost" onClick={onAttach}>
          📎
        </Button>
      </div>
      <Button className="gap-2">
        Send
        <SendIcon className="size-4" />
      </Button>
    </div>
  );
}

function ComposerInput({ editor, fileRef, onAttach, onFiles }: InputProps) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
      <ProseKit editor={editor}>
        <ResponseInputToolbar />
        <div
          ref={editor.mount as React.Ref<HTMLDivElement>}
          className="px-3 py-2 min-h-15 max-h-40 overflow-y-auto text-sm text-foreground outline-none leading-relaxed"
        />
      </ProseKit>
      <ComposerFooter fileRef={fileRef} onAttach={onAttach} onFiles={onFiles} />
    </div>
  );
}

export default function ResponseInputField() {
  const { editor, attachments, fileRef, onAttach, onFiles, remove } = useReplyComposer();
  return (
    <div className="border-border px-4 py-3 shrink-0 flex flex-col gap-2 max-h-70">
      <AttachmentList attachments={attachments} onRemove={remove} />
      <ComposerInput editor={editor} fileRef={fileRef} onAttach={onAttach} onFiles={onFiles} />
    </div>
  );
}
