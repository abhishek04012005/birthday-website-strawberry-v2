'use client';

import React from 'react';
import styles from '@/styles/LiveStream.module.css';

export default function LiveStreamContent({ channelId }: { channelId?: string }) {
  const embedUrl = channelId
    ? `https://www.youtube.com/embed/live_stream?channel=${channelId}&autoplay=0`
    : 'https://www.youtube.com/embed/live_stream?channel=YOUR_CHANNEL_ID&autoplay=0';

  const watchUrl = channelId
    ? `https://youtube.com/channel/${channelId}/live`
    : 'https://youtube.com/channel/YOUR_CHANNEL_ID/live';

  return (
    <section className={styles.liveStreamSection}>
      <div className={styles.liveStreamContainer}>
        <div className={styles.liveStreamHeader}>
          <div className={styles.secPill}>Live Stream</div>
          <h1 className={styles.liveStreamTitle}>
            🎉 Watch the Birthday Celebration Live! 🎉
          </h1>
          <p className={styles.liveStreamSubtitle}>
            Join us for the magical birthday celebration! Watch all the fun, games, and cake cutting in real-time.
          </p>
        </div>

        <div className={styles.liveStreamContent}>
          <div className={styles.streamContainer}>
            <div className={styles.streamWrapper}>
              <iframe
                src={embedUrl}
                title="Birthday Party Live Stream"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className={styles.streamIframe}
              ></iframe>
            </div>

            <div className={styles.streamInfo}>
              <div className={styles.streamStatus}>
                <div className={styles.statusIndicator}>
                  <span className={styles.statusDot}></span>
                  <span className={styles.statusText}>🔴 LIVE NOW</span>
                </div>
                <div className={styles.streamDetails}>
                  <h3>🎂 Birthday Party Live Stream</h3>
                  <p>📅 April 12, 2025 | 🕐 3:00 PM - 6:00 PM</p>
                  <p>📍 Strawberry Garden Hall, Central Park</p>
                </div>
              </div>

              <div className={styles.streamActions}>
                <a
                  href={watchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.watchOnYoutubeBtn}
                >
                  📺 Watch on YouTube
                </a>
                <button className={styles.shareBtn}>
                  📤 Share Stream
                </button>
              </div>
            </div>
          </div>

          <div className={styles.scheduleSection}>
            <h2 className={styles.scheduleTitle}>📋 Live Stream Schedule</h2>
            <div className={styles.scheduleGrid}>
              <div className={styles.scheduleItem}>
                <div className={styles.scheduleTime}>3:00 PM</div>
                <div className={styles.scheduleContent}>
                  <h4>🎉 Doors Open & Welcome!</h4>
                  <p>Guests arrive and get settled for the celebration</p>
                </div>
              </div>
              <div className={styles.scheduleItem}>
                <div className={styles.scheduleTime}>3:30 PM</div>
                <div className={styles.scheduleContent}>
                  <h4>🎨 Face Painting & Crafts</h4>
                  <p>Creative activities and fun decorations</p>
                </div>
              </div>
              <div className={styles.scheduleItem}>
                <div className={styles.scheduleTime}>4:00 PM</div>
                <div className={styles.scheduleContent}>
                  <h4>🎪 Games & Activities</h4>
                  <p>Musical chairs, strawberry toss, and more fun!</p>
                </div>
              </div>
              <div className={styles.scheduleItem}>
                <div className={styles.scheduleTime}>4:45 PM</div>
                <div className={styles.scheduleContent}>
                  <h4>🎂 Cake & Singing!</h4>
                  <p>The grand cake ceremony and birthday wishes</p>
                </div>
              </div>
              <div className={styles.scheduleItem}>
                <div className={styles.scheduleTime}>5:15 PM</div>
                <div className={styles.scheduleContent}>
                  <h4>💃 Dance Party & Treats</h4>
                  <p>Dancing, dessert table, and goodie bags</p>
                </div>
              </div>
              <div className={styles.scheduleItem}>
                <div className={styles.scheduleTime}>6:00 PM</div>
                <div className={styles.scheduleContent}>
                  <h4>🌟 Farewell & Hugs!</h4>
                  <p>Final goodbyes and party memories</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.interactionSection}>
            <h2 className={styles.interactionTitle}>💬 Join the Conversation</h2>
            <div className={styles.interactionGrid}>
              <div className={styles.interactionCard}>
                <div className={styles.interactionIcon}>💌</div>
                <h3>Send Wishes</h3>
                <p>Share your birthday wishes in the chat or wishes section</p>
                <a href="/wishes" className={styles.interactionLink}>Send a Wish →</a>
              </div>
              <div className={styles.interactionCard}>
                <div className={styles.interactionIcon}>🎮</div>
                <h3>Take the Quiz</h3>
                <p>Test your knowledge about the birthday star!</p>
                <a href="/quiz" className={styles.interactionLink}>Start Quiz →</a>
              </div>
              <div className={styles.interactionCard}>
                <div className={styles.interactionIcon}>📝</div>
                <h3>RSVP</h3>
                <p>Let us know you're coming to celebrate!</p>
                <a href="/rsvp" className={styles.interactionLink}>RSVP Now →</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}