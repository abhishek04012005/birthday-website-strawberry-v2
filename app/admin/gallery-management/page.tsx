import type { Metadata } from 'next';
import { Suspense } from 'react';
import config from '@/data/config.json';
import GalleryManagementClient from './page.client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: `Admin Gallery Management - ${config.child.name}'s Party Media`,
  description: `Admin page to manage gallery and media content for ${config.child.name}'s birthday party.`,
  robots: {
    index: false,
    follow: false,
  },
};

export default function GalleryManagementPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GalleryManagementClient />
    </Suspense>
  );
}
