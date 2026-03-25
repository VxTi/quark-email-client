'use client';
import { motion } from 'framer-motion';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { twMerge } from 'tailwind-merge';
import { InternalTag, type Email, type EmailMessage } from '@/types/email';
import { sendEmail, updateDraft } from '@/lib/requests/mail';
import { useEmails } from '@/lib/email-context';
import { toast } from 'sonner';
import { type JSX, useCallback, useState } from 'react';
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

const allowedHtmlTags: (keyof JSX.IntrinsicElements)[] = [
  'div',
  'p',
  'li',
  'ul',
  'ol',
  'span',
  'b',
  'i',
  'strong',
  'em',
  'a',
  'br',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'blockquote',
  'code',
  'pre',
  'hr',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
  'img',
];

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
          ? 'bg-background text-foreground rounded-tr-sm'
          : 'bg-muted text-foreground rounded-tl-sm'
      )}
    >
      <Markdown allowedElements={allowedHtmlTags} rehypePlugins={[rehypeRaw]}>
        {message.body}
      </Markdown>
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

function combineBodyHtml(messages: EmailMessage[]) {
  return messages.map(m => m.body).join('\n\n');
}

function buildNewMessage(email: Email, body: string): EmailMessage {
  return {
    id: `${email.id}-${email.messages.length}`,
    from: email.from,
    date: new Date().toLocaleString(),
    body,
    isFromMe: true,
  };
}

function useReplySend(email: Email) {
  return useCallback(
    async (body: string) => {
      try {
        await sendEmail({
          to: email.from,
          subject: `Re: ${email.subject}`,
          bodyHtml: body,
        });
        toast.success('Reply sent');
      } catch (error) {
        const msg =
          error instanceof Error ? error.message : 'Failed to send reply';
        toast.error(msg);
        throw error;
      }
    },
    [email.from, email.subject]
  );
}

function useDraftSend(email: Email) {
  const { deleteEmails } = useEmails();
  const [sending, setSending] = useState(false);

  const send = useCallback(async () => {
    setSending(true);
    try {
      await sendEmail({
        to: email.to,
        cc: email.cc,
        bcc: email.bcc,
        subject: email.subject,
        bodyHtml: combineBodyHtml(email.messages),
        draftId: email.id,
      });
      deleteEmails([email.id]);
      toast.success('Draft sent');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to send';
      toast.error(msg);
    } finally {
      setSending(false);
    }
  }, [email, deleteEmails]);

  return { send, sending };
}

function useDraftAppend(email: Email) {
  const { updateEmail, deleteEmails } = useEmails();

  return useCallback(
    async (body: string) => {
      const newMsg = buildNewMessage(email, body);
      const updated = [...email.messages, newMsg];
      updateEmail(email.id, {
        messages: updated,
        bodyHtml: combineBodyHtml(updated),
      });

      await updateDraft(email.id, { bodyHtml: combineBodyHtml(updated) });

      try {
        await sendEmail({
          to: email.to,
          cc: email.cc,
          bcc: email.bcc,
          subject: email.subject,
          bodyHtml: combineBodyHtml(updated),
          draftId: email.id,
        });
        deleteEmails([email.id]);
        toast.success('Draft sent');
      } catch {
        toast.error('Failed to send — draft saved');
      }
    },
    [email, updateEmail, deleteEmails]
  );
}

function SendDraftButton({ email }: { email: Email }) {
  const { send, sending } = useDraftSend(email);
  return (
    <motion.div variants={itemVariants} className="self-end px-1">
      <button
        type="button"
        onClick={send}
        disabled={sending}
        className="bg-background text-foreground hover:bg-hover disabled:bg-hover/50 rounded-full rounded-lg px-4 py-2 text-sm font-medium transition-colors"
      >
        {sending ? 'Sending...' : 'Send Draft'}
      </button>
    </motion.div>
  );
}

export default function EmailViewerBody({ email }: { email: Email }) {
  const isDraft = email.internalTag === InternalTag.Draft;
  const onReply = useReplySend(email);
  const onAppend = useDraftAppend(email);

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
        {isDraft && <SendDraftButton email={email} />}
      </motion.div>
      <ResponseInputField onSend={isDraft ? onAppend : onReply} />
    </div>
  );
}
