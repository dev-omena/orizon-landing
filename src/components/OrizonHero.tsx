'use client';

import { useState, useEffect, useRef } from 'react';

const OrizonHero = () => {
  const [counts, setCounts] = useState({ countries: 0, clients: 0, projects: 0 });
  const [hasAnimated, setHasAnimated] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const statsElement = statsRef.current;
    if (!statsElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            
            // Start counter animation
            const targets = { countries: 7, clients: 189, projects: 1000 };
            const duration = 2000; // 2 seconds
            const steps = 60;
            const interval = duration / steps;

            let step = 0;
            const timer = setInterval(() => {
              step++;
              const progress = step / steps;
              
              setCounts({
                countries: Math.min(Math.floor(targets.countries * progress), targets.countries),
                clients: Math.min(Math.floor(targets.clients * progress), targets.clients),
                projects: Math.min(Math.floor(targets.projects * progress), targets.projects),
              });

              if (step >= steps) {
                clearInterval(timer);
                setCounts(targets); // Ensure final values
              }
            }, interval);
          }
        });
      },
      { threshold: 0.3 } // Trigger when 30% of the element is visible
    );

    observer.observe(statsElement);

    return () => {
      observer.disconnect();
    };
  }, [hasAnimated]);

  return (
    <div className="bg-orizon-primary" style={{ margin: 0, padding: 0 }}>
       <div className="min-h-screen flex items-center justify-center bg-orizon-primary relative overflow-hidden" style={{ borderBottom: '1px solid #f8e800', margin: 0, padding: 0 }}>
         {/* Grid squares background */}
         <div className="absolute inset-0" style={{
           backgroundImage: `
             linear-gradient(rgba(248,232,0,0.1) 1px, transparent 1px),
             linear-gradient(90deg, rgba(248,232,0,0.1) 1px, transparent 1px)
           `,
           backgroundSize: '120px 120px',
           backgroundPosition: '0 0, 0 0'
         }} />
        
        <div className="text-center px-4 relative z-10 flex flex-col items-center justify-center">
          <p className="text-2xl md:text-3xl text-orizon-secondary/80 max-w-4xl mx-auto mb-16 leading-relaxed font-bold">
            We are always striving for methods to generate phenomenal results.
            <br />
            We have our interest at the heart of everything we do, so we naturally become an extended arm of their business.
          </p>
          
          {/* Statistics Section */}
          <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 max-w-6xl mx-auto mb-16">
            <div className="text-center">
              <div className="text-6xl md:text-7xl font-black text-orizon-secondary mb-3">
                {counts.countries}
              </div>
              <div className="text-xl md:text-2xl text-orizon-secondary/70 font-bold uppercase tracking-wider">
                Countries Served
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-6xl md:text-7xl font-black text-orizon-secondary mb-3">
                {counts.clients}+
              </div>
              <div className="text-xl md:text-2xl text-orizon-secondary/70 font-bold uppercase tracking-wider">
                Happy Clients
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-6xl md:text-7xl font-black text-orizon-secondary mb-3">
                {counts.projects}+
              </div>
              <div className="text-xl md:text-2xl text-orizon-secondary/70 font-bold uppercase tracking-wider">
                Projects Completed
              </div>
            </div>
          </div>
          
          <div className="mt-8 animate-bounce">
            <div className="text-5xl text-orizon-secondary">↓</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrizonHero;
