'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

// Register GSAP plugins
gsap.registerPlugin(TextPlugin);

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial setup
      gsap.set([titleRef.current, subtitleRef.current, ctaRef.current], {
        opacity: 0,
        y: 60
      });

      // Background animation
      gsap.set(backgroundRef.current, {
        scale: 1.1,
        opacity: 0
      });

      // Create main timeline
      const tl = gsap.timeline({ delay: 1 });

      // Background entrance
      tl.to(backgroundRef.current, {
        scale: 1,
        opacity: 1,
        duration: 2,
        ease: "power2.out"
      })

      // Title animation with split text effect
      .to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out"
      }, "-=1.5")

      // Subtitle animation
      .to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out"
      }, "-=0.8")

      // CTA buttons animation
      .to(ctaRef.current?.children || [], {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)"
      }, "-=0.5");

      // Floating animation for the entire hero
      gsap.to(heroRef.current, {
        y: -10,
        duration: 3,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1
      });

      // Parallax effect on scroll
      const handleScroll = () => {
        const scrollY = window.scrollY;
        const speed = 0.5;
        
        gsap.to(heroRef.current, {
          y: scrollY * speed,
          duration: 0.3,
          ease: "none"
        });
        
        gsap.to(backgroundRef.current, {
          y: scrollY * 0.3,
          scale: 1 + scrollY * 0.0005,
          duration: 0.3,
          ease: "none"
        });
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
      {/* Animated Background */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0 z-0 bg-primary"
      />

      {/* Hero Content */}
      <div ref={heroRef} className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Main Title */}
        <h1 
          ref={titleRef}
          className="font-halyard text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-none"
        >
          <span className="block text-secondary">Your Digital</span>
          <span className="block bg-gradient-to-r from-secondary via-black to-secondary bg-clip-text text-transparent">
            Horizon
          </span>
          <span className="block text-secondary">Awaits</span>
        </h1>

        {/* Subtitle */}
        <p 
          ref={subtitleRef}
          className="font-montserrat text-xl md:text-2xl text-secondary/80 max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          Where innovation meets creativity. We craft digital experiences that push 
          the boundaries of what&apos;s possible, turning your vision into reality with 
          cutting-edge design and development.
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button className="group relative px-10 py-4 bg-secondary text-primary font-montserrat font-bold text-lg rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-secondary/30">
            <span className="relative z-10">Explore Our Work</span>
            <div className="absolute inset-0 bg-secondary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>

          <button className="group relative px-10 py-4 border-2 border-secondary/50 text-secondary font-montserrat font-bold text-lg rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:border-secondary hover:scale-105">
            <span className="relative z-10">Start Your Project</span>
            <div className="absolute inset-0 bg-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce">
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              className="text-secondary/60"
            >
              <path 
                d="M12 5v14m0 0l-7-7m7 7l7-7" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 w-4 h-4 bg-secondary rounded-full opacity-60 animate-pulse" />
      <div className="absolute top-1/3 right-20 w-2 h-2 bg-secondary rounded-full opacity-40 animate-pulse" style={{animationDelay: '1s'}} />
      <div className="absolute bottom-1/4 left-1/4 w-3 h-3 bg-secondary rounded-full opacity-30 animate-pulse" style={{animationDelay: '2s'}} />
      <div className="absolute bottom-1/3 right-10 w-1 h-1 bg-secondary rounded-full opacity-50 animate-pulse" style={{animationDelay: '0.5s'}} />
    </div>
  );
}
