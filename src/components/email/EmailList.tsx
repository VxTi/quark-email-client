import type { Email } from "@/types/email";
import EmailListItem from "./EmailListItem";

interface Props {
  emails: Email[];
  selectedId?: string;
  onSelect: (email: Email) => void;
}

function EmailListHeader() {
  return (
    <div className="px-4 py-3 border-b border-border shrink-0">
      <h2 className="font-semibold text-text text-sm">Inbox</h2>
    </div>
  );
}

export default function EmailList({ emails, selectedId, onSelect }: Props) {
  return (
    <div className="w-80 h-full flex flex-col border-r border-border overflow-y-auto shrink-0">
      <EmailListHeader />
      {emails.map((email) => (
        <EmailListItem key={email.id} email={email} selected={email.id === selectedId} onClick={() => onSelect(email)} />
      ))}
    </div>
  );
}
