'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface OrizonBannerProps {
  className?: string;
}

export default function OrizonBanner({ className = '' }: OrizonBannerProps) {
  const bannerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!bannerRef.current || !titleRef.current) return;

    const ctx = gsap.context(() => {
      // Get all character elements
      const chars = titleRef.current?.querySelectorAll('.char');
      
      if (chars) {
        // Set initial state - show all characters normally
        gsap.set(chars, {
          opacity: 1,
          y: 0,
          x: 0,
          rotation: 0,
          scale: 1
        });

        // Function to animate one random letter with opposite direction
        const animateRandomLetter = () => {
          // Get all characters
          const allChars = Array.from(chars);
          
          // Select only 1 random letter
          const selectedChar = allChars[Math.floor(Math.random() * allChars.length)];
          
          // Check for directional classes
          const hasToLeft = selectedChar.classList.contains('to-left');
          const hasToRight = selectedChar.classList.contains('to-right');
          const hasToUp = selectedChar.classList.contains('to-up');
          const hasToDown = selectedChar.classList.contains('to-down');
          
          // Set initial position based on class (opposite direction)
          if (hasToLeft) {
            gsap.set(selectedChar, {
              x: 120, // Opposite of left (right)
              y: 0,
              opacity: 0
            });
          } else if (hasToRight) {
            gsap.set(selectedChar, {
              x: -120, // Opposite of right (left)
              y: 0,
              opacity: 0
            });
          } else if (hasToUp) {
            gsap.set(selectedChar, {
              x: 0,
              y: 120, // Opposite of up (down)
              opacity: 0
            });
          } else if (hasToDown) {
            gsap.set(selectedChar, {
              x: 0,
              y: -120, // Opposite of down (up)
              opacity: 0
            });
          } else {
            // Default animation for characters without direction classes
            const directions = ['top', 'right', 'left'];
            const direction = directions[Math.floor(Math.random() * directions.length)];
            
            if (direction === 'top') {
              gsap.set(selectedChar, {
                y: 120, // Opposite direction
                x: 0,
                opacity: 0
              });
            } else if (direction === 'right') {
              gsap.set(selectedChar, {
                y: 0,
                x: -120, // Opposite direction
                opacity: 0
              });
            } else {
              gsap.set(selectedChar, {
                y: 0,
                x: 120, // Opposite direction
                opacity: 0
              });
            }
          }

          // Animate to final position
          gsap.to(selectedChar, {
            x: 0,
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out"
          });
        };

        // Initial animation after component loads
        setTimeout(animateRandomLetter, 1000);

        // Set up interval for continuous animation
        const interval = setInterval(animateRandomLetter, 3000);

        // Cleanup interval on unmount
        return () => {
          clearInterval(interval);
        };
      }

    }, bannerRef);

    return () => ctx.revert();
  }, []);

  // Split text into individual characters with specific classes
  const renderAnimatedText = (text: string) => {
    return text.split('').map((letter, index) => {
      // Add directional classes like the reference
      const directionClasses = ['', 'to-left', 'to-right', 'to-up', 'to-down'];
      const randomDirection = directionClasses[Math.floor(Math.random() * directionClasses.length)];
      
      return (
        <div 
          key={index}
          className={`char char--${letter.toLowerCase()} ${randomDirection}`}
          style={{ 
            position: 'relative', 
            display: 'inline-block' 
          }}
        >
          <span 
            className="char__inner"
            data-letter={letter}
            style={{
              position: 'relative',
              display: 'inline-block'
            }}
          >
            {letter}
          </span>
        </div>
      );
    });
  };

  return (
    <div 
      ref={bannerRef}
      className={`relative w-full bg-orizon-secondary border-b border-primary py-4 md:py-2 lg:py-4 ${className}`}
    >
      <div className="flex items-center justify-center">
        <div className="flex items-center justify-center w-full">
          <h1 
            ref={titleRef}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[10rem] font-black text-orizon-primary uppercase tracking-[0.05em] font-montserrat leading-none whitespace-nowrap"
            style={{ fontWeight: 900, letterSpacing: '0em', textShadow: '2px 2px 0px rgba(0,0,0,0.3)' }}
          >
            <span className="word" style={{ position: 'relative', display: 'inline-block' }}>
              {renderAnimatedText('ORIZON')}
            </span>
            <svg 
              className="s__title__asset js-star mx-4 text-orizon-primary" 
              width="48" 
              height="48" 
              viewBox="0 0 49 49"
              style={{ 
                translate: 'none', 
                rotate: 'none', 
                scale: 'none', 
                transform: 'translate(0px, 0px)',
                display: 'inline-block',
                verticalAlign: 'middle'
              }} 
            >
              <path 
                fill="currentColor" 
                d="m24.5 0 3.3 21.2L49 24.5l-21.2 3.3L24.5 49l-3.3-21.2L0 24.5l21.2-3.3L24.5 0z"
              />
            </svg>
            <span className="word" style={{ position: 'relative', display: 'inline-block' }}>
              {renderAnimatedText('STUDIOS')}
            </span>
          </h1>
        </div>
      </div>
    </div>
  );
}
