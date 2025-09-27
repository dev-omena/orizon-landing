'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Waves() {
  const wavesRef = useRef<HTMLDivElement>(null);
  const wave1Ref = useRef<SVGPathElement>(null);
  const wave2Ref = useRef<SVGPathElement>(null);
  const wave3Ref = useRef<SVGPathElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Wave animation paths
      const wave1Path = "M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,122.7C960,149,1056,203,1152,202.7C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z";
      const wave1PathAlt = "M0,64L48,85.3C96,107,192,149,288,154.7C384,160,480,128,576,133.3C672,139,768,181,864,181.3C960,181,1056,139,1152,133.3C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z";

      const wave2Path = "M0,160L48,176C96,192,192,224,288,234.7C384,245,480,235,576,213.3C672,192,768,160,864,165.3C960,171,1056,213,1152,218.7C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z";
      const wave2PathAlt = "M0,192L48,197.3C96,203,192,213,288,202.7C384,192,480,160,576,154.7C672,149,768,171,864,186.7C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z";

      const wave3Path = "M0,224L48,208C96,192,192,160,288,165.3C384,171,480,213,576,213.3C672,213,768,171,864,160C960,149,1056,171,1152,186.7C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z";
      const wave3PathAlt = "M0,256L48,240C96,224,192,192,288,197.3C384,203,480,245,576,250.7C672,256,768,224,864,197.3C960,171,1056,149,1152,160C1248,171,1344,213,1392,234.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z";

      // Create infinite wave animations
      const createWaveAnimation = (element: SVGPathElement | null, path1: string, path2: string, duration: number, delay: number) => {
        if (!element) return;
        
        gsap.set(element, { attr: { d: path1 } });
        
        gsap.to(element, {
          attr: { d: path2 },
          duration: duration,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1,
          delay: delay
        });
      };

      // Initialize wave animations with different timings
      createWaveAnimation(wave1Ref.current, wave1Path, wave1PathAlt, 4, 0);
      createWaveAnimation(wave2Ref.current, wave2Path, wave2PathAlt, 5, 0.5);
      createWaveAnimation(wave3Ref.current, wave3Path, wave3PathAlt, 6, 1);

      // Parallax effect on waves
      const handleScroll = () => {
        const scrollY = window.scrollY;
        
        gsap.to(wave1Ref.current, {
          y: scrollY * 0.1,
          duration: 0.3,
          ease: "none"
        });
        
        gsap.to(wave2Ref.current, {
          y: scrollY * 0.05,
          duration: 0.3,
          ease: "none"
        });
        
        gsap.to(wave3Ref.current, {
          y: scrollY * 0.02,
          duration: 0.3,
          ease: "none"
        });
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);

    }, wavesRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wavesRef} className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
      <svg
        className="relative block w-full h-32 md:h-40 lg:h-48"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="wave1Gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(248, 232, 0, 0.3)" />
            <stop offset="100%" stopColor="rgba(248, 232, 0, 0.1)" />
          </linearGradient>
          
          <linearGradient id="wave2Gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(39, 40, 96, 0.4)" />
            <stop offset="100%" stopColor="rgba(39, 40, 96, 0.2)" />
          </linearGradient>
          
          <linearGradient id="wave3Gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(248, 232, 0, 0.2)" />
            <stop offset="100%" stopColor="rgba(39, 40, 96, 0.3)" />
          </linearGradient>
        </defs>
        
        {/* Wave 1 - Primary */}
        <path
          ref={wave1Ref}
          fill="url(#wave1Gradient)"
          opacity="0.7"
        />
        
        {/* Wave 2 - Secondary */}
        <path
          ref={wave2Ref}
          fill="url(#wave2Gradient)"
          opacity="0.8"
        />
        
        {/* Wave 3 - Tertiary */}
        <path
          ref={wave3Ref}
          fill="url(#wave3Gradient)"
          opacity="0.6"
        />
      </svg>
      
      {/* Additional decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background/50 to-transparent" />
    </div>
  );
}
