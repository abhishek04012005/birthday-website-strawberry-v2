'use client';

import React from 'react';
import config from '@/data/config.json';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Wave } from '@/components/Utils';
import LiveStreamContent from './LiveStreamContent';
import styles from '@/styles/SectionPage.module.css';

export default function LiveStreamClient() {
  return (
    <main className={styles.pageWrapper}>
      <Navbar childName={config.child.name} />

      <LiveStreamContent channelId={config.party.youtubeChannelId} />

      <Wave bgColor="#fff8f2" svgColor="#fff0f4" />
      <Footer childName={config.child.name} date={config.party.date} venue={config.party.venue} />
    </main>
  );
}