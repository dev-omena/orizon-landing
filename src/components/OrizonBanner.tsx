'use client';

import { useEffect, useRef, useState } from 'react';

interface OrizonBannerProps {
  className?: string;
}

export default function OrizonBanner({ className = '' }: OrizonBannerProps) {
  const [animatingIndices, setAnimatingIndices] = useState<number[]>([]);
  const [directions, setDirections] = useState<{[key: number]: 'left' | 'right' | 'up' | 'down'}>({});
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const chars = titleRef.current?.querySelectorAll('.char');
    if (!chars) return;

    const animateTwoChars = () => {
      const allChars = Array.from(chars);
      const firstIndex = Math.floor(Math.random() * allChars.length);
      let secondIndex;
      
      // Ensure second character is different from first
      do {
        secondIndex = Math.floor(Math.random() * allChars.length);
      } while (secondIndex === firstIndex);

      // Get directions for both characters
      const getDirection = (charIndex: number): 'left' | 'right' | 'up' | 'down' => {
        const selectedChar = allChars[charIndex] as HTMLElement;
        const hasToLeft = selectedChar.classList.contains('to-left');
        const hasToRight = selectedChar.classList.contains('to-right');
        const hasToTop = selectedChar.classList.contains('to-top');
        const hasToBottom = selectedChar.classList.contains('to-bottom');
        
        if (hasToLeft) return 'left';
        else if (hasToRight) return 'right';
        else if (hasToTop) return 'up';
        else if (hasToBottom) return 'down';
        else {
          const directions: ('left' | 'right' | 'up' | 'down')[] = ['left', 'right', 'up', 'down'];
          return directions[Math.floor(Math.random() * directions.length)];
        }
      };

      const firstDirection = getDirection(firstIndex);
      const secondDirection = getDirection(secondIndex);

      // Set both characters animating at the same time
      setAnimatingIndices([firstIndex, secondIndex]);
      setDirections({
        [firstIndex]: firstDirection,
        [secondIndex]: secondDirection
      });

      // Reset after animation completes
      setTimeout(() => {
        setAnimatingIndices([]);
        setDirections({});
      }, 1500);
    };

    // Initial animation - start with two characters
    const initialTimeout = setTimeout(animateTwoChars, 1200);

    // Set up continuous animation with two characters
    const getRandomInterval = () => 3000 + Math.random() * 2000; // Slightly longer interval for two chars
    let intervalId: NodeJS.Timeout;
    
    const scheduleNext = () => {
      intervalId = setTimeout(() => {
        animateTwoChars();
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
      const isAnimating = animatingIndices.includes(globalIndex);
      const charDirection = directions[globalIndex] || 'right';
      
      // Calculate push distance based on direction
      const getOriginalTransform = () => {
        if (!isAnimating) return 'translate(0, 0)';
        
        switch (charDirection) {
          case 'left': return 'translate(-100%, 0)';
          case 'right': return 'translate(100%, 0)';
          case 'up': return 'translate(0, -100%)';
          case 'down': return 'translate(0, 100%)';
          default: return 'translate(0, 0)';
        }
      };

      const getDuplicateInitialTransform = () => {
        switch (charDirection) {
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
            overflow: 'visible',
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
           font-size: clamp(4rem, 12vw, 20rem);
           font-weight: 700;
           line-height: 0.75;
           font-family: var(--font-family-bigger);
           text-transform: uppercase;
           padding: 0;
           flex-wrap: nowrap;
           justify-content: center;
           white-space: nowrap;
           overflow: visible;
           width: 100%;
           max-width: 100%;
         }
      `}</style>
       <div
         className={`relative w-full bg-orizon-primary h-full flex items-center justify-center overflow-visible ${className}`}
         style={{ borderBottom: '1px solid #f8e800', paddingTop: '3rem', paddingBottom: '3rem' }}
       >
         <div className="flex items-center justify-center overflow-visible w-full h-full" style={{ padding: 0, margin: 0 }}>
           <h1
             ref={titleRef}
             className="s__title text-orizon-secondary"
             style={{ margin: 0, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
           >
            <span className="s__title__word js-word" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }} className="word">
                {renderAnimatedText('OMENA', 0)}
              </div>
            </span>
             <svg
               className="s__title__asset js-star text-orizon-secondary"
              width="48"
              height="48"
              viewBox="0 0 49 49"
              style={{
                display: 'inline-flex',
                alignSelf: 'center',
                translate: 'none',
                rotate: 'none',
                scale: 'none',
                transform: 'translate(0px, 0px)',
                margin: '0 1rem',
                flexShrink: 0
              }}
            >
              <path 
                fill="currentColor" 
                d="m24.5 0 3.3 21.2L49 24.5l-21.2 3.3L24.5 49l-3.3-21.2L0 24.5l21.2-3.3L24.5 0z"
              />
            </svg>
            <span className="s__title__word js-word" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }} className="word">
                {renderAnimatedText('AGENCY', 6)}
              </div>
            </span>
          </h1>
        </div>
      </div>
    </>
  );
}