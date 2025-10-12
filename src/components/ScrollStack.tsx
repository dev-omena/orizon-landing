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
      scrub: 2,
      onUpdate: (self) => {
        const progress = self.progress;
        const totalCards = cards.length;

        // Which card should be visible
        const currentIndex = Math.min(
          Math.floor(progress * totalCards),
          totalCards - 1
        );

        cards.forEach((card, i) => {
          if (i > currentIndex) {
            // Future cards - hidden below
            gsap.set(card, {
              yPercent: 100,
              opacity: 0,
              scale: 1,
              zIndex: i
            });
          } else if (i === currentIndex) {
            // Current card - animate in from bottom
            const cardProgress = (progress * totalCards) - i;
            const yPos = 100 * (1 - cardProgress);

            gsap.set(card, {
              yPercent: Math.max(yPos, 0),
              opacity: 1,
              scale: 1 - (cardProgress * 0.05),
              zIndex: 100 + i
            });
          } else {
            // Past cards - stacked at top
            const stackDepth = currentIndex - i;
            const stackOffset = -stackDepth * 20;

            gsap.set(card, {
              yPercent: 0,
              y: stackOffset,
              opacity: 1,
              scale: 0.95 - (stackDepth * 0.02),
              zIndex: i
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
