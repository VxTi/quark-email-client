import { boolean, integer, pgEnum, pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";
import { FolderType, InternalTag } from "@/types/email";

export const internalTagEnum = pgEnum("internal_tag", [
  InternalTag.Inbox,
  InternalTag.Sent,
  InternalTag.Draft,
  InternalTag.Trash,
] as [InternalTag, ...InternalTag[]]);

export const folderTypeEnum = pgEnum("folder_type", [
  FolderType.Inbox,
  FolderType.Sent,
  FolderType.Drafts,
  FolderType.Trash,
  FolderType.Spam,
  FolderType.Archive,
  FolderType.Custom,
] as [FolderType, ...FolderType[]]);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  twoFactorEnabled: boolean("two_factor_enabled"),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  displayName: text("display_name").notNull().default(""),
  imapHost: text("imap_host"),
  imapPort: integer("imap_port"),
  imapSecure: boolean("imap_secure").default(true),
  smtpHost: text("smtp_host"),
  smtpPort: integer("smtp_port"),
  smtpSecure: boolean("smtp_secure").default(true),
  encryptedAccessToken: text("encrypted_access_token"),
  encryptedRefreshToken: text("encrypted_refresh_token"),
  tokenExpiresAt: timestamp("token_expires_at"),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const passkey = pgTable("passkey", {
  id: text("id").primaryKey(),
  name: text("name"),
  publicKey: text("public_key").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  credentialID: text("credential_id").notNull(),
  counter: integer("counter").notNull(),
  deviceType: text("device_type").notNull(),
  backedUp: boolean("backed_up").notNull(),
  transports: text("transports"),
  createdAt: timestamp("created_at", { precision: 6, withTimezone: true }),
  aaguid: text("aaguid"),
});

export const tag = pgTable("tag", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull().default("#E5E7EB"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull(),
});

export const folder = pgTable(
  "folder",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id")
      .notNull()
      .references(() => account.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    path: text("path").notNull(),
    type: folderTypeEnum("type").notNull().default(FolderType.Custom),
    uidValidity: text("uid_validity"),
    uidNext: text("uid_next"),
    totalMessages: integer("total_messages").notNull().default(0),
    unreadMessages: integer("unread_messages").notNull().default(0),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (t) => [unique("folder_account_path_unq").on(t.accountId, t.path)],
);

export const email = pgTable(
  "email",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accountId: text("account_id").references(() => account.id, { onDelete: "cascade" }),
    folderId: text("folder_id").references(() => folder.id, { onDelete: "set null" }),
    tagId: text("tag_id").references(() => tag.id, { onDelete: "set null" }),
    internalTag: internalTagEnum("internal_tag").notNull().default(InternalTag.Draft),
    uid: text("uid"),
    messageId: text("message_id"),
    fromAddress: text("from_address").notNull().default(""),
    fromName: text("from_name").notNull().default(""),
    to: text("to").notNull().default(""),
    cc: text("cc").notNull().default(""),
    bcc: text("bcc").notNull().default(""),
    subject: text("subject").notNull().default(""),
    preview: text("preview").notNull().default(""),
    body: text("body").notNull().default(""),
    bodyHtml: text("body_html"),
    bodyText: text("body_text"),
    read: boolean("read").notNull().default(false),
    starred: boolean("starred").notNull().default(false),
    hasAttachments: boolean("has_attachments").notNull().default(false),
    flags: text("flags"),
    date: timestamp("date"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (t) => [unique("email_folder_uid_unq").on(t.folderId, t.uid)],
);

export const attachment = pgTable("attachment", {
  id: text("id").primaryKey(),
  emailId: text("email_id").references(() => email.id, { onDelete: "cascade" }),
  filename: text("filename").notNull(),
  contentType: text("content_type").notNull(),
  size: integer("size").notNull(),
  contentId: text("content_id"),
  storageKey: text("storage_key").notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export type Account = typeof account.$inferSelect;
export type Folder = typeof folder.$inferSelect;
export type Email = typeof email.$inferSelect;
export type Attachment = typeof attachment.$inferSelect;
