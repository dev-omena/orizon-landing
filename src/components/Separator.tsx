'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

// Generate random binary sequences - moved outside component
const generateBinarySequence = (length: number) => {
  return Array.from({ length }, () => Math.floor(Math.random() * 2));
};

interface SeparatorProps {
  showBorderTop?: boolean;
}

const Separator = ({ showBorderTop = false }: SeparatorProps) => {
  const [isInView, setIsInView] = useState(false);
  const separatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (separatorRef.current) {
      observer.observe(separatorRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const [binarySequence1, setBinarySequence1] = useState(() => generateBinarySequence(15));
  const [binarySequence2, setBinarySequence2] = useState(() => generateBinarySequence(30));
  const [binarySequence3, setBinarySequence3] = useState(() => generateBinarySequence(25));
  const [binarySequence4, setBinarySequence4] = useState(() => generateBinarySequence(20));

  // Animate all binary digits together at the same time
  useEffect(() => {
    if (!isInView) return;

    const interval = setInterval(() => {
      // All blocks change together at the same time
      setBinarySequence1(generateBinarySequence(15));
      setBinarySequence2(generateBinarySequence(30));
      setBinarySequence3(generateBinarySequence(25));
      setBinarySequence4(generateBinarySequence(20));
    }, 100); // All change together every 100ms

    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <div 
      ref={separatorRef}
      className={`separator relative w-full h-6 flex items-center justify-between px-4 bg-orizon-primary border-b border-orizon-secondary ${
        showBorderTop ? 'border-t border-orizon-secondary' : ''
      } ${
        isInView ? 'is-in-view' : ''
      }`}
      style={{ 
        fontFamily: 'monospace',
        fontSize: 'var(--sep-font, 8px)',
        lineHeight: 'var(--sep-line, 16px)',
        margin: 0,
        padding: 'var(--sep-py, 0) var(--sep-px, 1rem)',
        height: 'var(--sep-h, 24px)'
      }}
    >
      <style>{`
        /* Compact separator on small screens */
        @media (max-width: 640px) {
          .separator { 
            --sep-font: 6px; 
            --sep-line: 12px; 
            --sep-h: 18px; 
            --sep-px: 0.5rem; 
            --sep-py: 0; 
            --sep-slash-line: 6px; 
            --sep-tri-scale: 0.8; 
            --sep-tri-offset: 1px; 
            --sep-gap: 6px;
            --digit-scale: 0.75;
          }
          .separator .inner { padding-left: 0.5rem; padding-right: 0.5rem; }
        }

        /* Numbers smaller than slashes */
        .separator .digit { font-size: calc(var(--sep-font, 8px) * var(--digit-scale, 0.9)); }
        .separator .slash { margin: 0 var(--sep-gap, 8px); }
        .separator .bin { padding-right: calc(var(--sep-gap, 8px) / 2); }
      `}</style>
      {/* Left Triangle */}
      <div 
        className="tri absolute left-4 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-0 border-r-4  border-b-2 border-l-transparent border-r-orizon-secondary border-t-transparent border-b-transparent"
        style={{ transform: 'translateY(calc(-1 * var(--sep-tri-offset, 1.6px))) scale(var(--sep-tri-scale, 1))' }}
      ></div>

      {/* Content Container */}
      <div className="inner flex items-center justify-between flex-1 px-3">
        {/* First Binary Sequence */}
        <div className="bin flex items-center">
          {binarySequence1.map((digit, index) => (
            <span
              key={index}
              className="text-orizon-secondary font-mono digit"
              style={{ 
                color: 'transparent',
                textShadow: '0 0 1px #f8e800'
              }}
            >
              {digit}
            </span>
          ))}
        </div>

        {/* Slash Separator */}
        <div 
          className="slash h-2 overflow-hidden text-orizon-secondary"
          style={{ 
            textShadow: '0 0 1px #f8e800',
            lineHeight: 'var(--sep-slash-line, 8px)'
          }}
        >
          /////////////////////////////////
        </div>

        {/* Second Binary Sequence */}
        <div className="bin flex items-center">
          {binarySequence2.map((digit, index) => (
            <span
              key={index}
              className="text-orizon-secondary font-mono digit"
              style={{ 
                color: 'transparent',
                textShadow: '0 0 1px #f8e800'
              }}
            >
              {digit}
            </span>
          ))}
        </div>

        {/* Slash Separator */}
        <div  
          className="slash h-2 overflow-hidden text-orizon-secondary"
          style={{ 
            textShadow: '0 0 1px #f8e800',
            lineHeight: 'var(--sep-slash-line, 8px)'
          }}
        >
          /////////////////////////////////
        </div>

        {/* Third Binary Sequence */}
        <div className="bin flex items-center">
          {binarySequence3.map((digit, index) => (
            <span
              key={index}
              className="text-orizon-secondary font-mono digit"
              style={{ 
                color: 'transparent',
                textShadow: '0 0 1px #f8e800'
              }}
            >
              {digit}
            </span>
          ))}
        </div>

        {/* Slash Separator */}
        <div 
          className="slash h-2 overflow-hidden text-orizon-secondary"
          style={{ 
            textShadow: '0 0 1px #f8e800',
            lineHeight: 'var(--sep-slash-line, 8px)'
          }}
        >
          /////////////////////////////////
        </div>

        {/* Fourth Binary Sequence */}
        <div className="bin flex items-center">
          {binarySequence4.map((digit, index) => (
            <span
              key={index}
              className="text-orizon-secondary font-mono digit"
              style={{ 
                color: 'transparent',
                textShadow: '0 0 1px #f8e800'
              }}
            >
              {digit}
            </span>
          ))}
        </div>
      </div>

      {/* Right Triangle */}
      <div 
        className="tri absolute right-4 top-1/2 transform -translate-y-1/2 w-0 h-0 border-r-0 border-l-4 border-t-2 border-b-2 border-r-transparent border-l-orizon-secondary border-t-transparent border-b-transparent"
        style={{ transform: 'translateY(calc(-1 * var(--sep-tri-offset, 1.6px))) scale(var(--sep-tri-scale, 1))' }}
      ></div>
    </div>
  );
};

export default Separator;
