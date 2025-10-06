'use client';

const CtaSection = () => {
  return (
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
  );
};

export default CtaSection;
