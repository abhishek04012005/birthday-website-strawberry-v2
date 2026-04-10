'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function QuizSettingsClient() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to quiz dashboard since settings are now integrated there
    router.replace('/admin/quiz-dashboard?tab=settings');
  }, [router]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <p>Redirecting to Quiz Dashboard...</p>
    </div>
  );
}
