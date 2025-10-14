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

    // Set initial state - all cards hidden until trigger starts
    cards.forEach((card) => {
      gsap.set(card, {
        opacity: 0,
        visibility: 'hidden',
      });
    });

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
      onEnter: () => {
        // Show cards stacked together when section is pinned
        cards.forEach((card, i) => {
          const stackOffset = i * 8;
          const scaleVal = Math.max(0.85, 1 - (i * 0.03));

          gsap.set(card, {
            xPercent: -50,
            yPercent: -50,
            y: stackOffset,
            opacity: 1,
            visibility: 'visible',
            scale: scaleVal,
            zIndex: cards.length - i,
          });
        });
      },
      onLeaveBack: () => {
        // Hide cards when scrolling back before section
        cards.forEach((card) => {
          gsap.set(card, {
            opacity: 0,
            visibility: 'hidden',
          });
        });
      },
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
              xPercent: -50,
              yPercent: 50,
              opacity: 1,
              scale: 0.9,
              zIndex: i,
              duration: 0.3,
              ease: 'power2.out'
            });
          } else if (continuousIndex >= i && continuousIndex < i + 1) {
            // Current card - animating in
            const yPos = 50 - (100 * clampedProgress);
            const scaleVal = 0.9 + (clampedProgress * 0.1);

            gsap.to(card, {
              xPercent: -50,
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
              xPercent: -50,
              yPercent: -50,
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
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .scroll-stack-container {
          position: relative;
          width: 100%;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .scroll-stack-card {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: calc(100% - 2rem);
          max-width: 1200px;
          transform-origin: center center;
          will-change: transform, opacity;
          backface-visibility: hidden;
        }
        @media (min-width: 640px) {
          .scroll-stack-card {
            width: calc(100% - 4rem);
          }
        }
        @media (min-width: 768px) {
          .scroll-stack-card {
            width: calc(100% - 10rem);
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
