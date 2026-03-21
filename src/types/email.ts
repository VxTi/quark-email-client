export enum InternalTag {
  Inbox = "inbox",
  Sent = "sent",
  Draft = "draft",
  Trash = "trash",
}

export interface Tag {
  name: string;
  color: string;
}

export type ActiveFilter =
  | { kind: "mailbox"; value: InternalTag }
  | { kind: "tag"; value: string }
  | null;

export interface EmailMessage {
  id: string;
  from: string;
  date: string;
  body: string;
  isFromMe: boolean;
  attachments?: string[];
}

export interface Email {
  id: string;
  from: string;
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  preview: string;
  body?: string;
  date: string;
  read: boolean;
  messages: EmailMessage[];
  tags: Tag[];
  tagId?: string;
  internalTag?: InternalTag;
}
