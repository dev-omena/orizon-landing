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
      className={`relative w-full h-6 flex items-center justify-between px-4 bg-orizon-primary border-b border-orizon-secondary ${
        showBorderTop ? 'border-t border-orizon-secondary' : ''
      } ${
        isInView ? 'is-in-view' : ''
      }`}
      style={{ fontFamily: 'monospace', fontSize: '8px', lineHeight: '16px', margin: 0, padding: '0 1rem' }}
    >
      {/* Left Triangle */}
      <div 
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-0 border-r-4  border-b-2 border-l-transparent border-r-orizon-secondary border-t-transparent border-b-transparent"
        style={{ transform: 'translateY(-1.6px)' }}
      ></div>

      {/* Content Container */}
      <div className="flex items-center justify-between flex-1 px-3">
        {/* First Binary Sequence */}
        <div className="flex items-center">
          {binarySequence1.map((digit, index) => (
            <span
              key={index}
              className="text-orizon-secondary font-mono text-xs"
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
          className="h-2 overflow-hidden text-orizon-secondary"
          style={{ 
            textShadow: '0 0 1px #f8e800',
            lineHeight: '8px'
          }}
        >
          /////////////////////////////////
        </div>

        {/* Second Binary Sequence */}
        <div className="flex items-center">
          {binarySequence2.map((digit, index) => (
            <span
              key={index}
              className="text-orizon-secondary font-mono text-xs"
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
          className="h-2 overflow-hidden text-orizon-secondary"
          style={{ 
            textShadow: '0 0 1px #f8e800',
            lineHeight: '8px'
          }}
        >
          /////////////////////////////////
        </div>

        {/* Third Binary Sequence */}
        <div className="flex items-center">
          {binarySequence3.map((digit, index) => (
            <span
              key={index}
              className="text-orizon-secondary font-mono text-xs"
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
          className="h-2 overflow-hidden text-orizon-secondary"
          style={{ 
            textShadow: '0 0 1px #f8e800',
            lineHeight: '8px'
          }}
        >
          /////////////////////////////////
        </div>

        {/* Fourth Binary Sequence */}
        <div className="flex items-center">
          {binarySequence4.map((digit, index) => (
            <span
              key={index}
              className="text-orizon-secondary font-mono text-xs"
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
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-0 h-0 border-r-0 border-l-4 border-t-2 border-b-2 border-r-transparent border-l-orizon-secondary border-t-transparent border-b-transparent"
        style={{ transform: 'translateY(-1.6px)' }}
      ></div>
    </div>
  );
};

export default Separator;
