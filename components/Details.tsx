import React from 'react';
import styles from '@/styles/Details.module.css';

interface DetailCard {
  icon: string;
  title: string;
  content: string;
}

interface DetailsProps {
  venueName: string;
  address: string;
  mapUrl: string;
  detailCards: DetailCard[];
}

export const Details: React.FC<DetailsProps> = ({ venueName, address, mapUrl, detailCards }) => {
  return (
    <section className={styles.detailsBg} id="details">
      <div className={styles.secHead}>
        <div className={styles.secPill}>🗓 Event Info</div>
        <h2 className={styles.secTitle}>Party Details &amp; Venue</h2>
        <p className={styles.secSub}>All the details you need to join the sweetest birthday bash in town!</p>
      </div>

      <div className={styles.detailsLayout}>
        <div className={styles.detailCards}>
          {detailCards.map((card, idx) => (
            <div key={idx} className={styles.dcard}>
              <div className={styles.dcardIcon}>{card.icon}</div>
              <div className={styles.dcardBody}>
                <h3>{card.title}</h3>
                <p dangerouslySetInnerHTML={{ __html: card.content }} />
              </div>
            </div>
          ))}
        </div>

        <div className={styles.mapBlock}>
          <div className={styles.mapLabel}>
            <span className={styles.mapLabelIcon}>📍</span>
            Find Us Here — {venueName}
          </div>
          <div className={styles.mapFrameWrapper}>
            <iframe
              className={styles.mapFrame}
              src={mapUrl}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Party Venue Location"
            ></iframe>
          </div>
          <div className={styles.mapFooter}>
            <div className={styles.mapAddr}>
              <strong>📍 {venueName}</strong>
              {address}
            </div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener"
              className={styles.mapDirBtn}
            >
              🗺 Get Directions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
