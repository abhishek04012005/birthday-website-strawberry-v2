'use client';

import React, { Suspense } from 'react';
import config from '@/data/config.json';
import { Navbar } from '@/components/Navbar';
import { RSVP } from '@/components/RSVP';
import { Footer } from '@/components/Footer';
import { Wave } from '@/components/Utils';
import styles from '@/styles/SectionPage.module.css';

export default function RSVPClient() {
  return (
    <main className={styles.pageWrapper}>
      <Navbar childName={config.child.name} />

      <Suspense fallback={<div className={styles.loading}>Loading RSVP...</div>}>
        <RSVP
          invitedCount={config.rsvp.invitedCount}
          comingCount={config.rsvp.comingCount}
          features={config.rsvp.features}
          childName={config.child.name}
        />
      </Suspense>

      <Wave bgColor="#fff8f2" svgColor="#fff0f4" />
      <Footer childName={config.child.name} date={config.party.date} venue={config.party.venue} />
    </main>
  );
}
