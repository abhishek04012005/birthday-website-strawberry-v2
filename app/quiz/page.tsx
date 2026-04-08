import type { Metadata } from 'next';
import config from '@/data/config.json';
import QuizClient from './page.client';

export const metadata: Metadata = {
  title: `Quiz - How Well Do You Know ${config.child.name}?`,
  description: `Play ${config.child.name}'s fun birthday quiz and test your party knowledge. Earn a score and celebrate with the birthday star!`,
  keywords: [
    `${config.child.name} quiz`,
    'birthday quiz',
    'party quiz',
    'kids birthday quiz',
    'birthday party game',
    'quiz challenge'
  ],
};

export default function QuizPage() {
  return <QuizClient />;
}
