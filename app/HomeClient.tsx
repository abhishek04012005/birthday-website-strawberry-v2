'use client';

import React, { useEffect, useState, Suspense } from 'react';
import config from '@/data/config.json';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Quiz, QuizQuestion } from '@/components/Quiz';
import { About } from '@/components/About';
import { Gallery } from '@/components/Gallery';
import { Parents } from '@/components/Parents';
import { Details } from '@/components/Details';
import { RSVP } from '@/components/RSVP';
import { HomepageWishes } from '@/components/HomepageWishes';
import { Treats } from '@/components/Treats';
import { Footer } from '@/components/Footer';
import { WishingPopup } from '@/components/WishingPopup';
import { FloatingButtons } from '@/components/FloatingButtons';
import { Wave, Confetti, HeartsAnimation, RainLayer } from '@/components/Utils';

export default function HomeClient() {
  const [wishingPopupOpen, setWishingPopupOpen] = useState(true);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);

  useEffect(() => {
    // Setup quiz data from admin saved values / default config
    const savedQuiz = localStorage.getItem('birthdayQuizQuestions');
    if (savedQuiz) {
      try {
        const parsed = JSON.parse(savedQuiz) as QuizQuestion[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setQuizQuestions(parsed);
        } else {
          setQuizQuestions(config.quiz as QuizQuestion[]);
        }
      } catch {
        setQuizQuestions(config.quiz as QuizQuestion[]);
      }
    } else {
      setQuizQuestions(config.quiz as QuizQuestion[]);
    }

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

      <Wave bgColor="#fff5e8" svgColor="#fff0f4" />

      <Gallery gallery={config.gallery} />

      <Wave bgColor="#fff0f4" svgColor="#fff5e8" />

      <Parents parents={config.parents} childName={config.child.name} />

      <Wave bgColor="#fff5e8" svgColor="#fff0f4" />

      <Details
        venueName={config.party.venue}
        address={config.party.address}
        mapUrl={config.party.mapUrl}
        detailCards={detailCards}
      />

      <Wave bgColor="#fff0f4" svgColor="#fff5e8" />

      <Suspense fallback={<div>Loading RSVP...</div>}>
        <RSVP
          invitedCount={config.rsvp.invitedCount}
          comingCount={config.rsvp.comingCount}
          features={config.rsvp.features}
          childName={config.child.name}
        />
      </Suspense>

      <Wave bgColor="#fff5e8" svgColor="#fff0f4" />

      <HomepageWishes childName={config.child.name} />

      <Wave bgColor="#fff0f4" svgColor="#fff5e8" />

      {/* <Treats treats={config.treats} childName={config.child.name} /> */}


      <FloatingButtons />

      <WishingPopup
        childName={config.child.name}
        isOpen={wishingPopupOpen}
        onClose={() => setWishingPopupOpen(false)}
      />

      {quizQuestions.length > 0 && (
        <Quiz questions={quizQuestions} />
      )}

      <Footer childName={config.child.name} date={config.party.date} venue={config.party.venue} />

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
  let animationId: number;
  let lastTime = 0;

  // Create initial particles
  for (let i = 0; i < 150; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 3 + Math.random() * 8,
      c: CC[Math.floor(Math.random() * CC.length)],
      s: CS[Math.floor(Math.random() * CS.length)],
      vx: (Math.random() - 0.5) * 2,
      vy: 1 + Math.random() * 3,
      rot: Math.random() * 360,
      rv: (Math.random() - 0.5) * 2,
      a: 0.8 + Math.random() * 0.2,
      life: 0,
      maxLife: 300 + Math.random() * 200,
    });
  }

  function addNewParticles() {
    // Add 2-5 new particles at random positions at the top
    const numNew = 2 + Math.floor(Math.random() * 4);
    for (let i = 0; i < numNew; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 50,
        r: 3 + Math.random() * 8,
        c: CC[Math.floor(Math.random() * CC.length)],
        s: CS[Math.floor(Math.random() * CS.length)],
        vx: (Math.random() - 0.5) * 2,
        vy: 1 + Math.random() * 3,
        rot: Math.random() * 360,
        rv: (Math.random() - 0.5) * 2,
        a: 0.8 + Math.random() * 0.2,
        life: 0,
        maxLife: 300 + Math.random() * 200,
      });
    }
  }

  function draw(currentTime: number) {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    cx.clearRect(0, 0, canvas.width, canvas.height);

    // Add new particles periodically
    if (Math.random() < 0.3) {
      addNewParticles();
    }

    // Update and draw particles
    particles = particles.filter((p) => {
      // Update particle properties with smooth linear motion
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.rv;
      p.life += deltaTime;

      // Fade out particles near the bottom or when life expires
      if (p.y > canvas.height - 100 || p.life > p.maxLife) {
        p.a = Math.max(0, p.a - 0.005);
      }

      // Remove particles that are completely faded
      if (p.a <= 0.01) {
        return false;
      }

      // Wrap particles around screen edges for infinite effect
      if (p.x < -p.r) p.x = canvas.width + p.r;
      if (p.x > canvas.width + p.r) p.x = -p.r;
      if (p.y > canvas.height + p.r) {
        // Reset particle to top when it goes off bottom
        p.y = -p.r;
        p.x = Math.random() * canvas.width;
        p.life = 0;
        p.a = 0.8 + Math.random() * 0.2;
      }

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

      return true;
    });

    // Keep the animation running infinitely
    animationId = requestAnimationFrame(draw);
  }

  // Start the animation
  animationId = requestAnimationFrame(draw);

  // Return cleanup function
  return () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  };
}