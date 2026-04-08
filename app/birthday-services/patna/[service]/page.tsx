import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { patnaBirthdayServices } from '@/data/cities';
import PatnaServiceClient from './PatnaServiceClient';

interface PageProps {
  params: Promise<{ service: string }>;
}

// Generate metadata for each service
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { service } = await params;
  const serviceData = patnaBirthdayServices[service as keyof typeof patnaBirthdayServices];

  if (!serviceData) {
    return {
      title: 'Service Not Found - Birthday Services Patna',
    };
  }

  return {
    title: serviceData.title,
    description: serviceData.description,
    keywords: [
      'birthday services Patna',
      'party planning Patna',
      'birthday cakes Patna',
      'party decorations Patna',
      'birthday venues Patna',
      'event planning Patna',
      service.replace(/([A-Z])/g, ' $1').toLowerCase(),
      'Patna Bihar',
      'kids birthday',
      'birthday celebration'
    ],
    openGraph: {
      title: serviceData.title,
      description: serviceData.description,
      url: `/birthday-services/patna/${service}`,
      siteName: 'Birthday Services Patna',
      locale: 'en_IN',
      type: 'website',
      images: [
        {
          url: '/og-birthday-patna.jpg',
          width: 1200,
          height: 630,
          alt: `Birthday ${service.replace(/([A-Z])/g, ' $1').toLowerCase()} in Patna`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: serviceData.title,
      description: serviceData.description,
      images: ['/og-birthday-patna.jpg'],
    },
    alternates: {
      canonical: `/birthday-services/patna/${service}`,
    },
    other: {
      'geo.region': 'IN-BR',
      'geo.placename': 'Patna, Bihar',
      'geo.position': '25.5941;85.1376',
      'ICBM': '25.5941, 85.1376',
    },
  };
}

// Generate static params for all services
export async function generateStaticParams() {
  return Object.keys(patnaBirthdayServices).map((service) => ({
    service,
  }));
}

export default async function PatnaServicePage({ params }: PageProps) {
  const { service } = await params;
  const serviceData = patnaBirthdayServices[service as keyof typeof patnaBirthdayServices];

  if (!serviceData) {
    notFound();
  }

  return <PatnaServiceClient serviceKey={service} serviceData={serviceData} />;
}