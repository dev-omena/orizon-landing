'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Waves from '@/components/Waves';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  useEffect(() => {
    // Smooth scrolling setup
    gsap.registerPlugin(ScrollTrigger);
    
    // Initialize smooth scroll behavior
    gsap.config({
      force3D: true,
      nullTargetWarn: false
    });

    // Cleanup on unmount
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-primary p-4">
      {/* Website Container with Primary Color Border Frame */}
      <div className="relative min-h-screen bg-secondary border-4 border-primary rounded-lg overflow-hidden">
        {/* Animated Header */}
        <Header />

        {/* Hero Section with Waves */}
        <section className="relative min-h-screen overflow-hidden">
          <Hero />
          <Waves />
        </section>

      {/* Features Section */}
      <section className="relative py-32 px-6 bg-gradient-to-b from-background to-muted">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-halyard text-4xl md:text-6xl font-bold text-foreground mb-6">
              Why Choose{' '}
              <span className="text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">
                Orizon
              </span>
            </h2>
            <p className="font-montserrat text-xl text-muted-foreground max-w-3xl mx-auto">
              We combine cutting-edge technology with creative excellence to deliver 
              digital experiences that captivate and convert.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Innovation First",
                description: "Cutting-edge solutions designed to push the boundaries of what's possible in digital experiences.",
                gradient: "from-primary to-primary/80"
              },
              {
                title: "User Centric",
                description: "Every feature crafted with your needs in mind, ensuring intuitive and delightful interactions.",
                gradient: "from-secondary to-yellow-400"
              },
              {
                title: "Future Ready",
                description: "Built for tomorrow's challenges with scalable architecture and forward-thinking design.",
                gradient: "from-primary to-secondary"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-card/80 backdrop-blur-sm p-8 rounded-3xl border border-border/50 hover:border-primary/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/10"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="w-8 h-8 bg-white rounded-lg opacity-90"></div>
                </div>
                <h3 className="font-halyard text-2xl font-semibold mb-4 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="font-montserrat text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Showcase Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-halyard text-4xl md:text-6xl font-bold text-foreground mb-12">
            <span className="text-transparent bg-gradient-to-r from-secondary to-primary bg-clip-text">
              ORIZON
            </span>
          </h2>
          <div className="text-8xl md:text-9xl font-bold text-primary/10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            O
          </div>
          <p className="font-montserrat text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Where digital horizons meet infinite possibilities. We don&apos;t just build websites, 
            we craft digital experiences that redefine what&apos;s possible in the modern web.
          </p>
        </div>
      </section>


      </div>
    </div>
  );
}
