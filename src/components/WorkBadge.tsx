import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function WorkBadge() {
  const badgeRef = useRef(null);
  const ovalRef = useRef(null);
  const workTextRef = useRef(null);
  const portalRef = useRef(null);

  useEffect(() => {
    const badge = badgeRef.current;
    const oval = ovalRef.current;
    const workText = workTextRef.current;
    const portal = portalRef.current;

    // Create portal expansion animation
    const portalAnimation = ScrollTrigger.create({
      trigger: badge,
      start: 'top top',
      end: '+=300%',
      pin: true,
      pinSpacing: false,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        
        // Zoom in the entire badge
        gsap.set(badge, {
          scale: 1 + (progress * 2), // Scale from 1 to 3
          transformOrigin: 'center center'
        });

        // Expand the oval horizontally to reveal WorkSection
        const horizontalScale = 1 + (progress * 25); // Scale horizontally more dramatically
        const verticalScale = 1 + (progress * 5); // Scale vertically less
        gsap.set(oval, {
          scaleX: horizontalScale,
          scaleY: verticalScale,
          transformOrigin: 'center center',
          borderRadius: progress > 0.2 ? '0%' : '50%', // Make it rectangular when expanded
          backgroundColor: progress > 0.3 ? 'transparent' : '#000' // Make oval transparent as it expands
        });

        // Fade out WORK text as portal opens
        gsap.set(workText, {
          opacity: 1 - (progress * 2), // Fade out quickly
          scale: 1 - (progress * 0.5)
        });

        // Create portal effect with expanding background
        if (progress > 0.1) {
          gsap.set(portal, {
            opacity: (progress - 0.1) * 1.1, // Start showing at 10% progress
            scale: (progress - 0.1) * 25 // Scale dramatically
          });
        } else {
          gsap.set(portal, {
            opacity: 0,
            scale: 0
          });
        }

        // Create a mask effect - show WorkSection through the portal
        if (progress < 0.3) {
          // Show dark blue background with oval in center
          gsap.set(badge, {
            backgroundColor: '#272860'
          });
          gsap.set(portal, {
            opacity: 1
          });
        } else {
          // Make background transparent to reveal WorkSection
          gsap.set(badge, {
            backgroundColor: 'transparent'
          });
          gsap.set(portal, {
            opacity: 0
          });
        }

        // Control WorkSection animation
        if ((window as any).workSectionUpdate) {
          (window as any).workSectionUpdate(progress);
        }
        
        // Start revealing WorkSection earlier
        if (progress >= 0.4) {
          const fadeProgress = (progress - 0.4) / 0.6; // 0 to 1 in last 60%
          gsap.set(badge, {
            opacity: 1 - fadeProgress
          });
        }
      }
    });

    return () => {
      portalAnimation.kill();
    };
  }, []);

  return (
    <div ref={badgeRef} className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center" style={{ 
      opacity: 1, 
      backgroundColor: 'transparent',
      zIndex: 9999,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }}>
      {/* Square Grid Pattern */}
      <div 
        ref={portalRef}
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(248, 232, 0, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(248, 232, 0, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
      
      
      {/* Black Oval with WORK text */}
      <div style={{ position: 'relative', zIndex: 10000 }}>
        <div 
          ref={ovalRef}
          className="bg-black rounded-full flex items-center justify-center"
          style={{
            width: '300px',
            height: '500px',
            boxShadow: '0 0 0 3px rgba(248, 232, 0, 0.6)',
            transform: 'scale(1)',
            opacity: 1,
            position: 'relative',
            zIndex: 10000,
            border: '2px solid rgba(248, 232, 0, 0.3)',
            backgroundColor: '#000'
          }}
        >
          {/* WORK text vertically */}
          <div ref={workTextRef} className="flex flex-col items-center justify-center" style={{ position: 'relative', zIndex: 10001, gap: '8px' }}>
            <span className="font-black tracking-tighter" style={{ fontSize: '100px', lineHeight: '0.9', color: '#f8e800', fontWeight: '900' }}>W</span>
            <span className="font-black tracking-tighter" style={{ fontSize: '100px', lineHeight: '0.9', color: '#f8e800', fontWeight: '900' }}>O</span>
            <span className="font-black tracking-tighter" style={{ fontSize: '100px', lineHeight: '0.9', color: '#f8e800', fontWeight: '900' }}>R</span>
            <span className="font-black tracking-tighter" style={{ fontSize: '100px', lineHeight: '0.9', color: '#f8e800', fontWeight: '900' }}>K</span>
          </div>
        </div>
      </div>
    </div>
  );
}
