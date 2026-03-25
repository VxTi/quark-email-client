import type { Email } from '@/types/email';

export const mockEmails: Email[] = [
  {
    id: '1',
    from: 'alice@example.com',
    to: 'me@example.com',
    subject: 'Q1 Project Update',
    bodyText: 'Sounds great, will do!',
    date: 'Mar 21',
    read: false,
    messages: [
      {
        id: '1-1',
        from: 'alice@example.com',
        date: 'Mar 21, 9:04 AM',
        isFromMe: false,
        body: '# Q1 Project Update\n\nHi,\n\nJust wanted to share the latest updates:\n\n- **Milestone 1** — completed ahead of schedule\n- **Milestone 2** — in progress, on track\n- **Milestone 3** — planning phase\n\nLet me know if you have any questions.\n\nBest,\nAlice',
        attachments: ['Q1_Report.pdf', 'Project_Timeline.xlsx'],
      },
      {
        id: '1-2',
        from: 'me@example.com',
        date: 'Mar 21, 10:32 AM',
        isFromMe: true,
        body: 'Thanks Alice! This looks great. Could you share more details on Milestone 2? Specifically, are there any blockers we should be aware of?',
      },
      {
        id: '1-3',
        from: 'alice@example.com',
        date: 'Mar 21, 11:15 AM',
        isFromMe: false,
        body: "No blockers at the moment! The team is on track. I'll send a more detailed update by end of week.\n\nSounds great, will do!",
      },
    ],
    tags: [
      { name: 'Work', color: '#E5E7EB' },
      { name: 'Urgent', color: '#FEE2E2' },
    ],
  },
  {
    id: '2',
    from: 'bob@example.com',
    to: 'me@example.com',
    subject: 'Lunch tomorrow?',
    bodyText: 'Are you free for lunch tomorrow around noon?',
    date: 'Mar 20',
    read: true,
    messages: [
      {
        id: '2-1',
        from: 'bob@example.com',
        date: 'Mar 20, 12:45 PM',
        isFromMe: false,
        body: 'Hey,\n\nAre you free for lunch tomorrow around noon? Was thinking of trying the new place on 5th.\n\nLet me know!\n\nBob',
      },
    ],
    tags: [{ name: 'Personal', color: '#FEF3C7' }],
  },
  {
    id: '3',
    from: 'noreply@github.com',
    to: 'me@example.com',
    subject: '[GitHub] Security alert',
    bodyText: 'A new login was detected for your account.',
    date: 'Mar 19',
    read: true,
    messages: [
      {
        id: '3-1',
        from: 'noreply@github.com',
        date: 'Mar 19, 2:15 PM',
        isFromMe: false,
        body: 'Hi,\n\nA new login was detected for your GitHub account. If this was you, you can safely ignore this message. If not, please change your password immediately.\n\nThanks,\nThe GitHub Team',
      },
    ],
    tags: [{ name: 'Security', color: '#FEE2E2' }],
  },
];
