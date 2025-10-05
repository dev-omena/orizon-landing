'use client';

import ScrollStack, { ScrollStackItem } from './ScrollStack';

const LockedScrollServices = () => {
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

  return (
    <div className="min-h-screen bg-orizon-primary">
       <div className="h-screen flex items-center justify-center bg-orizon-primary relative overflow-hidden">
         {/* Grid squares background */}
         <div className="absolute inset-0" style={{
           backgroundImage: `
             linear-gradient(rgba(248,232,0,0.1) 1px, transparent 1px),
             linear-gradient(90deg, rgba(248,232,0,0.1) 1px, transparent 1px)
           `,
           backgroundSize: '120px 120px',
           backgroundPosition: '0 0, 0 0'
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
          className="relative min-h-screen bg-orizon-primary border-t border-orizon-secondary"
          style={{ perspective: '1000px', perspectiveOrigin: '50% 50%' }}
        >
          {/* Radiating Lines Background - Connected to square grids */}
          <div className="absolute inset-0" style={{
            background: `
              repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 8deg, rgba(248,232,0,0.2) 8deg, rgba(248,232,0,0.2) 8.1deg)
            `,
            opacity: 0.8
          }} />
          
          <ScrollStack
            className="h-screen"
            itemDistance={100}
            itemScale={0.03}
            itemStackDistance={30}
            stackPosition="20%"
            scaleEndPosition="10%"
            baseScale={0.85}
            scaleDuration={0.5}
            rotationAmount={0}
            blurAmount={0}
            useWindowScroll={false}
            onStackComplete={() => console.log('Stack completed!')}
          >
            {services.map((service, index) => (
              <ScrollStackItem key={service.id}>
                <div className="bg-orizon-secondary rounded-2xl p-4 shadow-[0_10px_30px_-10px_rgba(248,232,0,0.3)]" style={{
                  transform: 'perspective(1000px) rotateX(5deg)',
                  transformOrigin: 'center center',
                  boxShadow: '0 0 20px rgba(248,232,0,0.2), inset 0 0 10px rgba(248,232,0,0.05)',
                }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">{service.icon}</div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                    </div>
                  </div>

                  <h2 className="text-2xl font-black text-orizon-primary mb-2 tracking-tighter leading-none" style={{ fontStyle: 'italic' }}>
                    {service.title}
                  </h2>
                  <p className="text-lg font-black text-orizon-primary/70 mb-3 tracking-tighter" style={{ fontStyle: 'italic' }}>
                    {service.subtitle}
                  </p>

                  <p className="text-sm text-orizon-primary/90 mb-4 leading-relaxed font-medium">
                    {service.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {service.stats.map((stat, i) => (
                      <div 
                        key={i}
                        className="bg-orizon-primary rounded-xl p-3 text-center hover:scale-105 transition-transform duration-300"
                      >
                        <div className="text-lg font-black text-orizon-secondary mb-1" style={{ fontStyle: 'italic' }}>
                          {stat.value}
                        </div>
                        <div className="text-xs font-black text-orizon-secondary tracking-widest">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-2">
                    <button className="bg-orizon-primary text-orizon-secondary px-4 py-2 rounded-xl font-black text-sm hover:bg-orizon-primary/90 transition-all duration-300 hover:scale-105 tracking-tight" style={{ fontStyle: 'italic' }}>
                      GET STARTED →
                    </button>
                    <button className="bg-orizon-secondary text-orizon-primary px-4 py-2 rounded-xl font-black text-sm border-2 border-orizon-primary hover:bg-orizon-secondary/90 transition-all duration-300 hover:scale-105 tracking-tight" style={{ fontStyle: 'italic' }}>
                      LEARN MORE
                    </button>
                  </div>
                </div>
              </ScrollStackItem>
            ))}
          </ScrollStack>
        </div>

      <div className="h-screen flex items-center justify-center bg-orizon-primary relative overflow-hidden">
        {/* Grid squares background */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(248,232,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(248,232,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '120px 120px',
          backgroundPosition: '0 0, 0 0'
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