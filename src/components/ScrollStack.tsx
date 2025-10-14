import React, { ReactNode, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface ScrollStackItemProps {
  itemClassName?: string;
  children: ReactNode;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({ children, itemClassName = '' }) => (
  <div
    className={`scroll-stack-card ${itemClassName}`.trim()}
  >
    {children}
  </div>
);

interface ScrollStackProps {
  className?: string;
  children: ReactNode;
}

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = ''
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const cardsContainer = cardsContainerRef.current;

    if (!section || !cardsContainer) return;

    const cards = Array.from(
      cardsContainer.querySelectorAll('.scroll-stack-card')
    ) as HTMLElement[];

    if (cards.length === 0) return;

    const scrollLength = cards.length * 120; // 120% per card

    let currentScrollTrigger: ScrollTrigger | null = null;

    // Create ScrollTrigger with pin (like WorkSectionWithPortal)
    currentScrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: `+=${scrollLength}%`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const totalCards = cards.length;

        // Continuous progress calculation (no floor)
        const continuousIndex = progress * totalCards;

        cards.forEach((card, i) => {
          // Calculate smooth transition progress for each card
          const cardStart = i / totalCards;
          const cardEnd = (i + 1) / totalCards;
          const cardProgress = (progress - cardStart) / (cardEnd - cardStart);

          // Clamp cardProgress between 0 and 1
          const clampedProgress = Math.max(0, Math.min(1, cardProgress));

          if (continuousIndex < i) {
            // Future cards - waiting below
            gsap.to(card, {
              yPercent: 100,
              opacity: 1,
              scale: 0.9,
              zIndex: i,
              duration: 0.3,
              ease: 'power2.out'
            });
          } else if (continuousIndex >= i && continuousIndex < i + 1) {
            // Current card - animating in
            const yPos = 100 * (1 - clampedProgress);
            const scaleVal = 0.9 + (clampedProgress * 0.1);

            gsap.to(card, {
              yPercent: yPos,
              opacity: 1,
              scale: scaleVal,
              zIndex: 100 + i,
              duration: 0.3,
              ease: 'power2.out'
            });
          } else {
            // Past cards - stacked at top
            const stackDepth = Math.floor(continuousIndex) - i;
            const stackOffset = Math.min(stackDepth * 8, 40);

            gsap.to(card, {
              yPercent: 0,
              y: -stackOffset,
              opacity: 1,
              scale: Math.max(0.85, 1 - (stackDepth * 0.03)),
              zIndex: i,
              duration: 0.3,
              ease: 'power2.out'
            });
          }
        });
      }
    });

    return () => {
      if (currentScrollTrigger) {
        currentScrollTrigger.kill();
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`scroll-stack-section ${className}`.trim()}
    >
      <style>{`
        .scroll-stack-section {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }
        .scroll-stack-container {
          position: relative;
          width: 100%;
          height: 100%;
          padding: 10vh 1rem;
        }
        @media (min-width: 640px) {
          .scroll-stack-container {
            padding: 10vh 2rem;
          }
        }
        @media (min-width: 768px) {
          .scroll-stack-container {
            padding: 10vh 5rem;
          }
        }
        .scroll-stack-card {
          position: absolute;
          top: 10vh;
          left: 1rem;
          right: 1rem;
          transform-origin: top center;
          will-change: transform, opacity;
          backface-visibility: hidden;
        }
        @media (min-width: 640px) {
          .scroll-stack-card {
            left: 2rem;
            right: 2rem;
          }
        }
        @media (min-width: 768px) {
          .scroll-stack-card {
            left: 5rem;
            right: 5rem;
          }
        }
      `}</style>

      <div className="scroll-stack-container" ref={cardsContainerRef}>
        {children}
      </div>
    </section>
  );
};

export default ScrollStack;
