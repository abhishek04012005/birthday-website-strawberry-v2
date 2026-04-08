import type { Metadata } from 'next';
import config from '@/data/config.json';
import GalleryClient from './GalleryClient';

export const metadata: Metadata = {
  title: `${config.child.name}'s Birthday Gallery - Photo Memories`,
  description: `Browse beautiful photos and memories from ${config.child.name}'s birthday celebration! ${config.child.age} years of magical moments captured in stunning images.`,
  keywords: [
    `${config.child.name} birthday photos`,
    'birthday gallery',
    'party photos',
    'birthday memories',
    'celebration pictures',
    'kids birthday images'
  ],
  openGraph: {
    title: `${config.child.name}'s Birthday Gallery - Photo Memories`,
    description: `Browse beautiful photos and memories from ${config.child.name}'s birthday celebration!`,
    url: '/gallery',
    images: [
      {
        url: config.hero.photoUrl,
        width: 1200,
        height: 630,
        alt: `${config.child.name}'s Birthday Gallery`,
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${config.child.name}'s Birthday Gallery - Photo Memories`,
    description: `Browse beautiful photos and memories from ${config.child.name}'s birthday celebration!`,
    images: [config.hero.photoUrl],
  },
};

export default function GalleryPage() {
  return <GalleryClient />;
}
