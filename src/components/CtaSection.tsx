'use client';

import React, { useState } from 'react';
import WaterDropGrid from './WaterDropGrid';
import InteractiveCTA from './InteractiveCTA';

const CtaSection = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="h-screen flex items-center justify-center bg-orizon-primary relative overflow-hidden" style={{ borderBottom: '1px solid #f8e800' }}>
      {/* Single water drop grid effect */}
      <WaterDropGrid 
        lineColor="rgba(248, 232, 0, 0.3)"
        gridSize={80}
        dropRadius={400}
        animationDuration={4000}
        isHovered={isHovered}
      />
      
      {/* Interactive CTA */}
      <InteractiveCTA onHoverChange={setIsHovered} />
    </div>
  );
};

export default CtaSection;
