import React, { useState } from 'react';
import TextPressure from './TextPressure';
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


          {/* Two-Line Layout: LET'S and ROCK visible on hover, bobbing together */}
          {hovered && (
            <div
              className="absolute top-1/2 left-1/2 font-black text-center uppercase flex flex-col items-center justify-center"
              style={{
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
                pointerEvents: 'none',
                color: '#272860',
                width: '88%',
                maxWidth: '380px',
                height: '96%',
                maxHeight: '440px',
                overflow: 'hidden',
              }}
            >
              {/* Top Line - LET'S */}
              <div className="float-slow flex justify-center items-center w-full" style={{gap: '0.001em', minHeight: '2.4rem', paddingTop: '2px', paddingBottom: '2px', overflow: 'hidden'}}>
                <TextPressure text={lets} textColor="#272860" flex={true} minFontSize={7} />
              </div>
              {/* Bottom Line - ROCK */}
              <div className="float-slow flex justify-center items-center w-full" style={{gap: '0.001em', minHeight: '2.4rem', paddingTop: '2px', paddingBottom: '2px', overflow: 'hidden'}}>
                <TextPressure text={rock} textColor="#272860" flex={true} minFontSize={7} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

