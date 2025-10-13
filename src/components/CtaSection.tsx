'use client';

import React, { useState } from 'react';
import AnimatedGrid from './lib/AnimatedGrid';
import InteractiveCTA from './InteractiveCTA';

const CtaSection = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div id="cta-section" className="h-screen flex items-center justify-center bg-orizon-primary relative overflow-hidden" style={{ borderBottom: '1px solid #f8e800' }}>
      {/* Animated grid effect with hover push */}
      <AnimatedGrid
        lineColor="rgba(248, 232, 0, 0.3)"
        animationDuration={10000}
        isHovered={false}
      />

      {/* Interactive CTA */}
       <InteractiveCTA />
    </div>
  );
};

export default CtaSection;
