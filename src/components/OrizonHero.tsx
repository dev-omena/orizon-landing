'use client';

const OrizonHero = () => {
  return (
    <div className="bg-orizon-primary">
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
    </div>
  );
};

export default OrizonHero;
