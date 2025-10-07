'use client';

import React, { useRef, useEffect, useState } from 'react';

interface WaterDropGridProps {
  className?: string;
  lineColor?: string;
  gridSize?: number;
  dropRadius?: number;
  animationDuration?: number;
  isHovered?: boolean;
}

const WaterDropGrid: React.FC<WaterDropGridProps> = ({
  className = '',
  lineColor = 'rgba(248, 232, 0, 0.1)',
  gridSize = 60,
  dropRadius = 200,
  animationDuration = 3000,
  isHovered = false
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [pathData, setPathData] = useState<string>('');
  const [animationTime, setAnimationTime] = useState(0);

  // Generate water drop distortion effect for full grid
  const generateWaterDropPath = (time: number) => {
    const width = 1200;
    const height = 800;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Animation progress (0 to 1)
    const progress = (time % animationDuration) / animationDuration;
    
    // Create wave effect that starts from center and radiates outward
    const waveIntensity = Math.sin(progress * Math.PI * 2) * 0.5 + 0.5;
    const dropStrength = Math.sin(progress * Math.PI) * waveIntensity;
    
    // Add extra push effect when CTA is hovered
    const hoverPushStrength = isHovered ? 1.5 : 1;
    
    // Calculate maximum possible distance from center to corner
    const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
    
    let path = '';
    
    // Generate horizontal grid lines
    for (let y = 0; y <= height; y += gridSize) {
      path += `M 0 ${y}`;
      
      for (let x = 0; x <= width; x += 5) {
        const distanceFromCenter = Math.sqrt(
          Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
        );
        
        // Calculate distortion for ALL points in the grid
        const normalizedDistance = distanceFromCenter / maxDistance;
        const distortionStrength = (1 - normalizedDistance) * dropStrength;
        
        // Create water drop effect - stronger distortion at center, but affects all points
        const angle = Math.atan2(y - centerY, x - centerX);
        const pushForce = Math.pow(1 - normalizedDistance, 1.5) * distortionStrength * 80 * hoverPushStrength;
        
        const distortionX = Math.cos(angle) * pushForce;
        const distortionY = Math.sin(angle) * pushForce * 0.4;
        
        const finalX = x + distortionX;
        const finalY = y + distortionY;
        
        path += ` L ${finalX} ${finalY}`;
      }
    }
    
    // Generate vertical grid lines
    for (let x = 0; x <= width; x += gridSize) {
      path += ` M ${x} 0`;
      
      for (let y = 0; y <= height; y += 5) {
        const distanceFromCenter = Math.sqrt(
          Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
        );
        
        // Calculate distortion for ALL points in the grid
        const normalizedDistance = distanceFromCenter / maxDistance;
        const distortionStrength = (1 - normalizedDistance) * dropStrength;
        
        // Create water drop effect - stronger distortion at center, but affects all points
        const angle = Math.atan2(y - centerY, x - centerX);
        const pushForce = Math.pow(1 - normalizedDistance, 1.5) * distortionStrength * 80 * hoverPushStrength;
        
        const distortionX = Math.cos(angle) * pushForce;
        const distortionY = Math.sin(angle) * pushForce * 0.4;
        
        const finalX = x + distortionX;
        const finalY = y + distortionY;
        
        path += ` L ${finalX} ${finalY}`;
      }
    }
    
    return path;
  };

  useEffect(() => {
    let animationId: number;
    
    const animate = (time: number) => {
      setAnimationTime(time);
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  useEffect(() => {
    const newPathData = generateWaterDropPath(animationTime);
    setPathData(newPathData);
  }, [animationTime, gridSize, dropRadius, animationDuration]);

  return (
    <div className={`absolute inset-0 ${className}`}>
      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d={pathData}
          fill="none"
          stroke={lineColor}
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
};

export default WaterDropGrid;
