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
  subject: string;
  preview: string;
  date: string;
  read: boolean;
  messages: EmailMessage[];
  tags: Tag[];
}
