'use client';

import React, { useRef, useEffect, useState } from 'react';

interface AnimatedGridProps {
  className?: string;
  lineColor?: string;
  gridSize?: number;
  animationDuration?: number;
  isHovered?: boolean;
}

const AnimatedGrid: React.FC<AnimatedGridProps> = ({
  className = '',
  lineColor = 'rgba(248, 232, 0, 0.3)',
  gridSize = 120, // Match WorkSection grid spacing
  animationDuration = 8000,
  isHovered = false,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 1220 });
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const parent = svgRef.current.parentElement;
        if (parent) {
          setDimensions({
            width: parent.clientWidth || 1200,
            height: parent.clientHeight || 1220
          });
        }
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Generate grid path with expanding ripple wave effect
  const generateGridPath = (time: number = 0) => {
    const { width, height } = dimensions;

    // Calculate number of lines based on gridSize (120px spacing)
    const numVerticalLines = Math.ceil(width / gridSize) + 1;
    const numHorizontalLines = Math.ceil(height / gridSize) + 1;

    const centerX = width / 2;
    const centerY = height / 2;
    const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

    // Wave that travels from center (0) to edges (1) and repeats
    const waveProgress = (time * 0.0003) % 1; // 0 to 1 continuously
    const wavePosition = waveProgress * maxDist; // Current distance from center where wave is
    const waveWidth = maxDist * 0.3; // Width of the wave bulge

    // Add static hover push effect from center
    const hoverPushRadius = 300; // Radius of hover effect
    const hoverPushStrength = isHovered ? 150 : 0; // Push strength when hovered

    let path = '';

    // Generate vertical lines with traveling wave effect
    for (let i = 0; i < numVerticalLines; i++) {
      const x = i * gridSize;
      path += `M ${x} 0`;

      const segments = Math.ceil(height / (gridSize / 2)); // More segments for smoother curves
      for (let j = 0; j <= segments; j++) {
        const y = (j / segments) * height;

        // Calculate distance from center point
        const dx = x - centerX;
        const dy = y - centerY;
        const distFromCenter = Math.sqrt(dx * dx + dy * dy);

        // Calculate how close this point is to the wave front
        const distanceToWave = Math.abs(distFromCenter - wavePosition);

        // Create wave intensity based on distance to wave front
        // Using gaussian-like curve for smooth wave
        const waveIntensity = Math.exp(-Math.pow(distanceToWave / waveWidth, 2)) *
                             Math.sin(waveProgress * Math.PI); // Fade in/out at start/end

        // Push strength from traveling wave
        const wavePush = waveIntensity * 80;

        // Calculate hover push effect (separate from traveling wave)
        const hoverInfluence = distFromCenter < hoverPushRadius
          ? Math.pow(1 - distFromCenter / hoverPushRadius, 2)
          : 0;
        const hoverPush = hoverInfluence * hoverPushStrength;

        // Combine both push effects
        const totalPushStrength = wavePush + hoverPush;

        // Calculate push direction (away from center)
        const angle = Math.atan2(dy, dx);

        // Apply push force in the direction away from center
        const pushX = Math.cos(angle) * totalPushStrength;
        const pushY = Math.sin(angle) * totalPushStrength;

        const finalX = x + pushX;
        const finalY = y + pushY;

        path += ` L ${finalX} ${finalY}`;
      }
    }

    // Generate horizontal lines with traveling wave effect
    for (let j = 0; j < numHorizontalLines; j++) {
      const y = j * gridSize;
      path += ` M 0 ${y}`;

      const segments = Math.ceil(width / (gridSize / 2)); // More segments for smoother curves
      for (let i = 0; i <= segments; i++) {
        const x = (i / segments) * width;

        // Calculate distance from center point
        const dx = x - centerX;
        const dy = y - centerY;
        const distFromCenter = Math.sqrt(dx * dx + dy * dy);

        // Calculate wave intensity at this point
        const distanceToWave = Math.abs(distFromCenter - wavePosition);
        const waveIntensity = Math.exp(-Math.pow(distanceToWave / waveWidth, 2)) *
                             Math.sin(waveProgress * Math.PI);

        const wavePush = waveIntensity * 80;

        // Calculate hover push effect
        const hoverInfluence = distFromCenter < hoverPushRadius
          ? Math.pow(1 - distFromCenter / hoverPushRadius, 2)
          : 0;
        const hoverPush = hoverInfluence * hoverPushStrength;

        const totalPushStrength = wavePush + hoverPush;

        // Calculate push direction (away from center)
        const angle = Math.atan2(dy, dx);

        // Apply push force
        const pushX = Math.cos(angle) * totalPushStrength;
        const pushY = Math.sin(angle) * totalPushStrength;

        const finalX = x + pushX;
        const finalY = y + pushY;

        path += ` L ${finalX} ${finalY}`;
      }
    }

    return path;
  };

  // Continuous animation loop
  useEffect(() => {
    let startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now() - startTime;

      if (pathRef.current && svgRef.current) {
        const newPath = generateGridPath(currentTime);
        pathRef.current.setAttribute('d', newPath);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [dimensions, animationDuration, isHovered]);

  return (
    <div className={`absolute inset-0 ${className}`}>
      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          ref={pathRef}
          d={generateGridPath()}
          fill="none"
          stroke={lineColor}
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          style={{
            transition: 'd 0.1s ease-out'
          }}
        />
      </svg>
    </div>
  );
};

export default AnimatedGrid;
