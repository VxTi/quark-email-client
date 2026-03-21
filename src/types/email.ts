export interface Tag {
  name: string;
  color: string;
}

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
  internalTag?: "trash" | "draft" | "sent" | "inbox";
}
