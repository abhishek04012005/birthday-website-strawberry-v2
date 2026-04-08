import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Birthday Services in Patna | Complete Party Planning & Celebration',
  description: 'Professional birthday party services in Patna including planning, cakes, decorations, venues, photography, entertainment & catering. Make every birthday celebration magical.',
  keywords: [
    'birthday services Patna',
    'party planning Patna',
    'birthday cakes Patna',
    'party decorations Patna',
    'birthday venues Patna',
    'event planning Patna',
    'kids birthday Patna'
  ],
  openGraph: {
    title: 'Birthday Services in Patna | Complete Party Planning',
    description: 'Professional birthday party services in Patna for magical celebrations.',
    url: '/birthday-services/patna',
    siteName: 'Birthday Services Patna',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Birthday Services in Patna | Complete Party Planning',
    description: 'Professional birthday party services in Patna for magical celebrations.',
  },
  alternates: {
    canonical: '/birthday-services/patna',
  },
};

export default function PatnaBirthdayServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="birthday-services-layout">
      {children}
    </div>
  );
}