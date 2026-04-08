import type { Metadata } from 'next';
import config from '@/data/config.json';
import RSVPClient from './page.client';

export const metadata: Metadata = {
  title: `RSVP - Confirm Your Attendance for ${config.child.name}'s Party`,
  description: `Let us know if you're coming to ${config.child.name}'s strawberry-themed birthday party. RSVP now to reserve your seat and party surprises.`,
  keywords: [
    'RSVP',
    'birthday RSVP',
    'party attendance',
    `${config.child.name} party`,
    'kids party RSVP',
    'confirm attendance'
  ],
};

export default function RSVPPage() {
  return <RSVPClient />;
}
