import React, { useState, useEffect, useRef } from 'react';
import TextPressure from './TextPressure';
import './InteractiveCTA.css';

const lets = "LET'S";
const rock = "ROCK";

export default function InteractiveCTA() {
  const [hovered, setHovered] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });
  const letsSpansRef = useRef<(HTMLSpanElement | null)[]>([]);
  const rockSpansRef = useRef<(HTMLSpanElement | null)[]>([]);

  const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (!hovered) return;

    let rafId: number;
    const animate = () => {
      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 15;
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 15;

      const maxDist = 240; // Half of circle width

      const animateSpans = (spans: (HTMLSpanElement | null)[]) => {
        spans.forEach(span => {
          if (!span) return;

          const rect = span.getBoundingClientRect();
          const charCenter = {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2
          };

          const d = dist(mouseRef.current, charCenter);

          const getAttr = (distance: number, minVal: number, maxVal: number) => {
            const val = maxVal - Math.abs((maxVal * distance) / maxDist);
            return Math.max(minVal, val + minVal);
          };

          const wdth = Math.floor(getAttr(d, 50, 300));
          const wght = Math.floor(getAttr(d, 400, 900));

          span.style.fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}`;
        });
      };

      animateSpans(letsSpansRef.current);
      animateSpans(rockSpansRef.current);

      rafId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(rafId);
  }, [hovered]);

  return (
    <div className="relative flex items-center justify-center h-full px-4">
      <div
        className="relative cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* GO Button */}
        <div className={`relative z-10 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-orizon-secondary rounded-full flex items-center justify-center transition-all duration-700 ease-out ${hovered ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}`}>
          <div className="text-orizon-primary font-black text-5xl sm:text-6xl md:text-7xl tracking-wider uppercase">
            GO
          </div>
        </div>

        {/* Expanding Circle Background with Border and Glow Effect */}
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-700 ease-out ${hovered ? 'pulse-glow' : ''}`}
          style={{
            width: hovered ? 'min(480px, 90vw)' : 'clamp(96px, 25vw, 128px)',
            height: hovered ? 'min(480px, 90vw)' : 'clamp(96px, 25vw, 128px)',
            border: hovered ? '4px solid #272860' : '4px solid #f8e800',
            boxShadow: hovered ? '0 0 32px #272860' : undefined,
            background: hovered ? '#f8e800' : 'transparent',
            overflow: 'hidden',
          }}
        >
          {/* Dot Grid Background - Behind text */}
          {hovered && (
            <div
              className="absolute inset-[12px] rounded-full"
              style={{
                backgroundImage: 'radial-gradient(circle, #272860 1.5px, transparent 1.5px)',
                backgroundSize: '20px 20px',
                backgroundPosition: 'center center',
                zIndex: 1,
              }}
            />
          )}


          {/* Circular Text Layout - LET'S on top arc, ROCK on bottom arc */}
          {hovered && (
            <>
              <style>{`
                @font-face {
                  font-family: 'Compressa VF';
                  src: url('https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2');
                  font-style: normal;
                }
              `}</style>
              <div
                className="absolute inset-0 uppercase float-slow"
                style={{
                  zIndex: 10,
                  pointerEvents: 'none',
                  color: '#272860',
                  fontFamily: 'Compressa VF, sans-serif',
                }}
              >
                {/* LET'S on top arc */}
                <div style={{ position: 'absolute', width: '100%', height: '100%', left: 0, top: 0 }}>
                  {lets.split('').map((char, index) => {
                    const totalChars = lets.length;
                    const radius = 185; // Distance from center (reduced for padding)
                    const angleSpread = 60; // Total degrees
                    const angleStep = angleSpread / (totalChars - 1);
                    const startAngle = -90 - (angleSpread / 2); // Start angle
                    const angle = startAngle + (index * angleStep);
                    const radian = (angle * Math.PI) / 180;
                    const x = 240 + Math.cos(radian) * radius; // 240 is center of 480px
                    const y = 240 + Math.sin(radian) * radius;

                    return (
                      <span
                        key={`lets-${index}`}
                        ref={el => {
                          letsSpansRef.current[index] = el;
                        }}
                        style={{
                          position: 'absolute',
                          left: `${x}px`,
                          top: `${y}px`,
                          transform: `translate(-50%, -50%) rotate(${angle + 90}deg)`,
                          fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                          fontWeight: 400,
                          display: 'inline-block',
                          fontVariationSettings: "'wght' 400, 'wdth' 100",
                        }}
                      >
                        {char}
                      </span>
                    );
                  })}
                </div>

                {/* ROCK on bottom arc */}
                <div style={{ position: 'absolute', width: '100%', height: '100%', left: 0, top: 0 }}>
                  {rock.split('').reverse().map((char, index) => {
                    const totalChars = rock.length;
                    const radius = 185; // Distance from center (same as LET'S for equal spacing)
                    const angleSpread = 50; // Total degrees
                    const angleStep = angleSpread / (totalChars - 1);
                    const startAngle = 90 - (angleSpread / 2); // Start from left side
                    const angle = startAngle + (index * angleStep); // Add to go right
                    const radian = (angle * Math.PI) / 180;
                    const x = 240 + Math.cos(radian) * radius; // 240 is center of 480px
                    const y = 240 + Math.sin(radian) * radius;

                    return (
                      <span
                        key={`rock-${index}`}
                        ref={el => {
                          rockSpansRef.current[index] = el;
                        }}
                        style={{
                          position: 'absolute',
                          left: `${x}px`,
                          top: `${y}px`,
                          transform: `translate(-50%, -50%) rotate(${angle - 90}deg)`,
                          fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                          fontWeight: 400,
                          display: 'inline-block',
                          fontVariationSettings: "'wght' 400, 'wdth' 100",
                        }}
                      >
                        {char}
                      </span>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

