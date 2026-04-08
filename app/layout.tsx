import type { Metadata } from 'next';
import '@/styles/globals.css';
import config from '@/data/config.json';
import BackgroundMusic from '@/components/BackgroundMusic';

export const metadata: Metadata = {
  title: {
    default: `${config.child.name}'s Strawberry Birthday Party - Join the Celebration!`,
    template: `%s | ${config.child.name}'s Birthday Party`
  },
  description: `Join us for the most magical ${config.child.name} celebration! ${config.child.age} years of pure magic, mischief & mountains of chocolate. ${config.party.date} at ${config.party.venue}.`,
  keywords: [
    'birthday party',
    `${config.child.name} birthday`,
    'children birthday',
    'strawberry theme party',
    'birthday celebration',
    'kids party',
    'birthday invitation',
    'party RSVP',
    'birthday games',
    'birthday cake'
  ],
  authors: [{ name: 'Birthday Party Team' }],
  creator: 'Birthday Party Team',
  publisher: 'Birthday Party Team',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://emma-birthday-party.com'), // Replace with actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${config.child.name}'s Strawberry Birthday Party`,
    description: `Join us for the most magical ${config.child.name} celebration! ${config.child.age} years of pure magic, mischief & mountains of chocolate.`,
    url: '/',
    siteName: `${config.child.name}'s Birthday Party`,
    images: [
      {
        url: config.hero.photoUrl,
        width: 1200,
        height: 630,
        alt: `${config.child.name}'s Birthday Party`,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${config.child.name}'s Strawberry Birthday Party`,
    description: `Join us for the most magical ${config.child.name} celebration! ${config.child.age} years of pure magic, mischief & mountains of chocolate.`,
    images: [config.hero.photoUrl],
    creator: '@birthdayparty', // Replace with actual Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-code', // Replace with actual verification code
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": `${config.child.name}'s Strawberry Birthday Party`,
    "description": `Join us for the most magical ${config.child.name} celebration! ${config.child.age} years of pure magic, mischief & mountains of chocolate.`,
    "startDate": `${config.party.date}T15:00:00-05:00`, // Assuming 3 PM EST
    "endDate": `${config.party.date}T18:00:00-05:00`, // Assuming 6 PM EST
    "location": {
      "@type": "Place",
      "name": config.party.venue,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": config.party.address,
        "addressLocality": "New York",
        "addressRegion": "NY",
        "postalCode": "10024",
        "addressCountry": "US"
      }
    },
    "organizer": {
      "@type": "Person",
      "name": "Birthday Party Team"
    },
    "image": config.hero.photoUrl,
    "url": "https://emma-birthday-party.com", // Replace with actual domain
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled"
  };

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content={config.child.color.primary} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body>
        <BackgroundMusic />
        {children}
      </body>
    </html>
  );
}
