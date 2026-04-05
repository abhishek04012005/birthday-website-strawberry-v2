import { Suspense } from 'react';
import PhotosVideosClient from './page.client';

export const dynamic = 'force-dynamic';

export default function PhotosVideosPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PhotosVideosClient />
    </Suspense>
  );
}
