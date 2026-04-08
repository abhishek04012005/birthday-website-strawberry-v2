import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCityBySlug, getCitySlug, getCitiesWithSlugs, digitalServices } from '@/data/cities';
import FloatingContactButton from '@/components/FloatingContactButton';
import styles from '@/styles/SectionPage.module.css';
import { FloatingButtons } from '@/components/FloatingButtons';

export const dynamic = 'force-dynamic';

interface ServiceCityPageProps {
  params: Promise<{
    service: string;
    city: string;
  }>;
}

function formatServiceName(service: string) {
  if (service === 'website') {
    return 'Birthday Website';
  }
  if (service === 'flyer-card') {
    return 'Flyer Card';
  }
  if (service === 'video') {
    return 'Video Production';
  }

  return service
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export async function generateMetadata({ params }: ServiceCityPageProps): Promise<Metadata> {
  const { service, city } = await params;
  const serviceData = digitalServices[service as keyof typeof digitalServices];
  const cityData = getCityBySlug(city);

  if (!serviceData || !cityData) {
    return {
      title: 'Service Not Found | Birthday Digital Services',
      description: 'The requested birthday digital service page could not be found.',
    };
  }

  const serviceLabel = formatServiceName(service);
  const baseDescription = `${serviceData.description} available in ${cityData.name}, ${cityData.state}.`;
  const citySlug = getCitySlug(cityData.name);

  return {
    title: `${serviceLabel} in ${cityData.name} | Birthday Digital Services`,
    description: `Get ${serviceLabel.toLowerCase()} services for birthdays in ${cityData.name}. ${baseDescription}`,
    keywords: [
      `${serviceLabel.toLowerCase()} ${cityData.name}`,
      `${serviceLabel.toLowerCase()} ${cityData.state}`,
      `birthday ${serviceLabel.toLowerCase()}`,
      `birthday ${serviceLabel.toLowerCase()} ${cityData.name}`,
      `birthday services ${cityData.name}`,
    ],
    openGraph: {
      title: `${serviceLabel} in ${cityData.name}`,
      description: `Book ${serviceLabel.toLowerCase()} services for birthdays in ${cityData.name}.`,
      url: `/service/${service}/${citySlug}`,
      siteName: 'Birthday Digital Services India',
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${serviceLabel} in ${cityData.name}`,
      description: `Book ${serviceLabel.toLowerCase()} services for birthdays in ${cityData.name}.`,
      images: ['/og-digital-service.jpg'],
    },
    alternates: {
      canonical: `/service/${service}/${citySlug}`,
    },
  };
}

export async function generateStaticParams() {
  const uniqueCities = Array.from(
    new Map(getCitiesWithSlugs().map((city) => [city.slug, city])).values(),
  );

  return Object.keys(digitalServices).flatMap((service) =>
    uniqueCities.map((city) => ({
      service,
      city: city.slug,
    })),
  );
}

export default async function ServiceCityPage({ params }: ServiceCityPageProps) {
  const { service, city } = await params;
  const serviceData = digitalServices[service as keyof typeof digitalServices];
  const cityData = getCityBySlug(city);

  if (!serviceData || !cityData) {
    notFound();
  }

  const serviceName = formatServiceName(service);

  return (
    <>
      {city !== 'patna' && <FloatingContactButton />}
      <main className={styles.pageWrapper}>
        <section className={styles.pageHero}>
        <div className={styles.pageHeroBody}>
          <p className={styles.pageEyebrow}>{serviceName} Services in {cityData.name}</p>
          <h1 className={styles.pageTitle}>{serviceData.heading} in {cityData.name}</h1>
          <p className={styles.pageCopy}>{serviceData.subHeading}</p>
        </div>
      </section>

      <section className={styles.pageContent}>
        <div className={styles.contentContainer}>
          <div className={styles.contentGrid}>
            <div className={styles.contentMain}>
              <h2>About Our {serviceName} Services in {cityData.name}</h2>
              <p className={styles.overviewText}>{serviceData.overview}</p>

              <div className={styles.serviceFeatures}>
                <h3>Why Choose Our {serviceName} Services?</h3>
                <ul className={styles.featuresList}>
                  <li>✅ Localized digital services for {cityData.name}</li>
                  <li>✅ Custom solutions for businesses and events</li>
                  <li>✅ Fast delivery with a focus on quality</li>
                  <li>✅ Mobile-friendly and SEO-ready results</li>
                  <li>✅ Expert support across major Indian cities</li>
                </ul>
              </div>

              <div className={styles.contactSection}>
                <h3>Get Started Today</h3>
                <p>Contact us to book your {serviceName.toLowerCase()} service in {cityData.name}.</p>
                <div className={styles.contactButtons}>
                  <a href="tel:+919285248504" className={styles.primaryButton}>
                    📞 Call Now: +91-9285248504
                  </a>
                  <a href="https://wa.me/919285248504" className={styles.secondaryButton}>
                    💬 WhatsApp Us
                  </a>
                </div>
                <p className={styles.contactLink}>
                  🌐 Website: <a href="https://birthday.ditvi.org" target="_blank" rel="noopener noreferrer">www.birthday.ditvi.org</a>
                </p>
              </div>
            </div>

            <div className={styles.contentSidebar}>
              <div className={styles.serviceCard}>
                <h4>Service Details</h4>
                <div className={styles.serviceInfo}>
                  <p><strong>📍 Location:</strong> {cityData.name}, {cityData.state}</p>
                  <p><strong>⏰ Service Hours:</strong> 9 AM - 9 PM</p>
                  <p><strong>🚚 Delivery:</strong> Available across {cityData.name}</p>
                  <p><strong>💳 Payment:</strong> Cash, UPI, Cards accepted</p>
                </div>
              </div>

              <div className={styles.popularServices}>
                <h4>Other Digital Services</h4>
                <ul className={styles.servicesList}>
                  {Object.keys(digitalServices).map((key) => (
                    <li key={key}>
                      <a href={`/service/${key}/${getCitySlug(cityData.name)}`}>{formatServiceName(key)}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <FloatingButtons />
    </main>
    </>
  );
}
