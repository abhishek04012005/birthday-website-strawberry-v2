import type { Metadata } from 'next';
import '@/styles/globals.css';
import config from '@/data/config.json';
import BackgroundMusic from '@/components/BackgroundMusic';

export const metadata: Metadata = {
  title: `${config.child.name}'s Strawberry Birthday Party`,
  description: `Join us for the most magical ${config.child.name} celebration!`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <BackgroundMusic />
        {children}
      </body>
    </html>
  );
}
