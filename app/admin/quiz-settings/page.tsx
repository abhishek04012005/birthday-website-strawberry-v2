import type { Metadata } from 'next';
import { Suspense } from 'react';
import config from '@/data/config.json';
import QuizSettingsClient from './page.client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: `Admin Quiz Settings - ${config.child.name}'s Party Quiz`,
  description: `Configure and manage the birthday quiz questions for ${config.child.name}'s celebration. Admin access only.`,
  robots: {
    index: false,
    follow: false,
  },
};

export default function QuizSettingsPage() {
  return (
    <Suspense fallback={<div>Loading quiz settings...</div>}>
      <QuizSettingsClient />
    </Suspense>
  );
}
