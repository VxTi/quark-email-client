import type { Email } from "@/types/email";
import EmailViewerHeader from "./EmailViewerHeader";
import EmailViewerBody from "./EmailViewerBody";

interface Props { email: Email | null; }

function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
      Select an email to read
    </div>
  );
}

export default function EmailViewer({ email }: Props) {
  if (!email) return <EmptyState />;
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <EmailViewerHeader email={email} />
      <EmailViewerBody email={email} />
    </div>
  );
}
