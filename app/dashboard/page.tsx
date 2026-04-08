import type { Metadata } from 'next';
import DashboardClient from './DashboardClient';

export const metadata: Metadata = {
  title: 'Dashboard - Birthday Party Management',
  description: 'Admin dashboard for managing RSVPs, wishes, and party details.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function DashboardPage() {
  return <DashboardClient />;
}
