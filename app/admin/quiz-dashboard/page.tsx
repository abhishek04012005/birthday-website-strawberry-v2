import type { Metadata } from 'next';
import { Suspense } from 'react';
import config from '@/data/config.json';
import QuizDashboardClient from './page.client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: `Admin Quiz Dashboard - ${config.child.name}'s Birthday Stats`,
  description: `Admin page for tracking quiz progress and participant scores for ${config.child.name}'s birthday quiz.`,
  robots: {
    index: false,
    follow: false,
  },
};

export default function QuizDashboardPage() {
  return (
    <Suspense fallback={<div>Loading quiz dashboard...</div>}>
      <QuizDashboardClient />
    </Suspense>
  );
}
