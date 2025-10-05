'use client';

import { useState, useEffect, useRef } from 'react';

const LockedScrollServices = () => {
  const [currentService, setCurrentService] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [hasEnteredSection, setHasEnteredSection] = useState(false);
  const [hasExitedSection, setHasExitedSection] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [transitionKey, setTransitionKey] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollAccumulator = useRef(0);
  const isScrolling = useRef(false);

  const services = [
    {
      id: 1,
      title: "DESIGNING VISIONS",
      subtitle: "SINCE 2020",
      description: "Transforming ideas into stunning visual experiences that captivate audiences and bring brands to life with creativity and innovation.",
      icon: "🎨",
      stats: [
        { label: "PROJECTS", value: "140+" },
        { label: "TEAM", value: "10+" },
        { label: "AWARDS", value: "15+" }
      ]
    },
    {
      id: 2,
      title: "CODING SOLUTIONS",
      subtitle: "SINCE 2020",
      description: "Building powerful digital solutions with cutting-edge technology and innovative approaches that push boundaries and exceed expectations.",
      icon: "💻",
      stats: [
        { label: "APPS", value: "200+" },
        { label: "CLIENTS", value: "85+" },
        { label: "COUNTRIES", value: "25+" }
      ]
    },
    {
      id: 3,
      title: "LAUNCHING DREAMS",
      subtitle: "SINCE 2020",
      description: "Crafting memorable brand identities and launching digital experiences that stand out in crowded markets and resonate with audiences.",
      icon: "🚀",
      stats: [
        { label: "LAUNCHES", value: "95+" },
        { label: "CAMPAIGNS", value: "120+" },
        { label: "SUCCESS", value: "98%" }
      ]
    },
    {
      id: 4,
      title: "SUPPORTING GROWTH",
      subtitle: "SINCE 2020",
      description: "Providing continuous support and optimization to keep your digital presence running smoothly and performing at peak efficiency.",
      icon: "🔧",
      stats: [
        { label: "USERS", value: "1M+" },
        { label: "SYSTEMS", value: "150+" },
        { label: "UPTIME", value: "99.9%" }
      ]
    }
  ];

  useEffect(() => {
    let isProcessing = false;

    const handleWheel = (e: WheelEvent) => {
      if (!sectionRef.current || isProcessing) {
        console.log('🚫 Wheel blocked:', { 
          hasSectionRef: !!sectionRef.current, 
          isProcessing 
        });
        return;
      }

      const rect = sectionRef.current.getBoundingClientRect();
      // Check if section is in view for proper locking
      const isInView = rect.bottom > 0 && rect.top < window.innerHeight;
      const isApproachingFromTop = rect.top > 0 && rect.top < 200 && e.deltaY > 0;
      // Check if approaching from bottom (scrolling up into section)
      const isApproachingFromBottom = rect.bottom > window.innerHeight - 200 && rect.bottom < window.innerHeight + 200 && e.deltaY < 0;

      console.log('🖱️ Wheel event:', {
        deltaY: e.deltaY,
        isInView,
        isApproachingFromTop,
        isApproachingFromBottom,
        rect: { top: rect.top, bottom: rect.bottom },
        isLocked,
        hasEnteredSection,
        hasExitedSection,
        currentService,
        scrollAmount: Math.abs(scrollAccumulator.current),
        isScrolling: isScrolling.current
      });

      // Lock section when approaching from top and scroll into view
      if (isApproachingFromTop && !isLocked && !hasEnteredSection) {
        console.log('🔒 LOCKING SECTION - Approaching from top');
        e.preventDefault();
        setIsLocked(true);
        setHasEnteredSection(true);
        setHasExitedSection(false); // Reset exit flag when re-entering
        // Scroll section into full view
        sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      // Lock section when approaching from bottom (scrolling up) and scroll into view
      if (isApproachingFromBottom && !isLocked && !hasEnteredSection) {
        console.log('🔒 LOCKING SECTION - Approaching from bottom');
        e.preventDefault();
        setIsLocked(true);
        setHasEnteredSection(true);
        setHasExitedSection(false); // Reset exit flag when re-entering
        // Scroll section into full view
        sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      // Handle scrolling when section is locked and in view
      if (isInView && isLocked && hasEnteredSection) {
        e.preventDefault();
        e.stopPropagation();
        
        if (!isScrolling.current) {
          scrollAccumulator.current += e.deltaY;
          const scrollAmount = Math.abs(scrollAccumulator.current);
          
          // Always update scroll progress for real-time zoom
          const newProgress = Math.min(scrollAmount / 200, 1);
          setScrollProgress(newProgress);
          
          console.log('📊 Scroll progress:', {
            scrollAmount,
            newProgress,
            threshold: scrollAmount > 200,
            progressComplete: newProgress >= 1
          });
          
          // Only swap when zoom is complete AND scroll threshold is reached
          if (scrollAmount > 200 && newProgress >= 1) {
            console.log('✅ Triggering service change:', {
              currentService,
              servicesLength: services.length,
              scrollDirection: scrollAccumulator.current > 0 ? 'down' : 'up'
            });

            isProcessing = true;
            isScrolling.current = true;
            
            if (scrollAccumulator.current > 0 && currentService < services.length - 1) {
              // Scroll down - go to next service
              console.log('⬇️ Going to next service:', currentService + 1);
              setCurrentService(prev => prev + 1);
              setTransitionKey(prev => prev + 1);
              scrollAccumulator.current = 0;
              setScrollProgress(0);
            } else if (scrollAccumulator.current < 0 && currentService > 0) {
              // Scroll up - go to previous service
              console.log('⬆️ Going to previous service:', currentService - 1);
              setCurrentService(prev => prev - 1);
              setTransitionKey(prev => prev + 1);
              scrollAccumulator.current = 0;
              setScrollProgress(0);
             } else if (scrollAccumulator.current > 0 && currentService === services.length - 1) {
               // Reached last service and scrolling down, allow exit
               console.log('🚪 EXITING SECTION - Reached last service and scrolling down');
               setIsLocked(false);
               setHasEnteredSection(false);
               setHasExitedSection(false); // Reset exit flag to allow re-entry
               // Scroll the page to exit the section
               setTimeout(() => {
                 console.log('📜 Scrolling page to exit');
                 // Use smooth scrolling to next section
                 const nextSection = sectionRef.current?.nextElementSibling;
                 if (nextSection) {
                   nextSection.scrollIntoView({ behavior: 'smooth' });
                 } else {
                   window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
                 }
               }, 100);
             } else if (scrollAccumulator.current < 0 && currentService === 0) {
               // At first service and scrolling up, allow exit
               console.log('🚪 EXITING SECTION - At first service and scrolling up');
               setIsLocked(false);
               setHasEnteredSection(false);
               setHasExitedSection(false); // Reset exit flag to allow re-entry
               // Scroll the page to exit the section
               setTimeout(() => {
                 console.log('📜 Scrolling page to exit');
                 // Use smooth scrolling to previous section
                 const prevSection = sectionRef.current?.previousElementSibling;
                 if (prevSection) {
                   prevSection.scrollIntoView({ behavior: 'smooth' });
                 } else {
                   window.scrollBy({ top: -window.innerHeight, behavior: 'smooth' });
                 }
               }, 100);
             } else {
              console.log('❌ No action taken:', {
                scrollDirection: scrollAccumulator.current > 0 ? 'down' : 'up',
                currentService,
                servicesLength: services.length
              });
            }
            
            setTimeout(() => {
              console.log('⏰ Resetting scroll flags');
              isScrolling.current = false;
              isProcessing = false;
            }, 200);
          }
        }
      } else {
        // Section is not in view or not locked
        if (hasEnteredSection && rect.top > window.innerHeight + 100) {
          // User has scrolled well past the section, reset
          console.log('🔄 Resetting section - user scrolled past');
          setIsLocked(false);
          setHasEnteredSection(false);
          setHasExitedSection(false); // Reset exit flag to allow re-entry
          setCurrentService(0);
          setScrollProgress(0);
          scrollAccumulator.current = 0;
          isScrolling.current = false;
          isProcessing = false;
        } else {
          console.log('🌍 Section not locked - allowing normal scroll');
        }
      }
    };

    // Prevent all scrolling when section is active
    const handleScroll = (e: Event) => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const isInView = rect.bottom > 0 && rect.top < window.innerHeight;
      
      if (isInView && isLocked && hasEnteredSection) {
        e.preventDefault();
        e.stopPropagation();
      }
      // Allow normal scrolling when section is out of view or unlocked
    };

    // Prevent keyboard scrolling
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const isInView = rect.bottom > 0 && rect.top < window.innerHeight;
      
      if (isInView && isLocked && hasEnteredSection) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'PageUp' || e.key === 'PageDown' || e.key === 'Home' || e.key === 'End' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
        }
      }
      // Allow normal keyboard scrolling when section is out of view or unlocked
    };

    // Prevent touch scrolling on mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const isInView = rect.bottom > 0 && rect.top < window.innerHeight;
      
      if (isInView && isLocked && hasEnteredSection) {
        e.preventDefault();
        e.stopPropagation();
      }
      // Allow normal touch scrolling when section is out of view or unlocked
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll, { passive: false });
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [currentService, isLocked, hasEnteredSection, hasExitedSection, services.length]);

  useEffect(() => {
    setProgress((currentService / (services.length - 1)) * 100);
    console.log('📈 Progress updated:', {
      currentService,
      servicesLength: services.length,
      progress: (currentService / (services.length - 1)) * 100
    });
  }, [currentService, services.length]);

  // Debug state changes
  useEffect(() => {
    console.log('🔒 Lock state changed:', { isLocked });
  }, [isLocked]);

  useEffect(() => {
    console.log('📋 Current service changed:', { 
      currentService, 
      totalServices: services.length,
      isLastService: currentService === services.length - 1
    });
  }, [currentService, services.length]);

  const getCardStyle = (index: number) => {
    const diff = index - currentService;
    const isActive = index === currentService;
    const isPrev = diff < 0;
    const isNext = diff > 0;

    if (isActive) {
      // Smooth continuous growing from 10% to 100%
      const scale = 0.1 + (0.9 * scrollProgress); // From 0.1x to 1x scale - smooth growth
      // Moves from far back (-1500px) to front (0px)
      const translateZ = -1500 + (1500 * scrollProgress);
      
      // Subtle rotation effect
      const rotation = scrollProgress * 2; // Very subtle rotation
      
      return {
        transform: `translateZ(${translateZ}px) scale(${scale}) rotateY(${rotation}deg)`,
        opacity: 1,
        filter: 'none',
        zIndex: 50,
        transition: 'none',
        // Fixed card rotation
        cardTransform: 'perspective(1000px) rotateX(8deg)'
      };
    } else if (isPrev) {
      return {
        transform: `translateZ(800px) scale(1.2) translateY(-200%)`,
        opacity: 0.3,
        filter: 'blur(10px)',
        zIndex: 10 - Math.abs(diff),
        pointerEvents: 'none',
        cardTransform: 'perspective(1000px) rotateX(8deg)'
      };
    } else if (isNext) {
      const nextDiff = diff - 1;
      const scale = 0.1 - (nextDiff * 0.02);
      const translateZ = -1500 - (nextDiff * 300);
      return {
        transform: `translateZ(${translateZ}px) scale(${Math.max(scale, 0.05)})`,
        opacity: 0.8,
        filter: 'none',
        zIndex: 40 - diff,
        cardTransform: 'perspective(1000px) rotateX(8deg)'
      };
    }
    
    // Default fallback style
    return {
      transform: 'translateZ(0px) scale(1)',
      opacity: 1,
      filter: 'none',
      zIndex: 0,
      transition: 'none',
      cardTransform: 'perspective(1000px) rotateX(8deg)'
    };
  };

  return (
    <div className="min-h-screen bg-orizon-primary">
       <div className="h-screen flex items-center justify-center bg-orizon-primary relative overflow-hidden">
         <div className="absolute inset-0" style={{
           background: 'repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 8deg, rgba(248,232,0,0.2) 8deg, rgba(248,232,0,0.2) 8.5deg)'
         }} />
        
        <div className="text-center px-4 relative z-10">
          <div className="mb-8 flex justify-center items-center gap-4">
            <div className="w-16 h-16 bg-orizon-secondary rounded-full flex items-center justify-center animate-pulse">
              <span className="text-3xl">✨</span>
            </div>
            <div className="w-24 h-16 bg-orizon-secondary rounded-2xl rotate-12 flex items-center justify-center shadow-2xl">
              <div className="w-20 h-12 bg-orizon-primary rounded-lg" />
            </div>
            <div className="w-24 h-16 bg-orizon-secondary rounded-2xl -rotate-6 flex items-center justify-center shadow-2xl">
              <div className="w-20 h-12 bg-orizon-primary rounded-lg" />
            </div>
            <div className="w-12 h-20 bg-orizon-secondary rounded-2xl rotate-45" />
          </div>
          <h1 className="text-7xl md:text-9xl font-black text-orizon-secondary mb-2 tracking-tighter" style={{ fontStyle: 'italic' }}>
            ORIZON
          </h1>
          <h2 className="text-6xl md:text-8xl font-black text-orizon-secondary mb-2 tracking-tighter" style={{ fontStyle: 'italic' }}>
            STUDIOS
          </h2>
          <h3 className="text-7xl md:text-9xl font-black text-orizon-secondary tracking-tighter" style={{ fontStyle: 'italic' }}>
            SINCE 2020
          </h3>
          <div className="mt-8 animate-bounce">
            <div className="text-5xl text-orizon-secondary">↓</div>
          </div>
        </div>
      </div>

       <div 
         ref={sectionRef}
         className="relative h-screen overflow-hidden bg-orizon-primary"
         style={{ perspective: '1000px', perspectiveOrigin: '50% 50%' }}
       >
         <div className="absolute inset-0" style={{
           background: 'repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 8deg, rgba(248,232,0,0.2) 8deg, rgba(248,232,0,0.2) 8.5deg)'
         }} />

        <div className="absolute top-8 right-8 z-[100]">
          <div className="bg-orizon-secondary rounded-2xl px-6 py-3 shadow-2xl">
            <div className="flex items-center gap-3">
              <span className="text-orizon-primary text-sm font-black tracking-wider">PROGRESS</span>
              <div className="w-32 h-2 bg-orizon-primary/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orizon-primary transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-orizon-primary font-black text-sm">{currentService + 1}/{services.length}</span>
            </div>
          </div>
        </div>

         <div className="absolute inset-0 flex items-center justify-center overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
           {services.map((service, index) => {
             const cardStyle = getCardStyle(index);
             return (
             <div
               key={`${service.id}-${transitionKey}`}
               className="absolute w-full max-w-4xl px-4"
               style={{
                 transformStyle: 'preserve-3d',
                 transform: cardStyle.transform,
                 opacity: cardStyle.opacity,
                 filter: cardStyle.filter,
                 zIndex: cardStyle.zIndex,
                 transition: cardStyle.transition
               }}
             >
               <div className="bg-orizon-secondary rounded-[2.5rem] p-8 md:p-12 shadow-[0_50px_100px_-20px_rgba(248,232,0,0.3)]" style={{
                 transform: cardStyle.cardTransform || 'perspective(1000px) rotateX(10deg)',
                 transformOrigin: 'center center',
                 boxShadow: '0 0 50px rgba(248,232,0,0.4), inset 0 0 20px rgba(248,232,0,0.1)',
                 // Remove any scaling from the card itself
                 scale: '1'
               }}>
                <div className="flex items-center justify-between mb-8">
                  <div className="text-7xl">{service.icon}</div>
                  <div className="flex gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full" />
                    <div className="w-4 h-4 bg-yellow-500 rounded-full" />
                    <div className="w-4 h-4 bg-green-500 rounded-full" />
                  </div>
                </div>

                <h2 className="text-5xl md:text-7xl font-black text-orizon-primary mb-3 tracking-tighter leading-none" style={{ fontStyle: 'italic' }}>
                  {service.title}
                </h2>
                <p className="text-3xl md:text-4xl font-black text-orizon-primary/70 mb-6 tracking-tighter" style={{ fontStyle: 'italic' }}>
                  {service.subtitle}
                </p>

                <p className="text-xl md:text-2xl text-orizon-primary/90 mb-8 leading-relaxed font-medium">
                  {service.description}
                </p>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  {service.stats.map((stat, i) => (
                    <div 
                      key={i}
                      className="bg-orizon-primary rounded-3xl p-6 text-center hover:scale-105 transition-transform duration-300"
                    >
                      <div className="text-3xl md:text-4xl font-black text-orizon-secondary mb-2" style={{ fontStyle: 'italic' }}>
                        {stat.value}
                      </div>
                      <div className="text-xs font-black text-orizon-secondary tracking-widest">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="flex-1 bg-orizon-primary text-orizon-secondary px-8 py-5 rounded-3xl font-black text-xl hover:bg-orizon-primary/90 transition-all duration-300 hover:scale-105 tracking-tight" style={{ fontStyle: 'italic' }}>
                    GET STARTED →
                  </button>
                  <button className="flex-1 bg-orizon-secondary text-orizon-primary px-8 py-5 rounded-3xl font-black text-xl border-4 border-orizon-primary hover:bg-orizon-secondary/90 transition-all duration-300 hover:scale-105 tracking-tight" style={{ fontStyle: 'italic' }}>
                    LEARN MORE
                  </button>
                </div>
              </div>
            </div>
            );
          })}
        </div>

         <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center z-[100]">
           <div className="bg-orizon-secondary rounded-2xl px-6 py-3">
             <p className="text-orizon-primary font-black text-sm mb-1 tracking-wider">
               {currentService < services.length - 1 ? `SCROLL TO VIEW SERVICE ${currentService + 2}/${services.length}` : 'SCROLL TO EXIT ↓'}
             </p>
              <p className="text-orizon-primary/60 text-xs mt-1">
                Debug: Service {currentService + 1}/{services.length} | Locked: {isLocked ? 'Yes' : 'No'} | Entered: {hasEnteredSection ? 'Yes' : 'No'} | Exited: {hasExitedSection ? 'Yes' : 'No'}
              </p>
           </div>
         </div>
      </div>

      <div className="h-screen flex items-center justify-center bg-orizon-primary relative overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 8deg, rgba(248,232,0,0.2) 8deg, rgba(248,232,0,0.2) 8.5deg)'
        }} />
        <div className="text-center px-4 relative z-10">
          <h2 className="text-7xl md:text-9xl font-black text-orizon-secondary mb-6 tracking-tighter" style={{ fontStyle: 'italic' }}>
            READY TO
          </h2>
          <h3 className="text-7xl md:text-9xl font-black text-orizon-secondary mb-8 tracking-tighter" style={{ fontStyle: 'italic' }}>
            START?
          </h3>
          <p className="text-2xl text-orizon-secondary font-bold mb-12 tracking-wide">LET'S BUILD SOMETHING AMAZING</p>
          <button className="bg-orizon-secondary text-orizon-primary px-16 py-6 rounded-3xl font-black text-2xl hover:scale-105 transition-transform duration-300 shadow-2xl tracking-tight" style={{ fontStyle: 'italic' }}>
            GET IN TOUCH →
          </button>
        </div>
      </div>
    </div>
  );
};

export default LockedScrollServices;
