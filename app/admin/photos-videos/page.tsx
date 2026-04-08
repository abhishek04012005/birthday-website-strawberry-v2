import type { Metadata } from 'next';
import { Suspense } from 'react';
import config from '@/data/config.json';
import PhotosVideosClient from './page.client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: `Admin Photos & Videos - ${config.child.name}'s Celebration Media`,
  description: `Admin page for managing photos and videos of ${config.child.name}'s birthday celebration.`,
  robots: {
    index: false,
    follow: false,
  },
};

export default function PhotosVideosPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PhotosVideosClient />
    </Suspense>
  );
}
