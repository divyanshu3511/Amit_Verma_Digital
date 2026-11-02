import { ContactMessage } from '../models/contact-message.model';

export const MOCK_MESSAGES: ContactMessage[] = [
  {
    id: 1,
    name: 'Rahul Sharma',
    email: 'rahul.creator@gmail.com',
    subject: 'Facebook Page Monetization Criteria Audit',
    message: 'Namaste Amit bhai, I have 4,200 followers and 48,000 watch minutes. Could you guide me on how to unlock the in-stream ads criteria cleanly without violation?',
    ipAddress: '103.25.44.12',
    isRead: false,
    createdAtUtc: '2026-10-26T14:30:00Z'
  },
  {
    id: 2,
    name: 'Pooja Verma',
    email: 'pooja.reels@outlook.com',
    subject: 'Brand Collaboration on Facebook Reels',
    message: 'Hello Amit, our digital tools brand would love to sponsor a dedicated 60-second Reel showcasing our creator software. Let us know your rates and collaboration availability.',
    ipAddress: '49.36.120.88',
    isRead: false,
    createdAtUtc: '2026-10-27T09:15:00Z'
  },
  {
    id: 3,
    name: 'Vikas Gupta',
    email: 'vikas.media@yahoo.com',
    subject: 'Speaking Session on Creator Growth in Lucknow',
    message: 'Hi Amit, we are organizing a digital marketing summit in Gomti Nagar, Lucknow and would be honored to have you as a keynote speaker on Reels virality.',
    ipAddress: '106.215.8.5',
    isRead: true,
    createdAtUtc: '2026-10-24T18:00:00Z'
  }
];
