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

    // Set initial state - all cards positioned below viewport (off-screen)
    cards.forEach((card, i) => {
      gsap.set(card, {
        xPercent: -50,
        yPercent: -50,
        x: 0,
        y: '150vh', // Start completely off-screen below using y offset
        opacity: 1,
        visibility: 'visible',
        scale: 0.8,
        zIndex: i,
      });
    });

    const scrollLength = cards.length * 200; // 200% per card for more separation

    let currentScrollTrigger: ScrollTrigger | null = null;

    // Create ScrollTrigger with smooth pin animation
    currentScrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: `+=${scrollLength}%`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      anticipatePin: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const totalCards = cards.length;

        // Each card gets its own segment of the scroll
        cards.forEach((card, i) => {
          // Calculate when this card should animate
          const cardStart = i / totalCards;
          const cardEnd = (i + 1) / totalCards;
          const isFirst = i === 0;
          // No shift; compute raw segment progress normally
          const rawProgress = (progress - cardStart) / (cardEnd - cardStart);

          // Clamp between 0 and 1
          const clampedProgress = Math.max(0, Math.min(1, rawProgress));

          if (progress < cardStart) {
            // Card is waiting in queue below - completely off-screen
            gsap.to(card, {
              xPercent: -50,
              yPercent: -50,
              x: 0,
              y: '150vh',
              opacity: 1,
              scale: 0.8,
              zIndex: i,
              duration: 0.5,
              ease: 'power2.out'
            });
          } else if (progress >= cardStart && progress < cardEnd) {
            // Card is currently animating - smooth movement from off-screen to center
            const startY = 150;
            const speedFactor = isFirst ? 4.5 : 1; // accelerate first card within its segment (faster)
            const effective = Math.max(0, Math.min(1, clampedProgress * speedFactor));
            const yOffset = startY - (startY * effective); // From 150vh to 0
            const baseScale = 0.8;
            const scaleRange = 0.2;
            const scaleVal = baseScale + (effective * scaleRange); // to 1.0

            gsap.to(card, {
              xPercent: -50,
              yPercent: -50,
              x: 0,
              y: `${yOffset}vh`,
              opacity: 1,
              scale: scaleVal,
              zIndex: 100 + i,
              duration: 0.3,
              ease: 'none',
              overwrite: true
            });
          } else {
            // Card has finished - stays at center with scale-based depth
            const totalPassed = Math.floor(progress * totalCards) - i;
            const stackScale = Math.max(0.7, 1 - (totalPassed * 0.06));

            gsap.to(card, {
              xPercent: -50,
              yPercent: -50,
              x: 0,
              y: 0,
              opacity: 1,
              scale: stackScale,
              zIndex: cards.length - totalPassed,
              duration: 0.3,
              ease: 'none',
              overwrite: true
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
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .scroll-stack-card {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: calc(100% - 2rem);
          max-width: 1400px;
          height: var(--card-h, 80vh); /* unify card height across items */
          transform-origin: center center;
          will-change: transform, opacity;
          backface-visibility: hidden;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          margin: 0 auto;
        }
        .scroll-stack-card .content-root {
          min-height: 100%;
          display: flex;
          flex-direction: column;
        }
        @media (max-width: 640px) {
          .scroll-stack-card {
            width: calc(100% - 1rem); /* a bit more width on small screens */
            max-width: none;
            border-width: 2px !important; /* override heavy borders from utilities */
            border-radius: 1rem !important;
            --card-h: calc(100vh - 1rem); /* fixed height for consistency */
          }
          .scroll-stack-card .content-root { overflow: auto; -webkit-overflow-scrolling: touch; }
        }
        @media (min-width: 640px) {
          .scroll-stack-card {
            width: calc(100% - 3rem);
            max-width: 1400px;
            --card-h: calc(100vh - 4rem);
          }
        }
        @media (min-width: 768px) {
          .scroll-stack-card {
            width: calc(100% - 6rem);
            max-width: 1500px;
            --card-h: calc(100vh - 6rem);
          }
        }
        @media (min-width: 1024px) {
          .scroll-stack-card {
            width: calc(100% - 8rem);
            max-width: 1600px;
            --card-h: calc(100vh - 8rem);
          }
        }
        @media (min-width: 1280px) {
          .scroll-stack-card {
            width: calc(100% - 12rem);
            max-width: 1800px;
            --card-h: calc(100vh - 10rem);
          }
        }
        @media (min-width: 1536px) {
          .scroll-stack-card {
            width: calc(100% - 16rem);
            max-width: 2000px;
            --card-h: calc(100vh - 12rem);
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
