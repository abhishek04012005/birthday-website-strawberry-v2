import React from 'react';
import styles from '@/styles/Navbar.module.css';

interface NavbarProps {
  childName: string;
}

export const Navbar: React.FC<NavbarProps> = ({ childName }) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>🍓</span>
        {childName}'s Party
      </div>
      <div className={styles.navLinks}>
        <a href="#hero">Home</a>
        <a href="#about">About</a>
        <a href="#gallery">Gallery</a>
        <a href="#schedule">Schedule</a>
        <a href="#treats">Treats</a>
        <a href="#details">Details</a>
        <a href="#rsvp">RSVP</a>
        <a href="#rsvp" className={styles.navRsvpBtn}>🎟 RSVP</a>
      </div>
    </nav>
  );
};
