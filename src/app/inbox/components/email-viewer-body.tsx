"use client";
import { motion } from "framer-motion";
import Markdown from "react-markdown";
import { twMerge } from "tailwind-merge";
import type { Email, EmailMessage } from "@/types/email";
import ResponseInputField from "./reply-composer/response-input-field";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
};

const attachmentContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const attachmentVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
    },
  },
};

function Attachment({ name }: { name: string }) {
  return (
    <motion.div
      variants={attachmentVariants}
      className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg text-xs text-muted-foreground"
    >
      <span>📎</span>
      <span className="truncate">{name}</span>
    </motion.div>
  );
}

function AttachmentList({ attachments }: { attachments?: string[] }) {
  if (!attachments?.length) return null;
  return (
    <motion.div variants={attachmentContainerVariants} className="flex flex-wrap gap-2 mt-1">
      {attachments.map((a) => (
        <Attachment key={a} name={a} />
      ))}
    </motion.div>
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
  return (
    <motion.div
      variants={itemVariants}
      className={twMerge(
        `flex flex-col gap-1 max-w-[75%]`,
        message.isFromMe ? "self-end items-end" : "self-start items-start",
      )}
    >
      <span className="text-xs text-muted-foreground px-1">
        {message.from} · {message.date}
      </span>
      <BubbleContent message={message} />
      <AttachmentList attachments={message.attachments} />
    </motion.div>
  );
}

export default function EmailViewerBody({ email }: { email: Email }) {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <motion.div
        key={email.id}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4"
      >
        {email.messages.map((m) => (
          <EmailBubble key={m.id} message={m} />
        ))}
      </motion.div>
      <ResponseInputField />
    </div>
  );
}
