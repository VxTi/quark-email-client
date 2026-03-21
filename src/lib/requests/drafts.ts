export interface DraftData {
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  body?: string;
}

export async function fetchDrafts(): Promise<DraftData[]> {
  const res = await fetch("/api/drafts");
  if (!res.ok) throw new Error("Failed to fetch drafts");
  return res.json();
}

export async function saveDraft(data: DraftData): Promise<DraftData> {
  const res = await fetch("/api/drafts", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to save draft");
  return res.json();
}
