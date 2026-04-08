import type { Metadata } from 'next';
import config from '@/data/config.json';
import WishesClient from './page.client';

export const metadata: Metadata = {
  title: `Birthday Wishes - Send Love to ${config.child.name}`,
  description: `Share your birthday wish for ${config.child.name} and celebrate her special day with a heartfelt message.`,
  keywords: [
    'birthday wishes',
    `${config.child.name} wishes`,
    'send birthday wish',
    'wish message',
    'happy birthday message'
  ],
};

export default function WishesPage() {
  return <WishesClient />;
}
