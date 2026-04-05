import { Suspense } from 'react';
import QuizSettingsClient from './page.client';

export const dynamic = 'force-dynamic';

export default function QuizSettingsPage() {
  return (
    <Suspense fallback={<div>Loading quiz settings...</div>}>
      <QuizSettingsClient />
    </Suspense>
  );
}
