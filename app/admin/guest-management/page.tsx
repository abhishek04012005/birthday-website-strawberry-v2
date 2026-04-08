import type { Metadata } from 'next';
import { Suspense } from 'react';
import config from '@/data/config.json';
import GuestManagementClient from './page.client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: `Admin Guest Management - ${config.child.name}'s Birthday RSVP`,
  description: `Admin dashboard for managing guest RSVPs and party attendance for ${config.child.name}'s celebration.`,
  robots: {
    index: false,
    follow: false,
  },
};

export default function GuestManagementPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GuestManagementClient />
    </Suspense>
  );
}