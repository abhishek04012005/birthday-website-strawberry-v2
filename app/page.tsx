import type { Metadata } from 'next';
import config from '@/data/config.json';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: `${config.child.name}'s Strawberry Birthday Party - Join the Magical Celebration!`,
  description: `🎉 Join us for ${config.child.name}'s ${config.child.age}th birthday party! ${config.child.age} years of pure magic, mischief & mountains of chocolate. ${config.party.date} at ${config.party.venue}. RSVP now!`,
  keywords: [
    `${config.child.name} birthday party`,
    'children birthday celebration',
    'strawberry theme party',
    'kids birthday invitation',
    'birthday RSVP',
    'birthday games',
    'birthday cake',
    'family celebration',
    'birthday party activities'
  ],
  openGraph: {
    title: `${config.child.name}'s Strawberry Birthday Party`,
    description: `Join us for the most magical ${config.child.name} celebration! ${config.child.age} years of pure magic, mischief & mountains of chocolate.`,
    url: '/',
    images: [
      {
        url: config.hero.photoUrl,
        width: 1200,
        height: 630,
        alt: `${config.child.name}'s Birthday Party Invitation`,
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${config.child.name}'s Strawberry Birthday Party`,
    description: `Join us for the most magical ${config.child.name} celebration! ${config.child.age} years of pure magic, mischief & mountains of chocolate.`,
    images: [config.hero.photoUrl],
  },
};

export default function Home() {
  return <HomeClient />;
}
