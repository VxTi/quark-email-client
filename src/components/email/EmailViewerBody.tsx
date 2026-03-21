"use client";
import Markdown from "react-markdown";
import type { Email } from "@/types/email";
import ReplyComposer  from "./reply-composer/ReplyComposer";

interface Props { email: Email; }

function Attachment({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg text-xs text-muted-foreground">
      <span>📎</span>
      <span className="truncate">{name}</span>
    </div>
  );
}

function EmailBubble({ email }: { email: Email }) {
  return (
    <div className="flex flex-col items-start gap-1 max-w-[75%]">
      <span className="text-xs text-muted-foreground px-1">{email.from} · {email.date}</span>
      <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-foreground leading-relaxed">
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
