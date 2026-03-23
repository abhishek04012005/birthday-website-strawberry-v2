'use client';

import React, { useEffect, useState } from 'react';
import config from '@/data/config.json';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Gallery } from '@/components/Gallery';
import { Details } from '@/components/Details';
import { RSVP } from '@/components/RSVP';
import { Treats } from '@/components/Treats';
import { Footer } from '@/components/Footer';
import { WishingPopup } from '@/components/WishingPopup';
import { Wave, Confetti, HeartsAnimation, RainLayer } from '@/components/Utils';

export default function Home() {
  const [wishingPopupOpen, setWishingPopupOpen] = useState(true);

  useEffect(() => {
    // Launch confetti on load
    const canvas = document.getElementById('confettiCanvas') as HTMLCanvasElement;
    if (canvas) {
      setTimeout(() => {
        launchConfetti(canvas);
      }, 700);
    }
  }, []);

  const detailCards = [
    {
      icon: '📅',
      title: 'Date & Time',
      content: `Saturday, <strong>${config.party.date}</strong><br>3:00 PM – 6:00 PM<br>Don't be late — cake waits for no one! 🎂`,
    },
    {
      icon: '📍',
      title: 'Venue',
      content: `<strong>${config.party.venue}</strong><br>${config.party.address} 🌸`,
    },
    {
      icon: '🎁',
      title: 'Dress Code',
      content: `Wear your pinkest outfit! <strong>Strawberry theme</strong> encouraged 🍓<br>Red, pink & white are perfect!`,
    },
    {
      icon: '🎪',
      title: 'Activities',
      content: `${config.party.activities.join(', ')}`,
    },
  ];

  return (
    <main>
      <Confetti />
      <HeartsAnimation />
      <RainLayer />
      
      <Navbar childName={config.child.name} />
      
      <Hero
        childName={config.child.name}
        childFullName={config.child.fullName}
        age={config.child.age}
        heroData={config.hero}
        partyDate={config.party.date}
      />

      <Wave bgColor="#fff0f4" svgColor="#fff0f4" />

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

      <Gallery gallery={config.gallery} />

      <Wave bgColor="#fff0f4" svgColor="#fffaf5" />

      <Details
        venueName={config.party.venue}
        address={config.party.address}
        mapUrl={config.party.mapUrl}
        detailCards={detailCards}
      />

      <Wave bgColor="#fffaf5" svgColor="#e8243c" />

      <RSVP
        invitedCount={config.rsvp.invitedCount}
        comingCount={config.rsvp.comingCount}
        features={config.rsvp.features}
        childName={config.child.name}
      />

      <Wave bgColor="#8c001a" svgColor="#1a0008" />

      <Treats treats={config.treats} />

      <Footer
        childName={config.child.name}
        date={config.party.date}
        venue={config.party.venue}
      />

      <WishingPopup 
        childName={config.child.name}
        isOpen={wishingPopupOpen}
        onClose={() => setWishingPopupOpen(false)}
      />

      {/* Floating Wishes Button */}
      <button
        onClick={() => setWishingPopupOpen(true)}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          background: 'linear-gradient(135deg, #e8243c 0%, #ff6b8a 100%)',
          color: 'white',
          border: 'none',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          fontSize: '28px',
          cursor: 'pointer',
          zIndex: 1500,
          boxShadow: '0 6px 20px rgba(232, 36, 60, 0.4)',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 30px rgba(232, 36, 60, 0.5)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(232, 36, 60, 0.4)';
        }}
        title="Send a birthday wish!"
      >
        💌
      </button>
    </main>
  );
}

// Confetti animation function
function launchConfetti(canvas: HTMLCanvasElement) {
  const cx = canvas.getContext('2d');
  if (!cx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const CC = ['#e8243c', '#ffb3c1', '#ffe566', '#3da84c', '#fff', '#ff6b8a', '#8c001a', '#c77dff', '#00b4d8'];
  const CS = ['circle', 'rect', 'tri'];
  let particles: any[] = [];

  for (let i = 0; i < 240; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: -22,
      r: 5 + Math.random() * 10,
      c: CC[Math.floor(Math.random() * CC.length)],
      s: CS[Math.floor(Math.random() * CS.length)],
      vx: (Math.random() - 0.5) * 8,
      vy: 2 + Math.random() * 6,
      rot: Math.random() * 360,
      rv: (Math.random() - 0.5) * 10,
      a: 1,
    });
  }

  function draw() {
    cx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter((p) => p.a > 0.01);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.14;
      p.rot += p.rv;
      if (p.y > canvas.height - 50) p.a -= 0.024;

      cx.save();
      cx.globalAlpha = p.a;
      cx.translate(p.x, p.y);
      cx.rotate((p.rot * Math.PI) / 180);
      cx.fillStyle = p.c;

      if (p.s === 'circle') {
        cx.beginPath();
        cx.arc(0, 0, p.r, 0, Math.PI * 2);
        cx.fill();
      } else if (p.s === 'rect') {
        cx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
      } else {
        cx.beginPath();
        cx.moveTo(0, -p.r);
        cx.lineTo(p.r, p.r);
        cx.lineTo(-p.r, p.r);
        cx.closePath();
        cx.fill();
      }
      cx.restore();
    }

    if (particles.length > 0) requestAnimationFrame(draw);
    else cx.clearRect(0, 0, canvas.width, canvas.height);
  }

  draw();
}
