'use client';

import React from 'react';
import styles from '@/styles/FloatingContactButton.module.css';

export default function FloatingContactButton() {
  const phoneNumber = '919285248504';
  const whatsappMessage = encodeURIComponent(
    "Hi! I'm interested in your birthday services. Please tell me more."
  );

  return (
    <div className={styles.floatingContainer}>
      <a
        href={`https://wa.me/${phoneNumber}?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.floatingButton}
        title="Chat with us on WhatsApp"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </a>
    </div>
  );
}
