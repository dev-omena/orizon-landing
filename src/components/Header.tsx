'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);
  const availabilityRef = useRef<HTMLElement>(null);
  const qrRef = useRef<HTMLAnchorElement>(null);

  const [consoleText, setConsoleText] = useState('');
  const [consoleIndex, setConsoleIndex] = useState(0);

  const consoleMessages = [
    'Animating pixels…\n somewhat precisely',
    'Trying to animate enthusiasm…\n it\'s not going well', 
    'Simulating digital horizons…\n success rate: 99.9%',
    'Crafting experiences…\n pixel by pixel',
    'Loading creativity…\n please wait'
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial setup - hide elements
      gsap.set([logoRef.current, consoleRef.current, navRef.current, socialsRef.current, availabilityRef.current, qrRef.current], {
        opacity: 0,
        y: -20
      });

      // Create timeline for header entrance
      const tl = gsap.timeline({ delay: 0.5 });

      // Animate elements in sequence
      tl.to(logoRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      })
      .to(consoleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.4")
      .to(navRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.3")
      .to([socialsRef.current, availabilityRef.current, qrRef.current], {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
      }, "-=0.3");

    }, headerRef);

    return () => ctx.revert();
  }, []);

  // Console text animation
  useEffect(() => {
    const interval = setInterval(() => {
      setConsoleIndex((prev) => (prev + 1) % consoleMessages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const message = consoleMessages[consoleIndex] || '';
    let currentIndex = 0;
    setConsoleText('');

    const typeInterval = setInterval(() => {
      if (currentIndex <= message.length) {
        setConsoleText(message.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, [consoleIndex]);

  return (
    <header 
      ref={headerRef}
      className="site-head bg-secondary text-primary font-montserrat w-full"
    >
      {/* Header Grid Layout - 16 Column Grid */}
      <div className="grid grid-cols-16 w-full h-24 border-b border-primary">
        
        {/* Logo Section - 2 columns */}
        <div ref={logoRef} className="col-span-2 flex items-center justify-center border-r border-primary px-4">
          <Image
            src="/Full-logo.png"
            alt="Orizon Full Logo"
            width={120}
            height={40}
            className="h-8 w-auto object-contain"
            priority
          />
        </div>

        {/* Console Section - 3 columns */}
        <div ref={consoleRef} className="col-span-3 flex py-4 border-r border-primary px-4">
          <div className="text-xs font-mono text-left">
            {consoleText}
          </div>
        </div>

        {/* Navigation - 6 columns */}
        <nav ref={navRef} className="col-span-6 flex items-center justify-center border-r border-primary px-6">
          <div className="flex items-center justify-between w-full px-4">
            <a href="#about" className="text-sm font-medium hover:opacity-70 transition-opacity uppercase tracking-wide group relative">
              <span className="absolute -left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">→</span>
              ABOUT
            </a>
            <a href="#work" className="text-sm font-medium hover:opacity-70 transition-opacity uppercase tracking-wide group relative">
              <span className="absolute -left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">→</span>
              WORK
            </a>
            <a href="#contact" className="text-sm font-medium hover:opacity-70 transition-opacity uppercase tracking-wide group relative">
              <span className="absolute -left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">→</span>
              CONTACT
            </a>
          </div>
        </nav>

        {/* Social Icons - 1 column */}
        <div ref={socialsRef} className="col-span-1 border-r border-primary">
          <div className="h-full flex flex-col">
            <a href="https://codepen.io" className="flex-1 border-b border-primary flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="relative z-10 text-primary group-hover:text-secondary transition-colors duration-300">
                <path d="M19.3184 6.01751L10.4517 0.105976C10.3477 0.0365379 10.2254 -0.000518799 10.1002 -0.000518799C9.97513 -0.000518799 9.85282 0.0365379 9.74874 0.105976L0.882076 6.01751C0.795245 6.07529 0.724029 6.15362 0.674752 6.24555C0.625475 6.33747 0.599663 6.44014 0.599609 6.54444V12.456C0.599609 12.6675 0.706009 12.8651 0.882076 12.9829L9.74874 18.8944C9.85269 18.9636 9.97476 19.0005 10.0996 19.0005C10.2245 19.0005 10.3465 18.9636 10.4505 18.8944L19.3171 12.9829C19.404 12.9251 19.4752 12.8468 19.5245 12.7549C19.5737 12.6629 19.5996 12.5603 19.5996 12.456V6.54444C19.5996 6.44014 19.5737 6.33747 19.5245 6.24555C19.4752 6.15362 19.404 6.07529 19.3171 6.01751H19.3184ZM10.1009 11.6934L6.80881 9.49958L10.1009 7.30571L13.3929 9.49958L10.1009 11.6934ZM10.7342 6.20498V1.81598L17.8263 6.54318L14.5342 8.73704L10.7342 6.20371V6.20498ZM9.46754 6.20498L5.66754 8.73831L2.37548 6.54444L9.46754 1.81724V6.20498ZM4.52628 9.49958L1.86754 11.2716V7.72751L4.52628 9.49958ZM5.66754 10.2608L9.46754 12.7942V17.1832L2.37548 12.456L5.66754 10.2608ZM10.7342 12.7942L14.5342 10.2608L17.8263 12.4547L10.7342 17.1819V12.7942ZM15.6755 9.49958L18.3342 7.72751V11.2716L15.6755 9.49958Z"/>
              </svg>
            </a>
            <a href="https://linkedin.com" className="flex-1 flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
              <span className="text-[20px] font-bold relative z-10 text-primary group-hover:text-secondary transition-colors duration-300">in</span>
            </a>
          </div>
        </div>

        {/* Availability Text - 3 columns */}
        <aside ref={availabilityRef} className="col-span-3 border-r border-primary">
          <div className="h-full flex flex-col">
            <div className="flex-1 border-b border-primary flex items-center justify-center px-4">
              <div className="text-xs font-semibold">Coding globally from France.</div>
            </div>
            <div className="flex-1 flex items-center justify-center px-4">
              <div className="text-xs">
                Available for freelance work → <span className="font-bold">Hire me</span>
              </div>
            </div>
          </div>
        </aside>

        {/* QR Code - 1 column */}
        <div className="col-span-1 flex items-center justify-center">
          <a 
            ref={qrRef}
            href="mailto:hello@orizon.dev" 
            className="hover:opacity-70 transition-opacity"
            title="Contact me!"
          >
            <Image
              src="/Icon.png"
              alt="QR Code"
              width={40}
              height={40}
              className="w-10 h-10 object-contain border border-primary"
              priority
            />
          </a>
        </div>
      </div>
    </header>
  );
}
