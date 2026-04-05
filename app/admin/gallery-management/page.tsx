import { Suspense } from 'react';
import GalleryManagementClient from './page.client';

export const dynamic = 'force-dynamic';

export default function GalleryManagementPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GalleryManagementClient />
    </Suspense>
  );
}
