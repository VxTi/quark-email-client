"use client";
import Markdown from "react-markdown";
import type { Email } from "@/types/email";

interface Props { email: Email; }

export default function EmailViewerBody({ email }: Props) {
  return (
    <div className="px-6 py-4 flex-1 overflow-y-auto text-text text-sm leading-relaxed">
      <Markdown>{email.body}</Markdown>
    </div>
  );
}
