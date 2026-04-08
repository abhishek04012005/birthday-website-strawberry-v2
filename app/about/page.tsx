import type { Metadata } from 'next';
import config from '@/data/config.json';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: `About ${config.child.name} - Meet the Birthday Star!`,
  description: `Learn all about ${config.child.name}! ${config.child.age} years of pure magic, mischief & mountains of chocolate. Discover ${config.child.name}'s personality, favorite things, and life stats.`,
  keywords: [
    `about ${config.child.name}`,
    `${config.child.name} personality`,
    'birthday child profile',
    'kids personality traits',
    `${config.child.name} facts`,
    'birthday celebration details',
    'family celebration'
  ],
  openGraph: {
    title: `About ${config.child.name} - Meet the Birthday Star!`,
    description: `${config.child.name} is turning ${config.child.age}! Learn about this amazing child's personality, favorite activities, and what makes them special.`,
    url: '/about',
    images: [
      {
        url: config.hero.photoUrl,
        width: 1200,
        height: 630,
        alt: `About ${config.child.name} - Birthday Profile`,
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `About ${config.child.name} - Meet the Birthday Star!`,
    description: `${config.child.name} is turning ${config.child.age}! Learn about this amazing child's personality and favorite things.`,
    images: [config.hero.photoUrl],
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
