'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import OrizonBanner from '@/components/OrizonBanner';
import OrizonHero from '@/components/OrizonHero';
import Separator from '@/components/Separator';
import Footer from '@/components/Footer';
import LoadingScreen from '@/components/LoadingScreen';

// Lazy load heavy components with canvas/animations
const Waves = dynamic(() => import('@/components/Waves'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-primary" />
});

const ScrollStackServices = dynamic(() => import('@/components/scroll-stack'), {
  ssr: false,
  loading: () => <div/>
});

const WorkSectionWithPortal = dynamic(() => import('@/components/WorkSectionWithPortal'), {
  ssr: false,
  loading: () => <div className="w-full h-screen bg-primary" />
});

const CtaSection = dynamic(() => import('@/components/CtaSection'), {
  loading: () => <div className="w-full min-h-screen bg-primary" />
});

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showSections, setShowSections] = useState(false);

  useEffect(() => {
    // Quick loading - show content immediately
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Start section animations after loading screen
      setTimeout(() => {
        setShowSections(true);
      }, 300);
    }, 800); // Reduced from 4000ms to 800ms

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-secondary p-0">
      <div className="relative min-h-screen bg-primary border border-orizon-secondary rounded-lg overflow-hidden m-2">
     
        {/* Connected Hero Section - Header + Waves + Separator + Banner + Separator as one unit */}
        <div className="flex flex-col bg-primary relative overflow-hidden" style={{ height: '100vh', minHeight: '100vh', maxHeight: '100vh' }}>
          {/* Header with Reveal Animation */}
          <div className={`flex-shrink-0 transform transition-all duration-1000 ease-out ${
            showSections
              ? 'translate-y-0 opacity-100'
              : '-translate-y-full opacity-0'
          }`}>
            <Header />
          </div>

          {/* Waves Section with Reveal Animation - Takes remaining space */}
          <div className={`flex-1 relative border-b border-orizon-secondary transform transition-all duration-1200 ease-out ${
            showSections
              ? 'translate-x-0 opacity-100 scale-100'
              : '-translate-x-full opacity-0 scale-95'
          }`}
          style={{
            minHeight: 0,
            transitionDelay: showSections ? '200ms' : '0ms',
            borderBottomWidth: '1px'
          }}>
            <Waves
              lineColor="rgba(248, 232, 0, 0.6)"
              backgroundColor="#272860"
              waveSpeedX={0.02}
              waveSpeedY={0.01}
              waveAmpX={20}
              waveAmpY={10}
              friction={0.8}
              tension={0.01}
              maxCursorMove={90}
              xGap={15}
              yGap={45}


            />
          </div>

          {/* First Separator with Reveal Animation */}
          <div className={`flex-shrink-0 transform transition-all duration-1000 ease-out ${
            showSections
              ? 'translate-y-0 opacity-100'
              : 'translate-y-full opacity-0'
          }`}
          style={{
            transitionDelay: showSections ? '300ms' : '0ms'
          }}>
            <Separator />
          </div>

          {/* Banner Section with Reveal Animation */}
          <div className={`flex-shrink-0 bg-primary transform transition-all duration-1000 ease-out ${
            showSections
              ? 'translate-y-0 opacity-100'
              : 'translate-y-full opacity-0'
          }`}
          style={{
            transitionDelay: showSections ? '500ms' : '0ms'
          }}>
            <OrizonBanner />
          </div>

          {/* Second Separator with Reveal Animation */}
          <div className={`flex-shrink-0 transform transition-all duration-1000 ease-out ${
            showSections
              ? 'translate-y-0 opacity-100'
              : 'translate-y-full opacity-0'
          }`}
          style={{
            transitionDelay: showSections ? '600ms' : '0ms'
          }}>
            <Separator />
          </div>
        </div>

        {/* OrizonHero Section with Reveal Animation */}
        <div className={`transform transition-all duration-1500 ease-out ${
          showSections 
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-16 opacity-0'
        }`}
        style={{
          transitionDelay: showSections ? '600ms' : '0ms',
          margin: 0,
          padding: 0
        }}>
          <OrizonHero />
        </div>
        {/* Separator with Reveal Animation */}
        <div className={`transform transition-all duration-1500 ease-out ${
          showSections 
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-16 opacity-0'
        }`}
        style={{
          transitionDelay: showSections ? '1100ms' : '0ms'
        }}>
          <Separator />
        </div>
        
        <ScrollStackServices />
                {/* Separator with Reveal Animation */}
                <div className={`transform transition-all duration-1500 ease-out ${
          showSections 
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-16 opacity-0'
        }`}
        style={{
          transitionDelay: showSections ? '1100ms' : '0ms'
        }}>
          <Separator showBorderTop />
        </div>
        

          <WorkSectionWithPortal />
                          {/* Separator with Reveal Animation */}
                          <div className={`transform transition-all duration-1500 ease-out ${
          showSections 
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-16 opacity-0'
        }`}
        style={{
          transitionDelay: showSections ? '1100ms' : '0ms'
        }}>
          <Separator showBorderTop />
        </div>
        {/* CtaSection with Reveal Animation */}
        <div className={`transform transition-all duration-1500 ease-out ${
          showSections 
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-16 opacity-0'
        }`}
        style={{
          transitionDelay: showSections ? '1000ms' : '0ms'
        }}>
          <CtaSection />
        </div>



        {/* Footer with Reveal Animation */}
        <div className={`transform transition-all duration-1500 ease-out ${
          showSections 
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-16 opacity-0'
        }`}
        style={{
          transitionDelay: showSections ? '1200ms' : '0ms'
        }}>
          <Footer />
        </div>
      </div>
    </div>
  );
}