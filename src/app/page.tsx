'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from '@/components/Header';
import OrizonBanner from '@/components/OrizonBanner';
import Waves from '@/components/Waves';

// Register GSAP plugins ONCE outside component
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const hasAnimated = useRef(false);

  useEffect(() => {
    // Prevent animation from running multiple times
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    // Configure GSAP once
    gsap.config({
      force3D: true,
      nullTargetWarn: false
    });

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      const sections = gsap.utils.toArray('.page-section');
      
      // Only animate if sections exist
      if (sections.length === 0) return;

      // Simpler, faster animation
      gsap.fromTo(sections, 
        {
          opacity: 0,
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
          clearProps: "all" // Remove inline styles after animation
        }
      );
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="h-screen bg-secondary p-0 overflow-auto">
      <div className="relative min-h-screen bg-primary border-4 border-orizon-secondary rounded-lg overflow-hidden m-4">
     
        <div className="page-section">
          <Header />
        </div>
        
        <div className="page-section bg-primary border-t border-b border-orizon-secondary h-64">
          <Waves
            lineColor="#f8e800"
            backgroundColor="#272860"
            waveSpeedX={0.02}
            waveSpeedY={0.01}
            waveAmpX={40}
            waveAmpY={20}
            friction={0.8}
            tension={0.01}
            maxCursorMove={120}
            xGap={10}
            yGap={36}
          />
        </div>
        
        <div className="page-section">
          <OrizonBanner />
        </div>

      </div>
    </div>
  );
}