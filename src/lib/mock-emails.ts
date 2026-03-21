import type { Email } from "@/types/email";

export const mockEmails: Email[] = [
  {
    id: "1",
    from: "alice@example.com",
    to: "me@example.com",
    subject: "Q1 Project Update",
    preview: "Sounds great, will do!",
    date: "Mar 21",
    read: false,
    messages: [
      {
        id: "1-1",
        from: "alice@example.com",
        date: "Mar 21, 9:04 AM",
        isFromMe: false,
        body: "# Q1 Project Update\n\nHi,\n\nJust wanted to share the latest updates:\n\n- **Milestone 1** — completed ahead of schedule\n- **Milestone 2** — in progress, on track\n- **Milestone 3** — planning phase\n\nLet me know if you have any questions.\n\nBest,\nAlice",
        attachments: ["Q1_Report.pdf", "Project_Timeline.xlsx"],
      },
      {
        id: "1-2",
        from: "me@example.com",
        date: "Mar 21, 10:32 AM",
        isFromMe: true,
        body: "Thanks Alice! This looks great. Could you share more details on Milestone 2? Specifically, are there any blockers we should be aware of?",
      },
      {
        id: "1-3",
        from: "alice@example.com",
        date: "Mar 21, 11:15 AM",
        isFromMe: false,
        body: "No blockers at the moment! The team is on track. I'll send a more detailed update by end of week.\n\nSounds great, will do!",
      },
    ],
  },
  {
    id: "2",
    from: "bob@example.com",
    to: "me@example.com",
    subject: "Lunch tomorrow?",
    preview: "Are you free for lunch tomorrow around noon?",
    date: "Mar 20",
    read: true,
    messages: [
      {
        id: "2-1",
        from: "bob@example.com",
        date: "Mar 20, 12:45 PM",
        isFromMe: false,
        body: "Hey,\n\nAre you free for lunch tomorrow around noon? Was thinking of trying the new place on 5th.\n\nLet me know!\n\nBob",
      },
    ],
  },
  {
    id: "3",
    from: "noreply@github.com",
    to: "me@example.com",
    subject: "[GitHub] Your pull request was merged",
    preview: "Pull request #42 'feat: add email viewer' was merged into main.",
    date: "Mar 19",
    read: true,
    messages: [
      {
        id: "3-1",
        from: "noreply@github.com",
        date: "Mar 19, 3:12 PM",
        isFromMe: false,
        body: "## Pull Request Merged\n\nYour pull request **#42** `feat: add email viewer` was successfully merged into `main`.\n\n[View on GitHub →](https://github.com)",
      },
    ],
  },
  {
    id: "4",
    from: "carol@example.com",
    to: "me@example.com",
    subject: "Design feedback",
    preview: "I reviewed the latest mockups — a few things I'd like to discuss.",
    date: "Mar 18",
    read: false,
    messages: [
      {
        id: "4-1",
        from: "carol@example.com",
        date: "Mar 18, 2:00 PM",
        isFromMe: false,
        body: "# Design Feedback\n\nI reviewed the latest mockups. Overall they look great, but a few things:\n\n1. The sidebar width feels too narrow on mobile\n2. The email list item spacing could be more generous\n3. The yellow accent is subtle — I like it\n\nCan we sync this week?\n\nCarol",
        attachments: ["mockup_v3.fig", "feedback_notes.pdf"],
      },
    ],
  },
];
