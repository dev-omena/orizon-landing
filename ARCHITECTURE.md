# Architecture Documentation

This document provides a comprehensive overview of the technical architecture, design patterns, and implementation details of the Orizon Landing Page.

## Table of Contents

- [Technology Stack](#technology-stack)
- [Architecture Overview](#architecture-overview)
- [File Structure](#file-structure)
- [Design Patterns](#design-patterns)
- [Animation System](#animation-system)
- [Performance Strategy](#performance-strategy)
- [State Management](#state-management)
- [Styling Architecture](#styling-architecture)

## Technology Stack

### Frontend Framework
- **Next.js 14.0.4** - React framework with App Router (RSC support)
- **React 18.3.1** - UI library with concurrent features
- **TypeScript 5.3.3** - Static type checking

### Animation & Graphics
- **GSAP 3.13.0** - Timeline-based animation engine
  - `gsap/ScrollTrigger` - Scroll-based animation triggers
- **Three.js 0.180.0** - WebGL 3D graphics
- **Lenis 1.3.11** - Smooth scroll library
- **@use-gesture/react 10.3.1** - Touch/mouse gesture handling

### Styling
- **Tailwind CSS 3.4.0** - Utility-first CSS
- **PostCSS 8.4.32** - CSS transformation
- **Autoprefixer 10.4.16** - CSS vendor prefixing
- **tailwindcss-animate 1.0.7** - Animation utilities
- **class-variance-authority 0.7.0** - Type-safe component variants
- **clsx 2.0.0** - Class name utilities
- **tailwind-merge 2.1.0** - Tailwind class merging

### UI Components
- **Lucide React 0.511.0** - Icon library
- **shadcn/ui** - Unstyled accessible components

## Architecture Overview

### Next.js App Router Structure

```
src/app/
├── favicon.ico          # Static favicon
├── icon.tsx             # Dynamic icon generation
├── layout.tsx           # Root layout (Server Component)
├── page.tsx             # Home page (Client Component)
└── globals.css          # Global styles with CSS variables
```

**Key Decisions:**
- App Router for file-based routing and improved performance
- Server Components for static content where possible
- Client Components (`'use client'`) for interactive elements
- Single-page application structure (all content on homepage)

### Component Architecture

```
src/components/
├── lib/                           # Shared utilities
│   ├── AnimatedGrid.tsx          # SVG grid animation
│   ├── CtaSection.tsx            # CTA component variant
│   ├── WorkSectionWithPortal.tsx # 3D work section
│   └── utils.{js,ts,d.ts}        # Utility functions
├── hooks/                         # Custom React hooks
│   ├── use-mobile.tsx            # Mobile detection
│   └── use-toast.tsx             # Toast notifications
├── CardSwap.tsx                   # Card transition component
├── CtaSection.tsx                 # Call-to-action section
├── Footer.tsx                     # Footer component
├── Header.tsx                     # Navigation header
├── Hero.tsx                       # Hero section (legacy)
├── InteractiveCTA.tsx             # Interactive button
├── LoadingScreen.tsx              # Initial loader
├── OrizonBanner.tsx               # Animated banner
├── OrizonHero.tsx                 # Stats hero section
├── ScrollStack.tsx                # Single stacking card
├── scroll-stack.tsx               # Services scroll section
├── Separator.tsx                  # Binary animation separator
├── TextPressure.tsx               # Mouse-reactive text
├── WaterDropGrid.tsx              # Grid animation variant
└── Waves.tsx                      # Canvas wave animation
```

**Component Categories:**

1. **Layout Components**
   - `Header`, `Footer` - Page structure
   - Server-rendered where possible

2. **Animation Components**
   - `Waves`, `AnimatedGrid`, `Separator` - Canvas/SVG animations
   - Client-side only with performance optimizations

3. **Interactive Components**
   - `TextPressure`, `InteractiveCTA` - Mouse interaction
   - Event-driven state updates

4. **Scroll Components**
   - `scroll-stack`, `WorkSectionWithPortal` - GSAP ScrollTrigger
   - Intersection Observer for performance

5. **Utility Components**
   - `LoadingScreen` - Initial experience
   - `OrizonBanner` - Decorative elements

## Design Patterns

### 1. Component Composition

```typescript
// Example: Separation of concerns
// scroll-stack.tsx - Container with scroll logic
export default function ScrollStackSection() {
  return (
    <section className="scroll-section">
      <ScrollStack service={service1} />
      <ScrollStack service={service2} />
      // ... more cards
    </section>
  );
}

// ScrollStack.tsx - Reusable card component
export function ScrollStack({ service }) {
  // Individual card logic
}
```

**Benefits:**
- Reusability
- Single responsibility
- Easier testing
- Better code organization

### 2. Custom Hooks Pattern

```typescript
// hooks/use-mobile.tsx
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    // ... logic
  }, []);

  return isMobile;
}
```

**Usage:**
- Encapsulate reusable logic
- Separate concerns from UI
- Improve testability

### 3. Ref Management for Animations

```typescript
// WorkSectionWithPortal.tsx
const containerRef = useRef<HTMLDivElement>(null);
const canvasRef = useRef<HTMLCanvasElement>(null);
const letterRefs = useRef<(HTMLDivElement | null)[]>([]);

useEffect(() => {
  // GSAP animations using refs
  gsap.to(letterRefs.current, { ... });
}, []);
```

**Purpose:**
- Direct DOM manipulation for animations
- Avoid React re-renders during animations
- Integration with imperative libraries (GSAP, Three.js)

### 4. Client Component Boundary

```typescript
'use client';  // Mark as Client Component

import { useEffect, useRef } from 'react';

export function InteractiveComponent() {
  // Can use browser APIs, event handlers, state
}
```

**Strategy:**
- Keep Server Components where possible for performance
- Use Client Components for:
  - Event handlers (onClick, onHover)
  - Browser APIs (canvas, window)
  - useState, useEffect hooks
  - Animation libraries

### 5. Utility-First Styling

```typescript
import { cn } from '@/lib/utils';

<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  variant === 'primary' && "variant-classes"
)} />
```

**Pattern:**
- `cn()` utility for conditional classes
- Tailwind utilities over custom CSS
- Component variants with CVA

## Animation System

### GSAP Integration

**ScrollTrigger Pattern:**

```typescript
// scroll-stack.tsx
useEffect(() => {
  gsap.registerPlugin(ScrollTrigger);

  const elements = gsap.utils.toArray('.stack-card');

  elements.forEach((element, index) => {
    gsap.to(element as HTMLElement, {
      scrollTrigger: {
        trigger: element as HTMLElement,
        start: "top bottom",
        end: "top top",
        scrub: true,
        markers: false,
      },
      y: 0,
      scale: 1,
      opacity: 1,
    });
  });

  return () => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  };
}, []);
```

**Key Principles:**
1. **Cleanup** - Always kill ScrollTriggers on unmount
2. **Scrub** - Smooth animations tied to scroll position
3. **Performance** - Use `will-change` CSS for animated elements
4. **Timing** - Start/end points relative to viewport

### Three.js Architecture

**WorkSectionWithPortal Pattern:**

```typescript
// 3D scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height);
const renderer = new THREE.WebGLRenderer({
  canvas: canvasRef.current,
  alpha: true
});

// Text geometry
const loader = new THREE.FontLoader();
loader.load('/fonts/font.json', (font) => {
  const geometry = new THREE.TextGeometry('WORK', {
    font: font,
    size: 80,
    height: 5,
  });
  // Create mesh and add to scene
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  // Update rotation, position, etc.
  renderer.render(scene, camera);
}
```

**Optimization Strategies:**
- Dispose geometries and materials on cleanup
- Use `requestAnimationFrame` for render loop
- Alpha channel for transparency
- Minimal polygon count for performance

### Canvas Animations (Waves)

**Perlin Noise Implementation:**

```typescript
// Custom noise function
function noise2D(x: number, y: number): number {
  // Perlin noise algorithm
  // Returns value between 0 and 1
}

// Point grid system
class Point {
  x: number;
  y: number;
  originalY: number;

  update(mouseX: number, mouseY: number) {
    // Calculate distance to mouse
    // Apply wave displacement
    // Apply cursor displacement
  }
}

// Animation loop
function draw() {
  ctx.clearRect(0, 0, width, height);

  points.forEach(point => {
    point.update(mouseX, mouseY);
  });

  drawCurves();  // Bezier curves connecting points
  requestAnimationFrame(draw);
}
```

**Performance:**
- Use `requestAnimationFrame` for 60fps
- Minimize canvas operations per frame
- Pre-calculate expensive operations
- Use `will-change: transform` CSS

## Performance Strategy

### Code Splitting

```typescript
// Dynamic imports for heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Spinner />,
  ssr: false,  // Client-side only
});
```

### Image Optimization

```javascript
// next.config.js
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
};
```

### Font Optimization

```typescript
// app/layout.tsx
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',  // Prevent FOIT (Flash of Invisible Text)
});
```

### Animation Performance

**Best Practices:**
1. **GPU Acceleration** - Use `transform` and `opacity` only
2. **Will-Change** - Hint browser about upcoming changes
3. **Debouncing** - Limit expensive calculations
4. **Intersection Observer** - Trigger animations only when visible

```typescript
// Example: Lazy animation initialization
useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startAnimation();
        observer.unobserve(entry.target);
      }
    });
  });

  observer.observe(elementRef.current);
}, []);
```

### Bundle Optimization

```javascript
// next.config.js
module.exports = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'gsap'],
  },
};
```

## State Management

### Local State Pattern

**No global state management library used** - Intentional decision for:
- Simple application structure
- No shared state between sections
- Better performance
- Reduced bundle size

**State Locations:**

1. **Component State** - `useState` for local UI state
   ```typescript
   const [isLoading, setIsLoading] = useState(true);
   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
   ```

2. **Ref State** - `useRef` for animation values
   ```typescript
   const scrollProgress = useRef(0);
   const animationFrame = useRef<number>();
   ```

3. **URL State** - Hash navigation for sections
   ```typescript
   // Header.tsx
   <a href="#work">Work</a>  // Updates URL hash
   ```

### Event Handling

**Mouse Tracking Pattern:**

```typescript
// TextPressure.tsx
const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

useEffect(() => {
  const handleMouseMove = (e: MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  };

  window.addEventListener('mousemove', handleMouseMove);
  return () => window.removeEventListener('mousemove', handleMouseMove);
}, []);
```

**Optimization:** Debounce/throttle for expensive handlers

## Styling Architecture

### CSS Variables System

```css
/* globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 237 49% 27%;      /* #272860 */
  --secondary: 54 100% 50%;    /* #f8e800 */
  --accent: 210 40% 96.1%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
}
```

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#272860',
        secondary: '#f8e800',
      },
      gridTemplateColumns: {
        '16': 'repeat(16, minmax(0, 1fr))',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
};
```

### Component Styling Pattern

```typescript
// Utility function for class merging
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage in components
<div className={cn(
  "base-class fixed inset-0",
  isActive && "z-50",
  className  // Allow prop override
)} />
```

### CSS Module Alternative

For components needing scoped styles:

```typescript
// InteractiveCTA.css
.cta-button {
  /* Component-specific styles */
  /* Not conflicting with Tailwind */
}
```

## Data Flow

### Top-Down Data Flow

```
page.tsx (Root)
├── LoadingScreen
├── Header
├── Waves
├── Separator
├── OrizonBanner
├── OrizonHero
├── Separator
├── scroll-stack
│   ├── ScrollStack (service1)
│   ├── ScrollStack (service2)
│   └── ...
├── WorkSectionWithPortal
├── CtaSection
└── Footer
```

**Characteristics:**
- Unidirectional data flow
- Props passed down for configuration
- No prop drilling (simple hierarchy)
- Event handlers remain local to components

### Service Data Pattern

```typescript
// scroll-stack.tsx
const services = [
  {
    number: "01",
    title: "Web Development",
    description: "...",
    features: [...],
    stats: { projects: 450, rating: 4.9 },
    videoSrc: "/1.mp4",
  },
  // ... more services
];

// Render
{services.map((service, index) => (
  <ScrollStack key={index} service={service} />
))}
```

**Benefits:**
- Easy to maintain
- Type-safe with TypeScript
- Scalable for CMS integration

## Error Handling

### Client-Side Error Boundaries

Currently not implemented - potential enhancement:

```typescript
// error.tsx (Next.js App Router)
'use client';

export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

### Animation Fallbacks

```typescript
// Check for browser support
useEffect(() => {
  if (!window.requestAnimationFrame) {
    // Fallback for older browsers
    setFallbackMode(true);
  }
}, []);
```

## Testing Strategy

**Note:** Testing not currently implemented

**Recommended Approach:**
- **Unit Tests**: Jest + React Testing Library
- **E2E Tests**: Playwright or Cypress
- **Visual Regression**: Chromatic or Percy
- **Performance**: Lighthouse CI

## Future Considerations

### Scalability
- Move service data to CMS (Contentful, Sanity)
- Add API routes for form submissions
- Implement analytics (GA4, Mixpanel)
- Add i18n for multi-language support

### Performance
- Implement service workers for offline support
- Add prefetching for critical resources
- Optimize animation libraries (tree shaking)
- Consider WebGL fallbacks for mobile

### Accessibility
- Add ARIA labels to interactive elements
- Implement keyboard navigation
- Ensure color contrast ratios
- Add reduced motion support

```typescript
// Respect user's motion preferences
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (!prefersReducedMotion) {
  // Apply animations
}
```

## Conclusion

The architecture prioritizes:
1. **Performance** - Optimized animations, code splitting, image optimization
2. **Developer Experience** - TypeScript, organized structure, reusable components
3. **User Experience** - Smooth animations, responsive design, fast load times
4. **Maintainability** - Clear patterns, separation of concerns, documentation

This foundation supports scaling while maintaining code quality and performance.
