'use client';

import React, { useState } from 'react';

interface InteractiveCTAProps {
  onHoverChange?: (isHovered: boolean) => void;
}

const InteractiveCTA: React.FC<InteractiveCTAProps> = ({ onHoverChange }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHoverChange?.(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHoverChange?.(false);
  };

  return (
    <div className="relative flex items-center justify-center h-full">
      {/* Main CTA Container */}
      <div 
        className="relative cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* GO Button */}
        <div className={`relative z-10 w-32 h-32 bg-orizon-secondary rounded-full flex items-center justify-center transition-all duration-1000 ease-out delay-200 hover:scale-110 ${isHovered ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}`}>
          <div className="text-orizon-primary font-black text-7xl tracking-wider uppercase">
            GO
          </div>
        </div>

        {/* Expanding Circle Background with Dual Border */}
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[437px] h-[437px] rounded-full transition-all duration-600 ease-out"
          style={{
            clipPath: isHovered ? 'circle(218.5px at 50% 50%)' : 'circle(64px at 50% 50%)',
            background: 'linear-gradient(45deg, #f8e800 0%, #f8e800 100%)',
            padding: '6px'
          }}
        >
          <div 
            className="w-full h-full bg-orizon-primary rounded-full"
            style={{
              background: 'linear-gradient(45deg, #272860 0%, #272860 100%)',
              padding: '8px'
            }}
          >
            <div className="w-full h-full bg-orizon-secondary rounded-full">
          {/* LET'S ROCK Text Container */}
          <a 
            href="mailto:hi@omena.co"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-orizon-primary font-black text-8xl leading-none text-center uppercase cursor-pointer hover:opacity-80 transition-opacity duration-300"
          >
            {/* LET'S - Top Line */}
            <div className="flex items-center justify-center mb-2">
              {/* L */}
              <div className="relative inline-block">
                <span className="block animate-bounce-up-down" style={{ animationDelay: '0.1s' }}>L</span>
                <span className="absolute top-0 left-0 block animate-bounce-up-down animate-char-toggle" style={{ animationDelay: '0.24s', clipPath: 'inset(0 0 calc(100% - 4.9px) 0)' }}>L</span>
                <span className="absolute top-0 left-0 block animate-bounce-up-down animate-char-toggle" style={{ animationDelay: '0.2s', clipPath: 'inset(0 0 calc(100% - 9.8px) 0)' }}>L</span>
                <span className="absolute top-0 left-0 block animate-bounce-up-down animate-char-toggle" style={{ animationDelay: '0.16s', clipPath: 'inset(0 0 calc(100% - 14.7px) 0)' }}>L</span>
              </div>
              
              {/* E */}
              <div className="relative inline-block">
                <span className="block animate-bounce-up-down" style={{ animationDelay: '0.2s' }}>E</span>
                <span className="absolute top-0 left-0 block animate-bounce-up-down animate-char-toggle" style={{ animationDelay: '0.34s', clipPath: 'inset(0 0 calc(100% - 4.9px) 0)' }}>E</span>
                <span className="absolute top-0 left-0 block animate-bounce-up-down animate-char-toggle" style={{ animationDelay: '0.3s', clipPath: 'inset(0 0 calc(100% - 9.8px) 0)' }}>E</span>
                <span className="absolute top-0 left-0 block animate-bounce-up-down animate-char-toggle" style={{ animationDelay: '0.26s', clipPath: 'inset(0 0 calc(100% - 14.7px) 0)' }}>E</span>
              </div>
              
              {/* T */}
              <div className="relative inline-block">
                <span className="block animate-bounce-up-down" style={{ animationDelay: '0.3s' }}>
                  T<sup className="text-4xl">'</sup>
                </span>
                <span className="absolute top-0 left-0 block animate-bounce-up-down animate-char-toggle" style={{ animationDelay: '0.44s', clipPath: 'inset(0 0 calc(100% - 4.9px) 0)' }}>
                  T<sup className="text-4xl">'</sup>
                </span>
                <span className="absolute top-0 left-0 block animate-bounce-up-down animate-char-toggle" style={{ animationDelay: '0.4s', clipPath: 'inset(0 0 calc(100% - 9.8px) 0)' }}>
                  T<sup className="text-4xl">'</sup>
                </span>
                <span className="absolute top-0 left-0 block animate-bounce-up-down animate-char-toggle" style={{ animationDelay: '0.36s', clipPath: 'inset(0 0 calc(100% - 14.7px) 0)' }}>
                  T<sup className="text-4xl">'</sup>
                </span>
              </div>
              
              {/* S */}
              <div className="relative inline-block">
                <span className="block animate-bounce-up-down" style={{ animationDelay: '0.4s' }}>S</span>
                <span className="absolute top-0 left-0 block animate-bounce-up-down animate-char-toggle" style={{ animationDelay: '0.54s', clipPath: 'inset(0 0 calc(100% - 4.9px) 0)' }}>S</span>
                <span className="absolute top-0 left-0 block animate-bounce-up-down animate-char-toggle" style={{ animationDelay: '0.5s', clipPath: 'inset(0 0 calc(100% - 9.8px) 0)' }}>S</span>
                <span className="absolute top-0 left-0 block animate-bounce-up-down animate-char-toggle" style={{ animationDelay: '0.46s', clipPath: 'inset(0 0 calc(100% - 14.7px) 0)' }}>S</span>
              </div>
            </div>

            {/* ROCK - Bottom Line */}
            <div className="flex items-center justify-center">
              {/* R */}
              <div className="relative inline-block">
                <span className="block animate-bounce-up-down" style={{ animationDelay: '0.1s' }}>R</span>
                <span className="absolute top-0 left-0 block animate-bounce-up-down animate-char-toggle" style={{ animationDelay: '1.69s', clipPath: 'inset(calc(100% - 4.9px) 0 0 0)' }}>R</span>
                <span className="absolute top-0 left-0 block animate-bounce-up-down animate-char-toggle" style={{ animationDelay: '1.65s', clipPath: 'inset(calc(100% - 9.8px) 0 0 0)' }}>R</span>
                <span className="absolute top-0 left-0 block animate-bounce-up-down animate-char-toggle" style={{ animationDelay: '1.61s', clipPath: 'inset(calc(100% - 14.7px) 0 0 0)' }}>R</span>
              </div>
              
              {/* O */}
              <div className="relative inline-block">
                <span className="block animate-bounce-up-down" style={{ animationDelay: '0.2s' }}>O</span>
                <span className="absolute top-0 left-0 block animate-bounce-up-down animate-char-toggle" style={{ animationDelay: '1.79s', clipPath: 'inset(calc(100% - 4.9px) 0 0 0)' }}>O</span>
                <span className="absolute top-0 left-0 block animate-bounce-up-down animate-char-toggle" style={{ animationDelay: '1.75s', clipPath: 'inset(calc(100% - 9.8px) 0 0 0)' }}>O</span>
                <span className="absolute top-0 left-0 block animate-bounce-up-down animate-char-toggle" style={{ animationDelay: '1.71s', clipPath: 'inset(calc(100% - 14.7px) 0 0 0)' }}>O</span>
              </div>
              
              {/* C */}
              <div className="relative inline-block">
                <span className="block animate-bounce-up-down" style={{ animationDelay: '0.3s' }}>C</span>
                <span className="absolute top-0 left-0 block animate-bounce-up-down animate-char-toggle" style={{ animationDelay: '1.89s', clipPath: 'inset(calc(100% - 4.9px) 0 0 0)' }}>C</span>
                <span className="absolute top-0 left-0 block animate-bounce-up-down animate-char-toggle" style={{ animationDelay: '1.85s', clipPath: 'inset(calc(100% - 9.8px) 0 0 0)' }}>C</span>
                <span className="absolute top-0 left-0 block animate-bounce-up-down animate-char-toggle" style={{ animationDelay: '1.81s', clipPath: 'inset(calc(100% - 14.7px) 0 0 0)' }}>C</span>
              </div>
              
              {/* K */}
              <div className="relative inline-block">
                <span className="block animate-bounce-up-down" style={{ animationDelay: '0.4s' }}>K</span>
                <span className="absolute top-0 left-0 block animate-bounce-up-down animate-char-toggle" style={{ animationDelay: '1.99s', clipPath: 'inset(calc(100% - 4.9px) 0 0 0)' }}>K</span>
                <span className="absolute top-0 left-0 block animate-bounce-up-down animate-char-toggle" style={{ animationDelay: '1.95s', clipPath: 'inset(calc(100% - 9.8px) 0 0 0)' }}>K</span>
                <span className="absolute top-0 left-0 block animate-bounce-up-down animate-char-toggle" style={{ animationDelay: '1.91s', clipPath: 'inset(calc(100% - 14.7px) 0 0 0)' }}>K</span>
              </div>
            </div>
          </a>

          {/* Email Address - Text Only */}
          <div 
            className={`absolute top-[375px] left-1/2 transform -translate-x-1/2 z-30 text-orizon-primary font-bold text-sm tracking-wider uppercase transition-all duration-300 ${
              isHovered 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: isHovered ? '0.3s' : '0s' }}
          >
            hi@omena.co
          </div>

          {/* Floating Stars */}
          <div className="absolute top-0 left-0 w-full h-full scale-125 transition-transform duration-800 ease-out">
            <svg 
              className="absolute w-4 h-4 text-orizon-primary animate-float-star" 
              style={{ top: '52px', left: '109px', animationDuration: '8s' }}
              viewBox="0 0 49 49" 
              fill="currentColor"
            >
              <path d="m24.5 0 3.3 21.2L49 24.5l-21.2 3.3L24.5 49l-3.3-21.2L0 24.5l21.2-3.3L24.5 0z" />
            </svg>
            
            <svg 
              className="absolute w-3 h-3 text-orizon-primary animate-float-star" 
              style={{ top: '144px', left: '371px', animationDuration: '9s' }}
              viewBox="0 0 49 49" 
              fill="currentColor"
            >
              <path d="m24.5 0 3.3 21.2L49 24.5l-21.2 3.3L24.5 49l-3.3-21.2L0 24.5l21.2-3.3L24.5 0z" />
            </svg>
            
            <svg 
              className="absolute w-3 h-3 text-orizon-primary animate-float-star" 
              style={{ top: '262px', left: '48px', animationDuration: '7s' }}
              viewBox="0 0 49 49" 
              fill="currentColor"
            >
              <path d="m24.5 0 3.3 21.2L49 24.5l-21.2 3.3L24.5 49l-3.3-21.2L0 24.5l21.2-3.3L24.5 0z" />
            </svg>
            
            <svg 
              className="absolute w-4 h-4 text-orizon-primary animate-float-star" 
              style={{ top: '345px', left: '341px', animationDuration: '10s' }}
              viewBox="0 0 49 49" 
              fill="currentColor"
            >
              <path d="m24.5 0 3.3 21.2L49 24.5l-21.2 3.3L24.5 49l-3.3-21.2L0 24.5l21.2-3.3L24.5 0z" />
            </svg>
          </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveCTA;
