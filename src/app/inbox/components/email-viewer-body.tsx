"use client";
import Markdown from "react-markdown";
import { twMerge } from "tailwind-merge";
import type { Email, EmailMessage } from "@/types/email";
import ResponseInputField from "./reply-composer/response-input-field";

function Attachment({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg text-xs text-muted-foreground">
      <span>📎</span>
      <span className="truncate">{name}</span>
    </div>
  );
}

function AttachmentList({ attachments }: { attachments?: string[] }) {
  if (!attachments?.length) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {attachments.map((a) => (
        <Attachment key={a} name={a} />
      ))}
    </div>
  );
}

function BubbleContent({ message }: { message: EmailMessage }) {
  return (
    <div
      className={twMerge(
        "px-4 py-3 rounded-2xl text-sm leading-relaxed",
        message.isFromMe
          ? "bg-primary text-primary-foreground rounded-tr-sm"
          : "bg-muted text-foreground rounded-tl-sm",
      )}
    >
      <Markdown>{message.body}</Markdown>
    </div>
  );
}

function EmailBubble({ message }: { message: EmailMessage }) {
  const align = message.isFromMe ? "self-end items-end" : "self-start items-start";
  return (
    <div className={`flex flex-col ${align} gap-1 max-w-[75%]`}>
      <span className="text-xs text-muted-foreground px-1">
        {message.from} · {message.date}
      </span>
      <BubbleContent message={message} />
      <AttachmentList attachments={message.attachments} />
    </div>
  );
}

export default function EmailViewerBody({ email }: { email: Email }) {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
        {email.messages.map((m) => (
          <EmailBubble key={m.id} message={m} />
        ))}
      </div>
      <ResponseInputField />
    </div>
  );
}
