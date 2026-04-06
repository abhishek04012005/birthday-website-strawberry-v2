import React, { useState } from 'react';
import styles from '@/styles/Navbar.module.css';

interface NavbarProps {
  childName: string;
}

export const Navbar: React.FC<NavbarProps> = ({ childName }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>🍓</span>
        {childName}'s Party
      </div>
      
      <div className={styles.navLinks}>
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/gallery">Gallery</a>
        <a href="/photos-videos">Photos & Videos</a>
        <a href="/rsvp">RSVP</a>
        <a href="/quiz">Quiz</a>
        <a href="/wishes">❤️ Wishes</a>
        <a href="/auth" className={styles.navAdminBtn}>🔐 Admin</a>
      </div>

      <button 
        className={styles.hamburger} 
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
      >
        <span className={styles.hamburgerLine}></span>
        <span className={styles.hamburgerLine}></span>
        <span className={styles.hamburgerLine}></span>
      </button>

      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <a href="/" onClick={closeMobileMenu}>Home</a>
        <a href="/about" onClick={closeMobileMenu}>About</a>
        <a href="/gallery" onClick={closeMobileMenu}>Gallery</a>
        <a href="/photos-videos" onClick={closeMobileMenu}>Photos & Videos</a>
        <a href="/rsvp" onClick={closeMobileMenu}>RSVP</a>
        <a href="/quiz" onClick={closeMobileMenu}>Quiz</a>
        <a href="/wishes" onClick={closeMobileMenu}>Wishes</a>
        <a href="/auth" className={styles.mobileAdminBtn} onClick={closeMobileMenu}>🔐 Admin</a>
      </div>
    </nav>
  );
};
