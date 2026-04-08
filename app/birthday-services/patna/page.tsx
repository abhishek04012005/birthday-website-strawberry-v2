import type { Metadata } from 'next';
import { patnaBirthdayServiceUrls, patnaBirthdayMetadata } from '@/data/cities';
import PatnaServicesClient from './PatnaServicesClient';

export const metadata: Metadata = {
  title: patnaBirthdayMetadata.title,
  description: patnaBirthdayMetadata.description,
  keywords: [
    'birthday services Patna',
    'party planning Patna',
    'birthday cakes Patna',
    'party decorations Patna',
    'birthday venues Patna',
    'event planning Patna',
    'kids birthday Patna',
    'birthday celebration Patna',
    'Patna Bihar birthday services'
  ],
  openGraph: {
    title: patnaBirthdayMetadata.title,
    description: patnaBirthdayMetadata.description,
    url: '/birthday-services/patna',
    siteName: 'Birthday Services Patna',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/og-birthday-patna.jpg',
        width: 1200,
        height: 630,
        alt: 'Birthday Services in Patna - Complete Party Planning',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: patnaBirthdayMetadata.title,
    description: patnaBirthdayMetadata.description,
    images: ['/og-birthday-patna.jpg'],
  },
  alternates: {
    canonical: '/birthday-services/patna',
  },
  other: {
    'geo.region': 'IN-BR',
    'geo.placename': 'Patna, Bihar',
    'geo.position': '25.5941;85.1376',
    'ICBM': '25.5941, 85.1376',
  },
};

export default function PatnaBirthdayServicesPage() {
  return <PatnaServicesClient services={patnaBirthdayServiceUrls} />;
}