import React, { useEffect, useRef, useState } from 'react';
import { Code, Palette, Rocket, Zap, Globe, Sparkles } from 'lucide-react';

interface Service {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  bgColor: string;
  accentColor: string;
}

interface GeometricPatternProps {
  color: string;
}

interface ServiceCardProps {
  service: Service;
  index: number;
  isActive: boolean;
  isPast: boolean;
}

const services = [
  {
    id: 1,
    title: "WEB DEVELOPMENT",
    description: "Crafting pixel-perfect, responsive websites with cutting-edge technologies and seamless user experiences.",
    icon: Code,
    bgColor: "bg-orizon-secondary",
    accentColor: "bg-orizon-primary"
  },
  {
    id: 2,
    title: "UI/UX DESIGN",
    description: "Creating intuitive and visually stunning interfaces that users love to interact with every single day.",
    icon: Palette,
    bgColor: "bg-orizon-secondary",
    accentColor: "bg-orizon-primary"
  },
  {
    id: 3,
    title: "BRAND STRATEGY",
    description: "Building powerful brand identities that resonate with your audience and stand out in the market.",
    icon: Sparkles,
    bgColor: "bg-orizon-secondary",
    accentColor: "bg-orizon-primary"
  },
  {
    id: 4,
    title: "PERFORMANCE OPTIMIZATION",
    description: "Supercharging your digital presence with lightning-fast load times and smooth animations.",
    icon: Zap,
    bgColor: "bg-orizon-secondary",
    accentColor: "bg-orizon-secondary"
  },
  {
    id: 5,
    title: "DIGITAL MARKETING",
    description: "Amplifying your reach with data-driven strategies that convert visitors into loyal customers.",
    icon: Globe,
    bgColor: "bg-orizon-secondary",
    accentColor: "bg-orizon-primary"
  },
  {
    id: 6,
    title: "PRODUCT LAUNCH",
    description: "Taking your product from concept to market with strategic planning and flawless execution.",
    icon: Rocket,
    bgColor: "bg-orizon-secondary",
    accentColor: "bg-orizon-primary"
  }
];

const GeometricPattern = ({ color }: GeometricPatternProps) => {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-10">
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(248,232,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(248,232,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          backgroundPosition: '0 0, 0 0'
        }}
      />
      {/* Floating Geometric Shapes */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute border border-orizon-secondary/20 rounded-full animate-pulse"
          style={{
            width: `${80 + i * 30}px`,
            height: `${80 + i * 30}px`,
            top: `${20 + i * 10}%`,
            left: `${10 + i * 12}%`,
            animationDelay: `${i * 0.5}s`
          }}
        />
      ))}
    </div>
  );
};

const ServiceCard = ({ service, index, isActive, isPast }: ServiceCardProps) => {
  const Icon = service.icon;
  
  const getTransform = () => {
    if (isPast) {
      return 'translateY(-100vh) scale(0.8)';
    }
    if (isActive) {
      return 'translateY(0) scale(1)';
    }
    return `translateY(${(index + 1) * 60}px) scale(${1 - (index + 1) * 0.05})`;
  };

  const getOpacity = () => {
    if (isPast) return 0;
    if (isActive) return 1;
    return 0.5;
  };

  return (
    <div
      className="absolute inset-0 flex items-center justify-center px-6 transition-all duration-500 ease-out"
      style={{ 
        transform: getTransform(),
        opacity: getOpacity(),
        zIndex: isPast ? 0 : (isActive ? 10 : 5 - index),
        pointerEvents: isActive ? 'auto' : 'none'
      }}
    >
      <div className={`relative w-full max-w-4xl overflow-hidden rounded-[30px] ${service.bgColor} shadow-2xl border-2 border-orizon-secondary/40`}>
        <GeometricPattern color="orizon" />
        
        <div className="relative p-4">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-4 ${service.accentColor} rounded-xl shadow-lg`}>
              <Icon className="w-8 h-8 text-orizon-secondary" strokeWidth={2.5} />
            </div>
            <div className="text-right">
              <div className="text-6xl font-black text-orizon-primary/20" style={{ fontStyle: 'italic' }}>
                {String(index + 1).padStart(2, '0')}
              </div>
            </div>
          </div>
          
          <h3 className="text-4xl font-black text-orizon-primary  mb-3 tracking-tighter leading-none uppercase" style={{ fontStyle: 'italic' }}>
            {service.title}
          </h3>
          
          <div className="h-1 w-24 bg-orizon-primary mb-4" />
          
          <p className="text-base font-bold text-orizon-primary/90 leading-relaxed max-w-2xl tracking-tight">
            {service.description}
          </p>
          
          <div className="mt-6 flex items-center gap-4">
            <div className="h-3 w-3 bg-orizon-primary rotate-45" />
            <div className="h-3 w-3 bg-orizon-primary rotate-45" />
          </div>
        </div>

        {/* Corner accent */}
        <div className="absolute top-6 left-6 w-8 h-8 border-l-2 border-t-2 border-orizon-primary/60 rounded-tl-lg"></div>
        <div className="absolute top-6 right-6 w-8 h-8 border-r-2 border-t-2 border-orizon-primary/60 rounded-tr-lg"></div>
        <div className="absolute bottom-6 left-6 w-8 h-8 border-l-2 border-b-2 border-orizon-primary/60 rounded-bl-lg"></div>
        <div className="absolute bottom-6 right-6 w-8 h-8 border-r-2 border-b-2 border-orizon-primary/60 rounded-br-lg"></div>
      </div>
    </div>
  );
};

const ScrollStackServices = () => {
  const containerRef = useRef<HTMLElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      
      // Get the scroll position relative to the section
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const viewportHeight = window.innerHeight;
      
      // Calculate how much of the section has been scrolled through
      const scrollThroughSection = Math.max(0, Math.min(1, -sectionTop / sectionHeight));
      
      // Map scroll progress to card index
      const newIndex = Math.min(
        Math.floor(scrollThroughSection * services.length),
        services.length - 1
      );
      
      setCurrentIndex(Math.max(0, newIndex));
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (


      <section 
        ref={containerRef}
        className="relative bg-orizon-primary"
        style={{ 
          height: `${services.length * 20}vh`,
          borderBottom: '1px solid #f8e800'
        }}
      >
        <div className="sticky top-0 h-screen overflow-hidden bg-orizon-primary flex items-center justify-center">
          {services.map((service, idx) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={idx}
              isActive={idx === currentIndex}
              isPast={idx < currentIndex}
            />
          ))}
          
          {/* Progress Indicator */}
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-50">
            {services.map((_, index) => (
              <div
                key={index}
                className={`h-3 border-2 border-orizon-primary transition-all duration-300 ${
                  index === currentIndex 
                    ? 'w-16 bg-orizon-primary' 
                    : index < currentIndex
                    ? 'w-3 bg-orizon-primary'
                    : 'w-3 bg-transparent'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

  );
};

export default ScrollStackServices;
