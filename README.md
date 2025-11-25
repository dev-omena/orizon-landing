# Orizon Landing Page

A high-performance, animation-rich landing page built with Next.js 14, featuring advanced interactive elements and 3D graphics.

![Next.js](https://img.shields.io/badge/Next.js-14.0.4-black)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.0-38bdf8)

## Overview

Orizon is a modern agency landing page showcasing cutting-edge web development techniques. The project demonstrates advanced animation libraries, 3D graphics with Three.js, custom canvas animations, and smooth scroll interactions using GSAP.

## Key Features

- **Interactive Wave Animation** - Custom Perlin noise-based particle system with mouse interaction
- **3D Work Portfolio** - Three.js powered horizontal scroll section with animated typography
- **Text Pressure Effects** - Dynamic text that responds to cursor proximity with variable font manipulation
- **Scroll-Stacking Cards** - Services section with GSAP-powered scroll-triggered animations
- **Animated Statistics** - Counter animations triggered by viewport intersection
- **Loading Experience** - Smooth entry animation with bouncing logo
- **Responsive Design** - Fully responsive across all device sizes
- **Performance Optimized** - Code splitting, lazy loading, and optimized animations

## Tech Stack

### Core
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety and better developer experience

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **Custom CSS Variables** - Design tokens for theming

### Animation
- **GSAP 3.13** - Professional animation library with ScrollTrigger
- **Three.js 0.180** - 3D graphics library
- **Lenis 1.3** - Smooth scrolling
- **@use-gesture/react** - Gesture handling

### UI Components
- **Lucide React** - Icon library
- **shadcn/ui** - Reusable component system
- **class-variance-authority** - Component variant management

## Project Structure

```
landing/
├── public/              # Static assets (images, videos, PDFs)
├── src/
│   ├── app/            # Next.js App Router
│   │   ├── globals.css # Global styles
│   │   ├── layout.tsx  # Root layout
│   │   └── page.tsx    # Main page
│   ├── components/     # React components
│   │   ├── hooks/      # Custom React hooks
│   │   └── lib/        # Utility components
│   └── lib/            # Utility functions
├── next.config.js      # Next.js configuration
├── tailwind.config.js  # Tailwind configuration
└── tsconfig.json       # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd landing
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Create optimized production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code quality

## Page Sections

1. **Loading Screen** - Animated Orizon logo (800ms)
2. **Header** - Navigation with typewriter console effect
3. **Waves** - Interactive canvas animation with Perlin noise
4. **Banner** - Animated "OMENA AGENCY" text with character shuffling
5. **Hero** - Statistics counters (7 countries, 189+ clients, 1000+ projects)
6. **Services** - 6 scroll-stacking service cards
7. **Work Portfolio** - 3D horizontal scroll with project showcase
8. **CTA** - Interactive "LET'S ROCK" button with text pressure
9. **Footer** - Simple branding with scroll-to-top

## Design System

### Colors
- **Primary**: `#272860` (Deep Navy Blue)
- **Secondary**: `#f8e800` (Bright Yellow)
- High contrast yellow-on-blue theme

### Typography
- **Montserrat** - Body text (400, 500, 600, 700)
- **Halyard** - Display font (planned)

### Responsive Breakpoints
- Mobile: 640px
- Tablet: 768px
- Desktop: 1024px
- Large: 1280px
- XL: 1536px

## Performance Optimizations

- Code splitting with dynamic imports
- Image optimization (AVIF, WebP)
- Font optimization with swap strategy
- Console removal in production
- Canvas animations at 60fps
- Smooth scrolling with Lenis
- GPU-accelerated transforms

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Documentation

- [Architecture Guide](ARCHITECTURE.md) - Technical architecture and patterns
- [Component Documentation](COMPONENTS.md) - Detailed component API reference
- [Setup Guide](SETUP.md) - Development environment setup
- [Deployment Guide](DEPLOYMENT.md) - Production deployment instructions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is proprietary. All rights reserved.

## Contact

- Website: [Orizon Agency](https://orizon.agency)
- LinkedIn: [Orizon](https://linkedin.com/company/orizon)
- CodePen: [Orizon](https://codepen.io/orizon)

## Acknowledgments

- GSAP for powerful animation capabilities
- Three.js community for 3D graphics resources
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first approach
