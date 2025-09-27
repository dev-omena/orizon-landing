'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Waves from '@/components/Waves';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  useEffect(() => {
    // Smooth scrolling setup
    gsap.registerPlugin(ScrollTrigger);
    
    // Initialize smooth scroll behavior
    gsap.config({
      force3D: true,
      nullTargetWarn: false
    });

    // Cleanup on unmount
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-primary p-4">
      {/* Website Container with Primary Color Border Frame */}
      <div className="relative min-h-screen bg-secondary border-4 border-primary rounded-lg overflow-hidden">
        {/* Animated Header */}
        <Header />

        {/* Hero Section with Waves */}
        <section className="relative min-h-screen overflow-hidden">
          <Hero />
          <Waves />
        </section>






      </div>
    </div>
  );
}
