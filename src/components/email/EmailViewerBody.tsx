"use client";
import Markdown from "react-markdown";
import Button from "@/components/ui/Button";
import type { Email } from "@/types/email";

interface Props { email: Email; }

function Attachment({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-surface border border-border rounded-lg text-xs text-text-muted">
      <span>📎</span>
      <span className="truncate">{name}</span>
    </div>
  );
}

function EmailBubble({ email }: { email: Email }) {
  return (
    <div className="flex flex-col items-start gap-1 max-w-[75%]">
      <span className="text-xs text-text-muted px-1">{email.from} · {email.date}</span>
      <div className="bg-bubble rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-text leading-relaxed">
        <Markdown>{email.body}</Markdown>
      </div>
      {email.attachments?.length ? (
        <div className="flex flex-wrap gap-2 mt-1">
          {email.attachments.map(a => <Attachment key={a} name={a} />)}
        </div>
      ) : null}
    </div>
  );
}

function ReplyComposer() {
  return (
    <div className="px-4 py-3 border-t border-border shrink-0">
      <div className="flex items-end gap-3 bg-surface border border-border rounded-xl px-4 py-2">
        <textarea
          className="flex-1 bg-transparent text-sm text-text placeholder:text-text-muted resize-none outline-none min-h-[36px] max-h-[120px]"
          placeholder="Reply..."
          rows={1}
        />
        <Button className="shrink-0">Send</Button>
      </div>
    </div>
  );
}

export default function EmailViewerBody({ email }: Props) {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <EmailBubble email={email} />
      </div>
      <ReplyComposer />
    </div>
  );
}
