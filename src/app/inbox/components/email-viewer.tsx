import type { Email } from '@/types/email';
import EmailViewerBody from './email-viewer-body';
import EmailViewerHeader from './email-viewer-header';

interface Props {
  email: Email | null;
}

function EmptyState() {
  return (
    <div className="bg-card text-muted-foreground text-md flex flex-1 items-center justify-center">
      Select an email to read
    </div>
  );
}

export default function EmailViewer({ email }: Props) {
  if (!email) return <EmptyState />;
  return (
    <div className="bg-card flex h-full flex-1 flex-col overflow-hidden">
      <EmailViewerHeader email={email} />
      <EmailViewerBody email={email} />
    </div>
  );
}
