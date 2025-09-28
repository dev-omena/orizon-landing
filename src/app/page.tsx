'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Waves from '@/components/Waves';
import DomeGallery from '@/components/DomeGallery';
import Cubes from '@/components/Cubes';


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
      <div className="relative min-h-screen bg-secondary border-4 border-primary rounded-lg overflow-hidden" style={{ position: 'relative' }}>
        {/* Animated Header */}
        <Header />
        <section className="relative w-full h-64 overflow-hidden border-b-2 border-primary pt-2" style={{ position: 'relative', zIndex: 1 }}>
          <Cubes 
     gridSize={30}
     cubeSize={20}
     maxAngle={180}
     radius={2}
     borderStyle="2px dashed #272860"
     faceColor="#f8e800"
     rippleColor="#272860"
     rippleSpeed={1.5}
     autoAnimate={true}
     rippleOnClick={true}
          />
        </section>
        

      
        
        <section className="relative h-[150vh] bg-secondary">
          <DomeGallery
            dragSensitivity={10}
            enlargeTransitionMs={200}
            fit={0.7}
            minRadius={800}
            maxVerticalRotationDeg={8}
            segments={40}
            openedImageBorderRadius="25px"
            openedImageWidth="500px"
            openedImageHeight="500px"
            overlayBlurColor="#f8e800"
          />
        </section>




      </div>
    </div>
  );
}
