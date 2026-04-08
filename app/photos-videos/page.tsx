import type { Metadata } from 'next';
import config from '@/data/config.json';
import PhotosVideosClient from './PhotosVideosClient';

export const metadata: Metadata = {
  title: `${config.child.name}'s Birthday Photos & Videos - Celebration Memories`,
  description: `Watch and download amazing photos and videos from ${config.child.name}'s birthday party! ${config.child.age} years of unforgettable moments captured beautifully.`,
  keywords: [
    `${config.child.name} birthday videos`,
    'birthday photos download',
    'party videos',
    'celebration memories',
    'birthday media',
    'kids party photos',
    'birthday video clips'
  ],
  openGraph: {
    title: `${config.child.name}'s Birthday Photos & Videos - Celebration Memories`,
    description: `Watch and download amazing photos and videos from ${config.child.name}'s birthday party!`,
    url: '/photos-videos',
    images: [
      {
        url: config.hero.photoUrl,
        width: 1200,
        height: 630,
        alt: `${config.child.name}'s Birthday Photos & Videos`,
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${config.child.name}'s Birthday Photos & Videos - Celebration Memories`,
    description: `Watch and download amazing photos and videos from ${config.child.name}'s birthday party!`,
    images: [config.hero.photoUrl],
  },
};

export default function PhotosVideosPage() {
  return <PhotosVideosClient />;
}
