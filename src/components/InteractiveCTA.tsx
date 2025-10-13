import React, { useState } from 'react';
import './InteractiveCTA.css';

const lets = "LET'S";
const rock = "ROCK";

export default function InteractiveCTA() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative flex items-center justify-center h-full">
      <div
        className="relative cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* GO Button */}
        <div className={`relative z-10 w-32 h-32 bg-orizon-secondary rounded-full flex items-center justify-center transition-all duration-700 ease-out ${hovered ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}`}>
          <div className="text-orizon-primary font-black text-7xl tracking-wider uppercase">
            GO
          </div>
        </div>

        {/* Expanding Circle Background with Border and Glow Effect */}
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-700 ease-out ${hovered ? 'pulse-glow' : ''}`}
          style={{
            width: hovered ? '480px' : '128px',
            height: hovered ? '480px' : '128px',
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


          {/* Two-Line Layout: LET'S and WORK visible on hover, bobbing together */}
          {hovered && (
          <div
             className="absolute top-1/2 left-1/2 font-black text-center uppercase"
             style={{
               transform: 'translate(-50%, -50%)',
               zIndex: 10,
               pointerEvents: 'none',
               color: '#272860',
               fontSize: '6rem',
               lineHeight: '1',
               width: '100%',
               height: '12rem',
             }}
           >
            {/* Top Line - LET'S */}
            <div className={'float-slow'}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '6rem',
                marginBottom: '0.5rem',
                gap: '0.2rem',
              }}
            >
              {lets.split('').map((letter, i) => (
                <span
                  key={`lets-${i}`}
                  className={hovered ? '' : ''}
                  style={{
                    display: 'inline-block',
                    width: letter === "'" ? '2rem' : '4rem',
                    height: '6rem',
                    transitionDelay: `${i * 0.08}s`,
                    position: 'relative',
                    textAlign: 'center',
                  }}
                >
                  {letter === "'" ? <sup style={{ fontSize: '3rem' }}>'</sup> : letter}
                </span>
              ))}
            </div>
            {/* Bottom Line - ROCK */}
            <div className={'float-slow'}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '6rem',
                gap: '0.4rem',
              }}
            >
              {rock.split('').map((letter, i) => (
                <span
                  key={`rock-${i}`}
                  className={hovered ? '' : ''}
                  style={{
                    display: 'inline-block',
                    width: '4rem',
                    height: '6rem',
                    transitionDelay: `${i * 0.08}s`,
                    position: 'relative',
                    textAlign: 'center',
                  }}
                >
                  {letter}
                </span>
              ))}
            </div>
          </div>
          )}

          {/* Email at bottom */}
          {hovered && (
            <div
              className="absolute bottom-8 inset-x-0 text-center font-bold text-xs tracking-widest uppercase email-appear"
              style={{
                zIndex: 10,
                pointerEvents: 'none',
                animationDelay: '200ms',
                color: '#272860',
              }}
            >
              <span style={{ display: 'inline-block' }}>HI@OMENA.CO</span>
            </div>
          )}

          {/* Inner dark circle */}
          <div
            className={`absolute inset-[4px] rounded-full transition-all duration-700 ease-out${hovered ? '' : ' bg-orizon-primary'}`}
            style={hovered ? { background: '#f8e800' } : {}}
          >
            {/* Content circle */}
            <div className="absolute inset-[8px] rounded-full overflow-hidden" style={hovered ? { background: '#f8e800' } : { background: '#272860' }}>
              {/* Floating Stars */}
              {hovered && (
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  <svg
                    className="absolute w-4 h-4 text-orizon-secondary animate-float-star"
                    style={{ top: '80px', left: '120px', animationDuration: '8s' }}
                    viewBox="0 0 49 49"
                    fill="currentColor"
                  >
                    <path d="m24.5 0 3.3 21.2L49 24.5l-21.2 3.3L24.5 49l-3.3-21.2L0 24.5l21.2-3.3L24.5 0z" />
                  </svg>

                  <svg
                    className="absolute w-3 h-3 text-orizon-secondary animate-float-star"
                    style={{ top: '180px', left: '420px', animationDuration: '9s' }}
                    viewBox="0 0 49 49"
                    fill="currentColor"
                  >
                    <path d="m24.5 0 3.3 21.2L49 24.5l-21.2 3.3L24.5 49l-3.3-21.2L0 24.5l21.2-3.3L24.5 0z" />
                  </svg>

                  <svg
                    className="absolute w-3 h-3 text-orizon-secondary animate-float-star"
                    style={{ top: '320px', left: '60px', animationDuration: '7s' }}
                    viewBox="0 0 49 49"
                    fill="currentColor"
                  >
                    <path d="m24.5 0 3.3 21.2L49 24.5l-21.2 3.3L24.5 49l-3.3-21.2L0 24.5l21.2-3.3L24.5 0z" />
                  </svg>

                  <svg
                    className="absolute w-4 h-4 text-orizon-secondary animate-float-star"
                    style={{ top: '420px', left: '380px', animationDuration: '10s' }}
                    viewBox="0 0 49 49"
                    fill="currentColor"
                  >
                    <path d="m24.5 0 3.3 21.2L49 24.5l-21.2 3.3L24.5 49l-3.3-21.2L0 24.5l21.2-3.3L24.5 0z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

