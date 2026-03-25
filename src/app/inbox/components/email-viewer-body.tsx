'use client';
import { motion } from 'framer-motion';
import Markdown from 'react-markdown';
import { twMerge } from 'tailwind-merge';
import type { Email, EmailMessage } from '@/types/email';
import { sendEmail } from '@/lib/requests/mail';
import { toast } from 'sonner';
import { useCallback } from 'react';
import ResponseInputField from './reply-composer/response-input-field';

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
      className="bg-card border-border text-muted-foreground flex items-center gap-2 rounded-lg border px-3 py-2 text-xs"
    >
      <span>📎</span>
      <span className="truncate">{name}</span>
    </motion.div>
  );
}

function AttachmentList({ attachments }: { attachments?: string[] }) {
  if (!attachments?.length) return null;
  return (
    <motion.div
      variants={attachmentContainerVariants}
      className="mt-1 flex flex-wrap gap-2"
    >
      {attachments.map(a => (
        <Attachment key={a} name={a} />
      ))}
    </motion.div>
  );
}

function BubbleContent({ message }: { message: EmailMessage }) {
  return (
    <div
      className={twMerge(
        'rounded-2xl px-4 py-3 text-sm leading-relaxed',
        message.isFromMe
          ? 'bg-primary text-primary-foreground rounded-tr-sm'
          : 'bg-muted text-foreground rounded-tl-sm'
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
        `flex max-w-[75%] flex-col gap-1`,
        message.isFromMe ? 'items-end self-end' : 'items-start self-start'
      )}
    >
      <span className="text-muted-foreground px-1 text-xs">
        {message.from} · {message.date}
      </span>
      <BubbleContent message={message} />
      <AttachmentList attachments={message.attachments} />
    </motion.div>
  );
}

function useReplySend(email: Email) {
  return useCallback(
    async (body: string) => {
      try {
        await sendEmail({
          to: email.from,
          subject: `Re: ${email.subject}`,
          body,
        });
        toast.success('Reply sent');
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to send reply';
        toast.error(message);
        throw error;
      }
    },
    [email.from, email.subject]
  );
}

export default function EmailViewerBody({ email }: { email: Email }) {
  const onSend = useReplySend(email);
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col overflow-hidden">
      <motion.div
        key={email.id}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-4"
      >
        {email.messages.map(m => (
          <EmailBubble key={m.id} message={m} />
        ))}
      </motion.div>
      <ResponseInputField onSend={onSend} />
    </div>
  );
}
