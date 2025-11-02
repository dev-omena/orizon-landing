
import React from 'react';
import { Code, Palette, Rocket, Zap, Globe, Sparkles, ArrowRight, Play, TrendingUp, Users, Award, Target } from 'lucide-react';
import ScrollStack, { ScrollStackItem } from './ScrollStack';

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
  return (
    <ScrollStack className="w-full">
      {services.map((service) => {
        const Icon = service.icon;
        const AccentIcon = service.accentIcon;
        return (
          <ScrollStackItem
            key={service.id}
            itemClassName="bg-orizon-secondary border-2 sm:border-4 border-orizon-primary rounded-xl sm:rounded-2xl lg:rounded-[2rem] shadow-xl text-orizon-primary px-0 py-0"
          >
            <div className="content-root flex flex-col gap-3 sm:gap-4 p-3 sm:p-6 md:p-8 lg:p-12">
              <div className="flex items-center gap-3 sm:gap-4 mb-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-orizon-primary rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                  <div className="animate-float">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-orizon-secondary" strokeWidth={2.5} />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-black text-orizon-primary/20 italic">
                  {String(service.id).padStart(2, '0')}
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-orizon-primary mb-1 sm:mb-2 tracking-tight uppercase italic drop-shadow-lg">
                {service.title}
              </h2>
              <p className="text-base sm:text-lg md:text-xl font-bold text-orizon-primary mb-1 sm:mb-2">
                {service.subtitle}
              </p>
              <p className="text-sm sm:text-base md:text-lg text-orizon-primary/80 mb-3 sm:mb-4 leading-relaxed">
                {service.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="feature-item text-xs sm:text-sm font-semibold text-orizon-primary pl-5 sm:pl-7 relative">
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 sm:w-3 sm:h-3 bg-orizon-primary rounded-full" />
                    {feature}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
                {service.stats.map((stat, idx) => (
                  <div key={idx} className="stat-card p-2 sm:p-3 rounded-lg sm:rounded-xl bg-orizon-primary/10 border-2 border-orizon-primary text-orizon-primary">
                    <div className="text-base sm:text-lg font-black text-orizon-primary">{stat.value}</div>
                    <div className="text-[10px] sm:text-xs font-bold text-orizon-primary/80">{stat.label}</div>
                  </div>
                ))}
              </div>
              {/* Removed Explore Service button */}
            </div>
          {/* Ensure content stays inside card */}
          <style>{`
            .scroll-stack-card {
              overflow: hidden;
              padding: 0 !important;
            }
            /* Mobile tweaks: allow inner scroll if content is taller than viewport, and tighten spacing */
            @media (max-width: 640px) {
              .scroll-stack-card { overflow: hidden; }
              .scroll-stack-card .content-root { padding: 0.75rem !important; gap: 0.5rem !important; overflow: auto; -webkit-overflow-scrolling: touch; min-height: 100%; }
              .scroll-stack-card .feature-item { font-size: 0.7rem; }
              .scroll-stack-card h2 { font-size: 1.5rem; }
              .scroll-stack-card p { margin-bottom: 0.5rem; }
              /* Soften float animation inside ScrollStack to prevent overflow on small screens */
              @keyframes float-soft { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
              .scroll-stack-section .animate-float { animation-name: float-soft !important; }
            }
          `}</style>
          </ScrollStackItem>
        );
      })}
    </ScrollStack>
  );
}

export default ScrollStackServices;
