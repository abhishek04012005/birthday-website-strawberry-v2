import type { Metadata } from 'next';
import config from '@/data/config.json';
import AdminWishesClient from './page.client';

export const metadata: Metadata = {
  title: `Admin Wishes - Manage ${config.child.name}'s Birthday Messages`,
  description: `Admin-only page to review, approve, and hide birthday wishes for ${config.child.name}'s celebration.`,
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminWishesPage() {
  return <AdminWishesClient />;
}
