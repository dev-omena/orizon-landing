'use client';

import { useEffect, useRef, useState } from 'react';

interface OrizonBannerProps {
  className?: string;
}

export default function OrizonBanner({ className = '' }: OrizonBannerProps) {
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<'left' | 'right' | 'up' | 'down'>('right');
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const chars = titleRef.current?.querySelectorAll('.char');
    if (!chars) return;

    const animateRandomChar = () => {
      const allChars = Array.from(chars);
      const randomIndex = Math.floor(Math.random() * allChars.length);
      const selectedChar = allChars[randomIndex] as HTMLElement;
      
      // Check for directional classes
      const hasToLeft = selectedChar.classList.contains('to-left');
      const hasToRight = selectedChar.classList.contains('to-right');
      const hasToTop = selectedChar.classList.contains('to-top');
      const hasToBottom = selectedChar.classList.contains('to-bottom');
      
      // Determine direction
      let animDirection: 'left' | 'right' | 'up' | 'down';
      if (hasToLeft) animDirection = 'left';
      else if (hasToRight) animDirection = 'right';
      else if (hasToTop) animDirection = 'up';
      else if (hasToBottom) animDirection = 'down';
      else {
        const directions: ('left' | 'right' | 'up' | 'down')[] = ['left', 'right', 'up', 'down'];
        animDirection = directions[Math.floor(Math.random() * directions.length)];
      }

      setDirection(animDirection);
      setAnimatingIndex(randomIndex);

      // Don't reset - keep the new character in place
      setTimeout(() => {
        setAnimatingIndex(null);
      }, 1100);
    };

    // Initial animation
    const initialTimeout = setTimeout(animateRandomChar, 1200);

    // Set up continuous animation
    const getRandomInterval = () => 2500 + Math.random() * 1500;
    let intervalId: NodeJS.Timeout;
    
    const scheduleNext = () => {
      intervalId = setTimeout(() => {
        animateRandomChar();
        scheduleNext();
      }, getRandomInterval());
    };
    
    scheduleNext();

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(intervalId);
    };
  }, []);

  const renderAnimatedText = (text: string, startIndex: number) => {
    return text.split('').map((letter, index) => {
      const globalIndex = startIndex + index;
      const directionClasses = ['', 'to-left', 'to-right', 'to-top', 'to-bottom'];
      const randomDirection = directionClasses[Math.floor(Math.random() * directionClasses.length)];
      const isAnimating = animatingIndex === globalIndex;
      
      // Calculate push distance based on direction
      const getOriginalTransform = () => {
        if (!isAnimating) return 'translate(0, 0)';
        
        switch (direction) {
          case 'left': return 'translate(-100%, 0)';
          case 'right': return 'translate(100%, 0)';
          case 'up': return 'translate(0, -100%)';
          case 'down': return 'translate(0, 100%)';
          default: return 'translate(0, 0)';
        }
      };

      const getDuplicateInitialTransform = () => {
        switch (direction) {
          case 'left': return 'translate(100%, 0)';
          case 'right': return 'translate(-100%, 0)';
          case 'up': return 'translate(0, 100%)';
          case 'down': return 'translate(0, -100%)';
        }
      };

      return (
        <div 
          key={globalIndex}
          className={`char char--${letter.toLowerCase()} ${randomDirection}`}
          style={{ 
            position: 'relative', 
            display: 'inline-block',
            overflow: 'hidden',
          }}
        >
          <span 
            className="char__inner"
            data-letter={letter}
            style={{
              position: 'relative',
              display: 'inline-block',
               transform: getOriginalTransform(),
               transition: isAnimating ? 'transform 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'none',
            }}
          >
            {letter}
          </span>
          {isAnimating && (
            <span 
              className="char__inner"
              data-letter={letter}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                display: 'inline-block',
                ['--push-from' as any]: getDuplicateInitialTransform(),
                 animation: 'pushIn 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
              }}
            >
              {letter}
            </span>
          )}
        </div>
      );
    });
  };

  return (
    <>
      <style>{`
        @keyframes pushIn {
          from {
            transform: var(--push-from);
          }
          to {
            transform: translate(0, 0);
          }
        }
        
         .s__title {
           --color-primary: #f40c3f;
           --color-secondary: #160000;
           --font-family-bigger: system-ui, -apple-system, sans-serif;
           
           flex-grow: 0;
           flex-shrink: 0;
           display: flex;
           flex-direction: row;
           align-items: center;
           margin: 0;
           cursor: default;
           font: 700 2.2rem / 0.8 var(--font-family-bigger);
           text-transform: uppercase;
           padding: 0.5rem;
           flex-wrap: nowrap;
           justify-content: center;
           white-space: nowrap;
           overflow: hidden;
         }
         
         @media (min-width: 480px) {
           .s__title {
             font-size: 3rem;
           }
         }
         
         @media (min-width: 640px) {
           .s__title {
             font-size: 4.2rem;
           }
         }
         
         @media (min-width: 768px) {
           .s__title {
             font-size: 5.5rem;
           }
         }
         
         @media (min-width: 1024px) {
           .s__title {
             font-size: 7rem;
           }
         }
         
         @media (min-width: 1280px) {
           .s__title {
             font-size: 8.5rem;
           }
         }
         
         @media (min-width: 1536px) {
           .s__title {
             font-size: 10rem;
           }
         }
      `}</style>
       <div 
         className={`relative w-full bg-orizon-primary border-b border-orizon-secondary py-2 md:py-4 ${className}`}
       >
         <div className="flex items-center justify-center overflow-hidden">
           <h1 
             ref={titleRef}
             className="s__title text-orizon-secondary"
           >
            <span className="s__title__word js-word" style={{ position: 'relative', display: 'inline-block' }}>
              <div style={{ position: 'relative', display: 'inline-block' }} className="word">
                {renderAnimatedText('ORIZON', 0)}
              </div>
            </span>
             <svg 
               className="s__title__asset js-star text-orizon-secondary"
              width="48" 
              height="48" 
              viewBox="0 0 49 49"
              style={{ 
                display: 'inline-block',
                verticalAlign: 'middle',
                translate: 'none',
                rotate: 'none',
                scale: 'none',
                transform: 'translate(0px, 0px)',
                margin: '0 1rem'
              }} 
            >
              <path 
                fill="currentColor" 
                d="m24.5 0 3.3 21.2L49 24.5l-21.2 3.3L24.5 49l-3.3-21.2L0 24.5l21.2-3.3L24.5 0z"
              />
            </svg>
            <span className="s__title__word js-word" style={{ position: 'relative', display: 'inline-block' }}>
              <div style={{ position: 'relative', display: 'inline-block' }} className="word">
                {renderAnimatedText('STUDIOS', 7)}
              </div>
            </span>
          </h1>
        </div>
      </div>
    </>
  );
}