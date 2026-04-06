'use client';

import React from 'react';
import config from '@/data/config.json';
import { Navbar } from '@/components/Navbar';
import { About } from '@/components/About';
import { Footer } from '@/components/Footer';
import { Wave } from '@/components/Utils';
import styles from '@/styles/SectionPage.module.css';

export default function AboutPage() {
  return (
    <main className={styles.pageWrapper}>
      <Navbar childName={config.child.name} />

      <About
        childName={config.child.name}
        childFullName={config.child.fullName}
        birthDate={config.child.birthDate}
        age={config.child.age}
        photoUrl={config.hero.photoUrl}
        facts={config.facts}
        personalityTags={config.personalityTags}
      />

      <Wave bgColor="#fff8f2" svgColor="#fff0f4" />
      <Footer childName={config.child.name} date={config.party.date} venue={config.party.venue} />
    </main>
  );
}
