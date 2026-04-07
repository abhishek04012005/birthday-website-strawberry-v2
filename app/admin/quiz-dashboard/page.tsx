import { Suspense } from 'react';
import QuizDashboardClient from './page.client';

export const dynamic = 'force-dynamic';

export default function QuizDashboardPage() {
  return (
    <Suspense fallback={<div>Loading quiz dashboard...</div>}>
      <QuizDashboardClient />
    </Suspense>
  );
}
