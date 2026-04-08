'use client';

import React from 'react';
import { ServiceMetadata } from '@/data/cities';
import styles from '@/styles/SectionPage.module.css';
import { FloatingButtons } from '@/components/FloatingButtons';

interface PatnaServiceClientProps {
  serviceKey: string;
  serviceData: ServiceMetadata;
}

export default function PatnaServiceClient({ serviceKey, serviceData }: PatnaServiceClientProps) {
  const serviceName = serviceKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

  return (
    <>
      <main className={styles.pageWrapper}>
        <section className={styles.pageHero}>
          <div className={styles.pageHeroBody}>
            <p className={styles.pageEyebrow}>Birthday Services in Patna</p>
            <h1 className={styles.pageTitle}>{serviceData.heading}</h1>
            <p className={styles.pageCopy}>{serviceData.subHeading}</p>
          </div>
        </section>

        <section className={styles.pageContent}>
          <div className={styles.contentContainer}>
            <div className={styles.contentGrid}>
              <div className={styles.contentMain}>
                <h2>About Our {serviceName} Service</h2>
                <p className={styles.overviewText}>{serviceData.overview}</p>

                <div className={styles.serviceFeatures}>
                  <h3>Why Choose Our {serviceName} in Patna?</h3>
                  <ul className={styles.featuresList}>
                    <li>✅ Professional service with years of experience</li>
                    <li>✅ Customized solutions for your specific needs</li>
                    <li>✅ Competitive pricing with quality guarantee</li>
                    <li>✅ Reliable service delivery across Patna</li>
                    <li>✅ Customer satisfaction and support</li>
                  </ul>
                </div>

                <div className={styles.contactSection}>
                  <h3>Get Started Today</h3>
                  <p>Contact us to book your {serviceName.toLowerCase()} service in Patna.</p>
                  <div className={styles.contactButtons}>
                    <a href="tel:+919285248504" className={styles.primaryButton}>
                      📞 Call Now: +91-9285248504
                    </a>
                    <a href="https://wa.me/919285248504" className={styles.secondaryButton}>
                      💬 WhatsApp Us
                    </a>
                  </div>
                  <p className={styles.contactLink}>
                    🌐 Website: <a href="https://birthdaywebsite.com" target="_blank" rel="noopener noreferrer">birthdaywebsite.com</a>
                  </p>
                </div>
              </div>

              <div className={styles.contentSidebar}>
                <div className={styles.serviceCard}>
                  <h4>Service Details</h4>
                  <div className={styles.serviceInfo}>
                    <p><strong>📍 Location:</strong> Patna, Bihar</p>
                    <p><strong>⏰ Service Hours:</strong> 9 AM - 9 PM</p>
                    <p><strong>🚚 Delivery:</strong> Available across Patna</p>
                    <p><strong>💳 Payment:</strong> Cash, UPI, Cards accepted</p>
                  </div>
                </div>

                <div className={styles.popularServices}>
                  <h4>Popular Birthday Services in Patna</h4>
                  <ul className={styles.servicesList}>
                    <li><a href="/birthday-services/patna/birthdayPartyPlanning">Party Planning</a></li>
                    <li><a href="/birthday-services/patna/birthdayCakeDelivery">Cake Delivery</a></li>
                    <li><a href="/birthday-services/patna/birthdayDecorations">Decorations</a></li>
                    <li><a href="/birthday-services/patna/birthdayPhotography">Photography</a></li>
                    <li><a href="/birthday-services/patna/birthdayEntertainment">Entertainment</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <FloatingButtons />
    </>
  );
}