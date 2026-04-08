'use client';

import React from 'react';
import config from '@/data/config.json';
import { Navbar } from '@/components/Navbar';
import { Gallery } from '@/components/Gallery';
import { Footer } from '@/components/Footer';
import { Wave } from '@/components/Utils';
import styles from '@/styles/SectionPage.module.css';

export default function GalleryClient() {
  return (
    <main className={styles.pageWrapper}>
      <Navbar childName={config.child.name} />

      <Gallery gallery={config.gallery} />

      <Wave bgColor="#fff8f2" svgColor="#fff0f4" />
      <Footer childName={config.child.name} date={config.party.date} venue={config.party.venue} />
    </main>
  );
}