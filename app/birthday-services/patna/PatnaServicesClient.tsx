'use client';

import React from 'react';
import Link from 'next/link';
import styles from '@/styles/SectionPage.module.css';

interface ServiceUrl {
  service: string;
  title: string;
  description: string;
  url: string;
}

interface PatnaServicesClientProps {
  services: ServiceUrl[];
}

export default function PatnaServicesClient({ services }: PatnaServicesClientProps) {
  const getServiceIcon = (service: string) => {
    const icons: Record<string, string> = {
      birthdayPartyPlanning: '🎉',
      birthdayCakeDelivery: '🎂',
      birthdayDecorations: '🎈',
      birthdayVenues: '🏰',
      birthdayPhotography: '📸',
      birthdayEntertainment: '🎪',
      birthdayInvitations: '💌',
      birthdayCatering: '🍽️',
    };
    return icons[service] || '🎊';
  };

  const getServiceName = (service: string) => {
    return service.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  return (
    <main className={styles.pageWrapper}>
      <section className={styles.pageHero}>
        <div className={styles.pageHeroBody}>
          <p className={styles.pageEyebrow}>Birthday Services</p>
          <h1 className={styles.pageTitle}>Complete Birthday Party Services in Patna</h1>
          <p className={styles.pageCopy}>
            Make your child's birthday celebration magical with our comprehensive party planning services in Patna, Bihar.
            From planning to execution, we handle everything!
          </p>
        </div>
      </section>

      <section className={styles.pageContent}>
        <div className={styles.contentContainer}>
          <div className={styles.servicesGrid}>
            {services.map((service) => (
              <div key={service.service} className={styles.serviceCard}>
                <div className={styles.serviceIcon}>
                  {getServiceIcon(service.service)}
                </div>
                <h3 className={styles.serviceTitle}>
                  <Link href={service.url}>
                    {getServiceName(service.service)}
                  </Link>
                </h3>
                <p className={styles.serviceDescription}>
                  {service.description.substring(0, 120)}...
                </p>
                <Link href={service.url} className={styles.serviceLink}>
                  Learn More →
                </Link>
              </div>
            ))}
          </div>

          <div className={styles.ctaSection}>
            <div className={styles.ctaContent}>
              <h2>Ready to Plan an Unforgettable Birthday Party?</h2>
              <p>
                Contact our expert team in Patna for personalized birthday party planning.
                We make every celebration special and memorable.
              </p>
              <div className={styles.ctaButtons}>
                <a href="tel:+919285248504" className={styles.primaryButton}>
                  📞 Call Now: +91-9285248504
                </a>
                <a href="https://wa.me/919285248504" className={styles.secondaryButton}>
                  💬 WhatsApp Us
                </a>
              </div>
              <p className={styles.websiteLink}>
                🌐 Website: <a href="https://birthdaywebsite.com" target="_blank" rel="noopener noreferrer">birthdaywebsite.com</a>
              </p>
            </div>
          </div>

          <div className={styles.whyChooseUs}>
            <h2>Why Choose Our Birthday Services in Patna?</h2>
            <div className={styles.benefitsGrid}>
              <div className={styles.benefit}>
                <div className={styles.benefitIcon}>🏆</div>
                <h4>Expert Team</h4>
                <p>Professional event planners with years of experience in Patna</p>
              </div>
              <div className={styles.benefit}>
                <div className={styles.benefitIcon}>💰</div>
                <h4>Affordable Pricing</h4>
                <p>Competitive rates without compromising on quality</p>
              </div>
              <div className={styles.benefit}>
                <div className={styles.benefitIcon}>⚡</div>
                <h4>Quick Service</h4>
                <p>Fast response and timely delivery across Patna</p>
              </div>
              <div className={styles.benefit}>
                <div className={styles.benefitIcon}>🎯</div>
                <h4>Customized Solutions</h4>
                <p>Tailored services to match your specific requirements</p>
              </div>
              <div className={styles.benefit}>
                <div className={styles.benefitIcon}>⭐</div>
                <h4>Quality Guarantee</h4>
                <p>100% satisfaction guarantee on all our services</p>
              </div>
              <div className={styles.benefit}>
                <div className={styles.benefitIcon}>📍</div>
                <h4>Local Expertise</h4>
                <p>In-depth knowledge of Patna venues and services</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}