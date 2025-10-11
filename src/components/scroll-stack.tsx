import React, { useEffect, useRef, useState } from 'react';
import { Code, Palette, Rocket, Zap, Globe, Sparkles, ArrowRight, Play, TrendingUp, Users, Award, Target } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Service {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  stats: { label: string; value: string }[];
  icon: React.ComponentType<any>;
  accentIcon: React.ComponentType<any>;
  mediaType: 'image' | 'video';
  mediaPlaceholder: string;
  gradient: string;
  layout: 'left' | 'right' | 'center';
}

const services: Service[] = [
  {
    id: 1,
    title: "WEB DEVELOPMENT",
    subtitle: "Building Digital Experiences That Convert",
    description: "Transform your vision into powerful, scalable web solutions that drive business growth and engage users.",
    features: [
      "Custom Web Applications",
      "E-Commerce Solutions",
      "Progressive Web Apps (PWA)",
      "API Integration & Development"
    ],
    stats: [
      { label: "Page Load Time", value: "<2s" },
      { label: "Mobile Optimized", value: "100%" },
      { label: "Client Satisfaction", value: "98%" }
    ],
    icon: Code,
    accentIcon: TrendingUp,
    mediaType: 'video',
    mediaPlaceholder: '/1.mp4',
    gradient: 'from-purple-600 via-blue-600 to-cyan-600',
    layout: 'right'
  },
  {
    id: 2,
    title: "UI/UX DESIGN",
    subtitle: "Crafting Intuitive User Experiences",
    description: "Design that speaks to your audience. We create interfaces that users love and remember.",
    features: [
      "User Research & Personas",
      "Wireframing & Prototyping",
      "Design Systems & Style Guides",
      "Usability Testing & Iteration"
    ],
    stats: [
      { label: "User Engagement", value: "+67%" },
      { label: "Conversion Rate", value: "+45%" },
      { label: "Design Projects", value: "200+" }
    ],
    icon: Palette,
    accentIcon: Users,
    mediaType: 'video',
    mediaPlaceholder: '/2.mp4',
    gradient: 'from-pink-600 via-rose-600 to-orange-600',
    layout: 'left'
  },
  {
    id: 3,
    title: "BRAND STRATEGY",
    subtitle: "Positioning Your Brand For Success",
    description: "Build a brand that resonates. Strategic positioning that makes your business unforgettable.",
    features: [
      "Brand Identity Development",
      "Market Positioning & Analysis",
      "Brand Voice & Messaging",
      "Competitive Differentiation"
    ],
    stats: [
      { label: "Brand Awareness", value: "+85%" },
      { label: "Market Recognition", value: "Top 10%" },
      { label: "Brands Launched", value: "150+" }
    ],
    icon: Sparkles,
    accentIcon: Award,
    mediaType: 'video',
    mediaPlaceholder: '/3.mp4',
    gradient: 'from-yellow-500 via-amber-600 to-orange-700',
    layout: 'right'
  },
  {
    id: 4,
    title: "PERFORMANCE MARKETING",
    subtitle: "Data-Driven Growth Strategies",
    description: "Maximize ROI with performance marketing that delivers measurable results and sustainable growth.",
    features: [
      "PPC & Paid Social Campaigns",
      "Conversion Rate Optimization",
      "Marketing Automation",
      "Analytics & Attribution"
    ],
    stats: [
      { label: "Average ROAS", value: "4.8x" },
      { label: "Cost Per Lead", value: "-62%" },
      { label: "Active Campaigns", value: "500+" }
    ],
    icon: Zap,
    accentIcon: Target,
    mediaType: 'video',
    mediaPlaceholder: '/4.mp4',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    layout: 'left'
  },
  {
    id: 5,
    title: "DIGITAL MARKETING",
    subtitle: "Amplify Your Online Presence",
    description: "Comprehensive digital strategies that connect your brand with the right audience at the right time.",
    features: [
      "SEO & Content Marketing",
      "Social Media Management",
      "Email Marketing Campaigns",
      "Influencer Partnerships"
    ],
    stats: [
      { label: "Organic Traffic", value: "+120%" },
      { label: "Social Engagement", value: "+95%" },
      { label: "Email Open Rate", value: "38%" }
    ],
    icon: Globe,
    accentIcon: TrendingUp,
    mediaType: 'video',
    mediaPlaceholder: '/5.mp4',
    gradient: 'from-blue-600 via-indigo-600 to-purple-700',
    layout: 'center'
  },
  {
    id: 6,
    title: "PRODUCT LAUNCH",
    subtitle: "From Concept To Market Leader",
    description: "End-to-end launch strategies that ensure your product makes a powerful market entrance.",
    features: [
      "Go-To-Market Strategy",
      "Launch Campaign Planning",
      "PR & Media Outreach",
      "Post-Launch Optimization"
    ],
    stats: [
      { label: "Successful Launches", value: "180+" },
      { label: "Market Penetration", value: "Top 5%" },
      { label: "First-Month Sales", value: "+250%" }
    ],
    icon: Rocket,
    accentIcon: Award,
    mediaType: 'video',
    mediaPlaceholder: '/6.mp4',
    gradient: 'from-red-600 via-pink-600 to-purple-600',
    layout: 'right'
  }
];

const ScrollStackServices = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const servicesContainerRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const servicesContainer = servicesContainerRef.current;

    if (!section || !servicesContainer) return;

    // Set initial state - make first service visible
    const servicePanels = servicesContainer.querySelectorAll('.service-panel');
    servicePanels.forEach((panel, idx) => {
      if (idx === 0) {
        gsap.set(panel, { opacity: 1, scale: 1, y: 0, zIndex: 10 });
      } else {
        gsap.set(panel, { opacity: 0, scale: 0.94, y: 50, zIndex: 0 });
      }
    });

    const scrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: `+=${services.length * 100}%`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const totalServices = services.length;
        const rawIndex = progress * totalServices;
        const serviceIndex = Math.min(Math.floor(rawIndex), totalServices - 1);
        const serviceProgress = rawIndex - serviceIndex;

        setCurrentIndex(serviceIndex);

        // Animate service panels with push/slide effect
        const servicePanels = servicesContainer.querySelectorAll('.service-panel');
        servicePanels.forEach((panel, idx) => {
          const relativeIndex = idx - serviceIndex;

          if (relativeIndex < 0) {
            // Past services - slide out upward (pushed out)
            gsap.set(panel, {
              opacity: 0,
              x: '-100%',
              y: 0,
              scale: 0.95,
              zIndex: 0,
              pointerEvents: 'none',
              visibility: 'hidden'
            });
          } else if (relativeIndex === 0) {
            // Active service - push/slide effect
            // Early stage: slides in from right
            // Late stage: pushed out to left
            let xPosition, opacity;

            if (serviceProgress < 0.15) {
              // Slide in from right (0-15%)
              xPosition = (1 - serviceProgress / 0.15) * 100;
              opacity = serviceProgress / 0.15;
            } else if (serviceProgress > 0.85) {
              // Being pushed out to left (85-100%)
              const exitProgress = (serviceProgress - 0.85) / 0.15;
              xPosition = -exitProgress * 100;
              opacity = 1 - exitProgress;
            } else {
              // Stable in center (15-85%)
              xPosition = 0;
              opacity = 1;
            }

            gsap.set(panel, {
              opacity: opacity,
              x: `${xPosition}%`,
              y: 0,
              scale: 1,
              zIndex: 20,
              pointerEvents: serviceProgress > 0.15 && serviceProgress < 0.85 ? 'auto' : 'none',
              visibility: 'visible'
            });
          } else if (relativeIndex === 1) {
            // Next service - waiting off-screen to the right
            gsap.set(panel, {
              opacity: 0,
              x: '100%',
              y: 0,
              scale: 0.95,
              zIndex: 10,
              pointerEvents: 'none',
              visibility: 'visible'
            });
          } else {
            // Future services - far off-screen
            gsap.set(panel, {
              opacity: 0,
              x: '100%',
              y: 0,
              scale: 0.95,
              zIndex: 0,
              pointerEvents: 'none',
              visibility: 'hidden'
            });
          }
        });
      },
    });

    return () => {
      scrollTrigger.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="services-scroll-section relative w-screen h-screen bg-orizon-primary overflow-hidden"
      style={{
        borderTop: '2px solid #f8e800',
        borderBottom: '2px solid #f8e800',
      }}
    >
      <style>{`
        .service-panel {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          will-change: transform, opacity;
          background-color: #272860;
          isolation: isolate;
        }

        .media-placeholder {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, rgba(248,232,0,0.08) 0%, rgba(248,232,0,0.03) 100%);
          border: 3px solid rgba(248,232,0,0.25);
          transition: all 0.4s ease;
        }

        .media-placeholder:hover {
          border-color: rgba(248,232,0,0.4);
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }

        .media-placeholder::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100px;
          height: 100px;
          border: 4px solid rgba(248,232,0,0.3);
          border-radius: 50%;
        }

        .media-placeholder::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 18px 0 18px 28px;
          border-color: transparent transparent transparent rgba(248,232,0,0.6);
          margin-left: 6px;
        }

        .stat-card {
          backdrop-filter: blur(12px);
          background: rgba(248,232,0,0.06);
          border: 2px solid rgba(248,232,0,0.25);
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .stat-card:hover {
          background: rgba(248,232,0,0.12);
          border-color: rgba(248,232,0,0.5);
          transform: translateY(-6px);
          box-shadow: 0 12px 24px rgba(248,232,0,0.15);
        }

        .feature-item {
          position: relative;
          padding-left: 28px;
          transition: all 0.2s ease;
        }

        .feature-item:hover {
          transform: translateX(4px);
        }

        .feature-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 10px;
          height: 10px;
          background: #f8e800;
          clip-path: polygon(0 0, 100% 50%, 0 100%);
          transition: all 0.2s ease;
        }

        .feature-item:hover::before {
          left: 2px;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .floating-icon {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      {/* Services Container */}
      <div ref={servicesContainerRef} className="absolute inset-0">
        {services.map((service) => {
          const Icon = service.icon;
          const AccentIcon = service.accentIcon;

          return (
            <div
              key={service.id}
              className="service-panel"
              data-index={service.id - 1}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-[0.03]">
                <div
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(248,232,0,0.15) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(248,232,0,0.15) 1px, transparent 1px)
                    `,
                    backgroundSize: '120px 120px',
                    width: '100%',
                    height: '100%'
                  }}
                />
              </div>

              {/* Subtle Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 pointer-events-none" />

              {/* Layout: Right Media */}
              {service.layout === 'right' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                  {/* Left Content */}
                  <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-20 py-12 lg:py-20">
                    {/* Service Number */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-orizon-primary rounded-2xl flex items-center justify-center shadow-lg floating-icon">
                        <Icon className="w-8 h-8 text-orizon-secondary" strokeWidth={2.5} />
                      </div>
                      <div className="text-6xl sm:text-7xl font-black text-orizon-primary/20 italic">
                        {String(service.id).padStart(2, '0')}
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-4 tracking-tighter leading-none uppercase italic drop-shadow-lg">
                      {service.title}
                    </h2>

                    {/* Subtitle */}
                    <p className="text-xl sm:text-2xl font-bold text-orizon-primary mb-6">
                      {service.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-base sm:text-lg text-white/80 mb-8 leading-relaxed max-w-xl">
                      {service.description}
                    </p>

                    {/* Features */}
                    <div className="mb-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="feature-item text-sm sm:text-base font-semibold text-white/90">
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button className="group w-fit px-8 py-4 bg-orizon-primary text-orizon-secondary font-bold text-lg rounded-full flex items-center gap-3 hover:bg-orizon-primary/90 transition-all shadow-lg hover:shadow-xl hover:scale-105">
                      Explore Service
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Right Media */}
                  <div className="hidden lg:flex items-center justify-center p-12">
                    <div className="relative w-full h-full max-h-[600px]">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-orizon-primary/20 rounded-full blur-3xl" />
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-orizon-primary/20 rounded-full blur-3xl" />

                      <div className="relative rounded-3xl w-full h-full shadow-2xl overflow-hidden bg-black/20">
                        {service.mediaType === 'video' ? (
                          <video
                            src={service.mediaPlaceholder}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orizon-primary/10 to-orizon-primary/5 flex items-center justify-center">
                            <Play className="w-20 h-20 text-orizon-primary/30" strokeWidth={1.5} />
                          </div>
                        )}
                      </div>

                      {/* Floating Stats */}
                      <div className="absolute -bottom-6 -left-6 bg-orizon-primary backdrop-blur-md rounded-2xl p-4 shadow-xl border-2 border-orizon-primary">
                        <div className="flex items-center gap-3">
                          <AccentIcon className="w-8 h-8 text-orizon-secondary" />
                          <div>
                            <div className="text-2xl font-black text-orizon-secondary">{service.stats[0].value}</div>
                            <div className="text-xs font-bold text-orizon-secondary/80">{service.stats[0].label}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Layout: Left Media */}
              {service.layout === 'left' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                  {/* Left Media */}
                  <div className="hidden lg:flex items-center justify-center p-12">
                    <div className="relative w-full h-full max-h-[600px]">
                      <div className="absolute top-0 left-0 w-24 h-24 bg-orizon-primary/20 rounded-full blur-3xl" />
                      <div className="absolute bottom-0 right-0 w-32 h-32 bg-orizon-primary/20 rounded-full blur-3xl" />

                      <div className="relative rounded-3xl w-full h-full shadow-2xl overflow-hidden bg-black/20">
                        {service.mediaType === 'video' ? (
                          <video
                            src={service.mediaPlaceholder}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orizon-primary/10 to-orizon-primary/5 flex items-center justify-center">
                            <Play className="w-20 h-20 text-orizon-primary/30" strokeWidth={1.5} />
                          </div>
                        )}
                      </div>

                      {/* Floating Stats */}
                      <div className="absolute -bottom-6 -right-6 bg-orizon-primary backdrop-blur-md rounded-2xl p-4 shadow-xl border-2 border-orizon-primary">
                        <div className="flex items-center gap-3">
                          <AccentIcon className="w-8 h-8 text-orizon-secondary" />
                          <div>
                            <div className="text-2xl font-black text-orizon-secondary">{service.stats[0].value}</div>
                            <div className="text-xs font-bold text-orizon-secondary/80">{service.stats[0].label}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Content */}
                  <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-20 py-12 lg:py-20">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-orizon-primary rounded-2xl flex items-center justify-center shadow-lg floating-icon">
                        <Icon className="w-8 h-8 text-orizon-secondary" strokeWidth={2.5} />
                      </div>
                      <div className="text-6xl sm:text-7xl font-black text-orizon-primary/20 italic">
                        {String(service.id).padStart(2, '0')}
                      </div>
                    </div>

                    <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-4 tracking-tighter leading-none uppercase italic drop-shadow-lg">
                      {service.title}
                    </h2>

                    <p className="text-xl sm:text-2xl font-bold text-orizon-primary mb-6">
                      {service.subtitle}
                    </p>

                    <p className="text-base sm:text-lg text-white/80 mb-8 leading-relaxed max-w-xl">
                      {service.description}
                    </p>

                    <div className="mb-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="feature-item text-sm sm:text-base font-semibold text-white/90">
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    <button className="group w-fit px-8 py-4 bg-orizon-primary text-orizon-secondary font-bold text-lg rounded-full flex items-center gap-3 hover:bg-orizon-primary/90 transition-all shadow-lg hover:shadow-xl hover:scale-105">
                      Explore Service
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              )}

              {/* Layout: Center (Same as Right but centered content) */}
              {service.layout === 'center' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                  {/* Left Content */}
                  <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-20 py-12 lg:py-20">
                    {/* Service Number */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-orizon-primary rounded-2xl flex items-center justify-center shadow-lg floating-icon">
                        <Icon className="w-8 h-8 text-orizon-secondary" strokeWidth={2.5} />
                      </div>
                      <div className="text-6xl sm:text-7xl font-black text-orizon-primary/20 italic">
                        {String(service.id).padStart(2, '0')}
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-4 tracking-tighter leading-none uppercase italic drop-shadow-lg">
                      {service.title}
                    </h2>

                    {/* Subtitle */}
                    <p className="text-xl sm:text-2xl font-bold text-orizon-primary mb-6">
                      {service.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-base sm:text-lg text-white/80 mb-8 leading-relaxed max-w-xl">
                      {service.description}
                    </p>

                    {/* Features */}
                    <div className="mb-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="feature-item text-sm sm:text-base font-semibold text-white/90">
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button className="group w-fit px-8 py-4 bg-orizon-primary text-orizon-secondary font-bold text-lg rounded-full flex items-center gap-3 hover:bg-orizon-primary/90 transition-all shadow-lg hover:shadow-xl hover:scale-105">
                      Explore Service
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Right Media */}
                  <div className="hidden lg:flex items-center justify-center p-12">
                    <div className="relative w-full h-full max-h-[600px]">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-orizon-primary/20 rounded-full blur-3xl" />
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-orizon-primary/20 rounded-full blur-3xl" />

                      <div className="relative rounded-3xl w-full h-full shadow-2xl overflow-hidden bg-black/20">
                        {service.mediaType === 'video' ? (
                          <video
                            src={service.mediaPlaceholder}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orizon-primary/10 to-orizon-primary/5 flex items-center justify-center">
                            <Play className="w-20 h-20 text-orizon-primary/30" strokeWidth={1.5} />
                          </div>
                        )}
                      </div>

                      {/* Floating Stats */}
                      <div className="absolute -bottom-6 -left-6 bg-orizon-primary backdrop-blur-md rounded-2xl p-4 shadow-xl border-2 border-orizon-primary">
                        <div className="flex items-center gap-3">
                          <AccentIcon className="w-8 h-8 text-orizon-secondary" />
                          <div>
                            <div className="text-2xl font-black text-orizon-secondary">{service.stats[0].value}</div>
                            <div className="text-xs font-bold text-orizon-secondary/80">{service.stats[0].label}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Stats Bar (for all layouts on mobile) */}
              <div className="lg:hidden absolute bottom-0 left-0 right-0 p-6 bg-orizon-primary/95 backdrop-blur-lg border-t-4 border-orizon-primary">
                <div className="grid grid-cols-3 gap-4">
                  {service.stats.map((stat, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-2xl font-black text-orizon-secondary">{stat.value}</div>
                      <div className="text-xs font-semibold text-orizon-secondary/80">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scroll Hint - Only show on first service */}
      {currentIndex === 0 && (
        <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce z-30">
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-10 border-2 border-orizon-primary/60 rounded-full flex items-start justify-center p-2 bg-orizon-secondary/10 backdrop-blur-sm">
              <div className="w-1.5 h-3 bg-orizon-primary rounded-full animate-pulse" />
            </div>
            <span className="text-xs font-bold text-orizon-primary/80 tracking-wider">SCROLL</span>
          </div>
        </div>
      )}
    </section>
  );
};

export default ScrollStackServices;
