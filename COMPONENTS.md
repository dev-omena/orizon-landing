# Component Documentation

Comprehensive API reference for all components in the Orizon Landing Page.

## Table of Contents

- [Layout Components](#layout-components)
  - [Header](#header)
  - [Footer](#footer)
- [Animation Components](#animation-components)
  - [LoadingScreen](#loadingscreen)
  - [Waves](#waves)
  - [Separator](#separator)
  - [AnimatedGrid](#animatedgrid)
- [Content Components](#content-components)
  - [OrizonBanner](#orizonbanner)
  - [OrizonHero](#orizonhero)
- [Scroll Components](#scroll-components)
  - [ScrollStackSection](#scrollstacksection)
  - [ScrollStack](#scrollstack)
  - [WorkSectionWithPortal](#worksectionwithportal)
- [Interactive Components](#interactive-components)
  - [TextPressure](#textpressure)
  - [InteractiveCTA](#interactivecta)
  - [CtaSection](#ctasection)
- [Utility Components](#utility-components)
- [Custom Hooks](#custom-hooks)

---

## Layout Components

### Header

Navigation header with animated console messages and social links.

**Location:** [src/components/Header.tsx](src/components/Header.tsx)

**Type:** Client Component

**Features:**
- 16-column grid layout
- Typewriter console animation
- Smooth scroll navigation
- Social media links
- QR code modal
- Availability status indicator

**Props:**
```typescript
// No props - standalone component
```

**Usage:**
```tsx
import Header from '@/components/Header';

<Header />
```

**Key Elements:**
- Logo (full Orizon branding)
- Console messages with random flickering
- Navigation links (About, Work, Contact)
- Social links (CodePen, LinkedIn)
- "Available for new projects" badge
- QR code for contact

**Styling:**
- Fixed positioning during scroll
- Glassmorphism effect
- Yellow accent hover states
- Responsive grid layout

**Internal State:**
```typescript
const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
const [displayedMessage, setDisplayedMessage] = useState('');
```

---

### Footer

Simple footer with scroll-to-top functionality.

**Location:** [src/components/Footer.tsx](src/components/Footer.tsx)

**Type:** Client Component

**Features:**
- Orizon icon
- Scroll to top on click
- Minimal design

**Props:**
```typescript
// No props
```

**Usage:**
```tsx
import Footer from '@/components/Footer';

<Footer />
```

---

## Animation Components

### LoadingScreen

Initial loading animation with bouncing Orizon logo.

**Location:** [src/components/LoadingScreen.tsx](src/components/LoadingScreen.tsx)

**Type:** Client Component

**Features:**
- 800ms display duration
- Bouncing letter animation
- Pulse glow effect
- Auto-dismiss after loading

**Props:**
```typescript
interface LoadingScreenProps {
  onLoadingComplete?: () => void;
}
```

**Usage:**
```tsx
import LoadingScreen from '@/components/LoadingScreen';

const [isLoading, setIsLoading] = useState(true);

<LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
```

**Animation Sequence:**
1. Letters appear with bounce effect
2. Pulse glow animation
3. Fade out after 800ms
4. Call `onLoadingComplete` callback

**Styling:**
```css
.letter-bounce {
  animation: bounce 0.6s ease-in-out;
}

.pulse-glow {
  animation: pulse 2s ease-in-out infinite;
}
```

---

### Waves

Interactive canvas-based wave animation with Perlin noise.

**Location:** [src/components/Waves.tsx](src/components/Waves.tsx)

**Type:** Client Component

**Features:**
- Perlin noise algorithm
- Mouse/touch interaction
- Smooth particle grid
- Cursor tracking with visual indicator
- Dynamic wave displacement

**Props:**
```typescript
// No props - responsive to container
```

**Usage:**
```tsx
import Waves from '@/components/Waves';

<div className="relative h-screen">
  <Waves />
</div>
```

**Technical Details:**

**Canvas Setup:**
```typescript
const canvasRef = useRef<HTMLCanvasElement>(null);
const dpi = window.devicePixelRatio || 1;
canvas.width = width * dpi;
canvas.height = height * dpi;
```

**Point Grid System:**
```typescript
class Point {
  x: number;
  y: number;
  originalY: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.originalY = y;
  }

  update(time: number, mouseX: number, mouseY: number) {
    // Wave displacement
    const waveDisplacement = noise2D(
      this.x * 0.005 + time * 0.0001,
      this.y * 0.005
    ) * waveAmplitude;

    // Mouse interaction
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < cursorRadius) {
      const force = (1 - distance / cursorRadius) * pushStrength;
      const angle = Math.atan2(dy, dx);
      this.y += Math.sin(angle) * force;
    }

    // Return to original position with friction
    this.y += (this.originalY + waveDisplacement - this.y) * 0.1;
  }
}
```

**Configuration:**
```typescript
const gridSpacing = 30;        // Distance between points
const waveAmplitude = 50;      // Wave height
const cursorRadius = 150;      // Mouse interaction radius
const pushStrength = 100;      // Mouse push force
const friction = 0.1;          // Return speed
```

**Performance:**
- RequestAnimationFrame for 60fps
- Point pooling to avoid garbage collection
- Debounced resize handling
- GPU acceleration with `will-change`

---

### Separator

Animated binary sequences (0s and 1s) separator.

**Location:** [src/components/Separator.tsx](src/components/Separator.tsx)

**Type:** Client Component

**Features:**
- Random binary flicker animation
- Synchronized character changes
- Decorative triangles
- Yellow accent color

**Props:**
```typescript
// No props
```

**Usage:**
```tsx
import Separator from '@/components/Separator';

<Separator />
```

**Animation:**
```typescript
useEffect(() => {
  const interval = setInterval(() => {
    // Randomly change 0s to 1s and vice versa
    const newSequence = sequence.map(() =>
      Math.random() > 0.7 ? '1' : '0'
    );
    setSequence(newSequence);
  }, 100);

  return () => clearInterval(interval);
}, []);
```

---

### AnimatedGrid

SVG-based grid with traveling wave effect.

**Location:** [src/components/lib/AnimatedGrid.tsx](src/components/lib/AnimatedGrid.tsx)

**Type:** Client Component

**Features:**
- Gaussian wave propagation
- Hover push effect
- Continuous animation loop
- Configurable grid size and spacing

**Props:**
```typescript
interface AnimatedGridProps {
  spacing?: number;      // Grid spacing (default: 50)
  waveSpeed?: number;    // Wave travel speed (default: 0.001)
  waveWidth?: number;    // Gaussian wave width (default: 0.0002)
  amplitude?: number;    // Wave height (default: 20)
}
```

**Usage:**
```tsx
import AnimatedGrid from '@/components/lib/AnimatedGrid';

<AnimatedGrid
  spacing={50}
  waveSpeed={0.001}
  amplitude={20}
/>
```

**Wave Algorithm:**
```typescript
const waveOffset = (x: number, y: number, time: number) => {
  const centerX = cols / 2;
  const centerY = rows / 2;
  const distanceFromCenter = Math.sqrt(
    Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
  );

  // Gaussian wave
  const wave = Math.exp(
    -Math.pow(distanceFromCenter - time * waveSpeed, 2) / waveWidth
  );

  return wave * amplitude;
};
```

---

## Content Components

### OrizonBanner

Large animated "OMENA AGENCY" text banner.

**Location:** [src/components/OrizonBanner.tsx](src/components/OrizonBanner.tsx)

**Type:** Client Component

**Features:**
- Random character shuffling animation
- Characters push in from different directions
- Star icon separator
- Large display text

**Props:**
```typescript
interface OrizonBannerProps {
  text?: string;  // Default: "OMENA AGENCY"
}
```

**Usage:**
```tsx
import OrizonBanner from '@/components/OrizonBanner';

<OrizonBanner text="OMENA AGENCY" />
```

**Animation Logic:**
```typescript
const animateCharacter = (index: number) => {
  const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
  let iterations = 0;

  const interval = setInterval(() => {
    setDisplayedText(prev => {
      const chars = prev.split('');
      chars[index] = randomChars[Math.floor(Math.random() * randomChars.length)];
      return chars.join('');
    });

    iterations++;
    if (iterations > 10) {
      clearInterval(interval);
      // Set final character
    }
  }, 50);
};
```

---

### OrizonHero

Hero section with animated statistics counters.

**Location:** [src/components/OrizonHero.tsx](src/components/OrizonHero.tsx)

**Type:** Client Component

**Features:**
- Animated number counters
- Intersection Observer triggered
- Grid background pattern
- Three statistics display

**Props:**
```typescript
// No props - statistics are hardcoded
```

**Usage:**
```tsx
import OrizonHero from '@/components/OrizonHero';

<OrizonHero />
```

**Statistics:**
- Countries Served: 7
- Happy Clients: 189+
- Projects Completed: 1000+

**Counter Animation:**
```typescript
const [stats, setStats] = useState({
  countries: 0,
  clients: 0,
  projects: 0
});

useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateCounter('countries', 7, 2000);
      animateCounter('clients', 189, 2500);
      animateCounter('projects', 1000, 3000);
    }
  });

  observer.observe(ref.current);
}, []);

const animateCounter = (key: string, target: number, duration: number) => {
  const start = 0;
  const increment = target / (duration / 16); // 60fps

  const timer = setInterval(() => {
    setStats(prev => {
      const newValue = prev[key] + increment;
      if (newValue >= target) {
        clearInterval(timer);
        return { ...prev, [key]: target };
      }
      return { ...prev, [key]: Math.floor(newValue) };
    });
  }, 16);
};
```

---

## Scroll Components

### ScrollStackSection

Container for scroll-stacking service cards.

**Location:** [src/components/scroll-stack.tsx](src/components/scroll-stack.tsx)

**Type:** Client Component

**Features:**
- Six service cards
- GSAP ScrollTrigger integration
- Scroll-based stacking animation
- Video backgrounds (planned)

**Props:**
```typescript
// No props - services data is internal
```

**Usage:**
```tsx
import ScrollStackSection from '@/components/scroll-stack';

<ScrollStackSection />
```

**Service Data Structure:**
```typescript
interface Service {
  number: string;           // "01", "02", etc.
  title: string;            // Service name
  description: string;      // Service description
  features: string[];       // Feature list
  stats: {
    projects: number;
    rating: number;
  };
  videoSrc?: string;        // Background video path
}
```

**Services:**
1. **Web Development** - 450 projects, 4.9 rating
2. **UI/UX Design** - 320 projects, 4.8 rating
3. **Brand Strategy** - 180 projects, 4.9 rating
4. **Performance Marketing** - 275 projects, 4.7 rating
5. **Digital Marketing** - 410 projects, 4.8 rating
6. **Product Launch** - 95 projects, 4.9 rating

**GSAP Animation:**
```typescript
useEffect(() => {
  gsap.registerPlugin(ScrollTrigger);

  const cards = gsap.utils.toArray('.stack-card');

  cards.forEach((card, index) => {
    gsap.fromTo(
      card as HTMLElement,
      {
        y: 100 + index * 20,
        scale: 0.9,
        opacity: 0,
      },
      {
        y: 0,
        scale: 1,
        opacity: 1,
        scrollTrigger: {
          trigger: card as HTMLElement,
          start: "top bottom",
          end: "top top",
          scrub: true,
        },
      }
    );
  });

  return () => {
    ScrollTrigger.getAll().forEach(st => st.kill());
  };
}, []);
```

---

### ScrollStack

Individual stacking card component.

**Location:** [src/components/ScrollStack.tsx](src/components/ScrollStack.tsx)

**Type:** Client Component

**Features:**
- Service number badge
- Feature list
- Statistics display
- Video background support
- Responsive layout

**Props:**
```typescript
interface ScrollStackProps {
  service: {
    number: string;
    title: string;
    description: string;
    features: string[];
    stats: {
      projects: number;
      rating: number;
    };
    videoSrc?: string;
  };
  className?: string;
}
```

**Usage:**
```tsx
import ScrollStack from '@/components/ScrollStack';

<ScrollStack
  service={{
    number: "01",
    title: "Web Development",
    description: "Full-stack development services",
    features: ["React", "Next.js", "Node.js"],
    stats: { projects: 450, rating: 4.9 }
  }}
/>
```

**Layout:**
- Sticky positioning during scroll
- Grid layout for content
- Yellow accent borders
- Dark background with transparency

---

### WorkSectionWithPortal

Advanced 3D work portfolio section with Three.js.

**Location:** [src/components/lib/WorkSectionWithPortal.tsx](src/components/lib/WorkSectionWithPortal.tsx)

**Type:** Client Component

**Features:**
- Three.js 3D text ("WORK")
- Horizontal scroll through projects
- 7 project cards with videos
- Dynamic grid background
- Bottle distortion effect
- Complex GSAP animations

**Props:**
```typescript
// No props - projects are hardcoded
```

**Usage:**
```tsx
import WorkSectionWithPortal from '@/components/lib/WorkSectionWithPortal';

<WorkSectionWithPortal />
```

**Project Structure:**
```typescript
const projects = [
  { id: 1, videoSrc: '/1.mp4', title: 'Project 1' },
  { id: 2, videoSrc: '/2.mp4', title: 'Project 2' },
  // ... 7 total projects
];
```

**Three.js Setup:**
```typescript
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({
  canvas: canvasRef.current,
  alpha: true,
  antialias: true
});

// Load font and create text geometry
const loader = new THREE.FontLoader();
loader.load('/fonts/helvetiker_regular.json', (font) => {
  const geometry = new THREE.TextGeometry('WORK', {
    font: font,
    size: 80,
    height: 5,
    curveSegments: 12,
  });

  const material = new THREE.MeshBasicMaterial({
    color: 0xf8e800,
    wireframe: false,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
});
```

**GSAP Scroll Animation:**
```typescript
ScrollTrigger.create({
  trigger: containerRef.current,
  start: "top top",
  end: "bottom bottom",
  scrub: 1,
  onUpdate: (self) => {
    // Update camera position based on scroll
    camera.position.x = self.progress * 500;

    // Rotate letters
    letterRefs.current.forEach((letter, index) => {
      if (letter) {
        letter.rotation.y = self.progress * Math.PI * 2;
      }
    });
  },
});
```

**Performance Considerations:**
- Dispose Three.js resources on unmount
- Limit polygon count
- Use requestAnimationFrame efficiently
- Debounce resize handlers

---

## Interactive Components

### TextPressure

Interactive text with variable font manipulation based on mouse proximity.

**Location:** [src/components/TextPressure.tsx](src/components/TextPressure.tsx)

**Type:** Client Component

**Features:**
- Variable font weight/width/italic changes
- Smooth cursor tracking with lerp
- Per-character transformation
- Real-time distance calculation

**Props:**
```typescript
interface TextPressureProps {
  text: string;
  className?: string;
  maxDistance?: number;    // Max influence distance (default: 150)
  fontVariations?: {
    weight?: [number, number];  // [min, max] (default: [100, 900])
    width?: [number, number];   // [min, max] (default: [75, 125])
    italic?: [number, number];  // [min, max] (default: [0, 1])
  };
}
```

**Usage:**
```tsx
import TextPressure from '@/components/TextPressure';

<TextPressure
  text="LET'S ROCK"
  maxDistance={150}
  fontVariations={{
    weight: [100, 900],
    width: [75, 125],
    italic: [0, 1]
  }}
/>
```

**Algorithm:**
```typescript
const calculateCharacterStyle = (
  charRect: DOMRect,
  mouseX: number,
  mouseY: number
) => {
  const charCenterX = charRect.left + charRect.width / 2;
  const charCenterY = charRect.top + charRect.height / 2;

  const dx = mouseX - charCenterX;
  const dy = mouseY - charCenterY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > maxDistance) {
    return defaultStyle;
  }

  const influence = 1 - (distance / maxDistance);

  return {
    fontWeight: lerp(100, 900, influence),
    fontStretch: `${lerp(75, 125, influence)}%`,
    fontStyle: `oblique ${lerp(0, 45, influence)}deg`,
  };
};

// Smooth interpolation
const lerp = (start: number, end: number, t: number) => {
  return start + (end - start) * t;
};
```

**CSS Requirements:**
```css
.text-pressure-char {
  display: inline-block;
  font-variation-settings: 'wght' var(--weight), 'wdth' var(--width);
  font-style: oblique var(--italic);
  transition: all 0.1s ease-out;
}
```

---

### InteractiveCTA

Interactive "GO" button that expands on hover.

**Location:** [src/components/InteractiveCTA.tsx](src/components/InteractiveCTA.tsx)
**Styles:** [src/components/InteractiveCTA.css](src/components/InteractiveCTA.css)

**Type:** Client Component

**Features:**
- Hover expansion animation
- "GO" → "LET'S ROCK" reveal
- Yellow glow effect
- Smooth transitions

**Props:**
```typescript
interface InteractiveCTAProps {
  onClick?: () => void;
  className?: string;
}
```

**Usage:**
```tsx
import InteractiveCTA from '@/components/InteractiveCTA';

<InteractiveCTA onClick={() => console.log('CTA clicked')} />
```

**Animation States:**
1. **Default:** Shows "GO" text, compact width
2. **Hover:** Expands width, reveals "LET'S ROCK"
3. **Click:** Triggers callback

**CSS Animation:**
```css
.interactive-cta {
  width: 100px;
  transition: width 0.3s ease;
}

.interactive-cta:hover {
  width: 300px;
}

.interactive-cta .hidden-text {
  opacity: 0;
  transform: translateX(-20px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.interactive-cta:hover .hidden-text {
  opacity: 1;
  transform: translateX(0);
}
```

---

### CtaSection

Full CTA section with animated grid and interactive button.

**Location:** [src/components/CtaSection.tsx](src/components/CtaSection.tsx)

**Type:** Client Component

**Features:**
- AnimatedGrid background
- TextPressure heading
- InteractiveCTA button
- Pulse glow animation
- Centered layout

**Props:**
```typescript
// No props
```

**Usage:**
```tsx
import CtaSection from '@/components/CtaSection';

<CtaSection />
```

**Structure:**
```tsx
<section className="cta-section">
  <AnimatedGrid />
  <div className="content">
    <TextPressure text="READY TO ELEVATE?" />
    <InteractiveCTA onClick={handleCTA} />
  </div>
</section>
```

---

## Utility Components

### CardSwap

Card transition component (legacy/unused).

**Location:** [src/components/CardSwap.tsx](src/components/CardSwap.tsx)

**Status:** Not actively used in current implementation.

---

### WaterDropGrid

Alternative grid animation (legacy/unused).

**Location:** [src/components/WaterDropGrid.tsx](src/components/WaterDropGrid.tsx)

**Status:** Not actively used in current implementation.

---

### Hero

Legacy hero component.

**Location:** [src/components/Hero.tsx](src/components/Hero.tsx)

**Status:** Replaced by OrizonHero. Not used.

---

## Custom Hooks

### use-mobile

Detects mobile viewport.

**Location:** [src/components/hooks/use-mobile.tsx](src/components/hooks/use-mobile.tsx)

**Usage:**
```typescript
import { useIsMobile } from '@/components/hooks/use-mobile';

function Component() {
  const isMobile = useIsMobile();

  return (
    <div>
      {isMobile ? <MobileView /> : <DesktopView />}
    </div>
  );
}
```

**Implementation:**
```typescript
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');

    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isMobile;
}
```

---

### use-toast

Toast notification hook (currently unused).

**Location:** [src/components/hooks/use-toast.tsx](src/components/hooks/use-toast.tsx)

**Purpose:** Planned for future error/success messages.

**Potential Usage:**
```typescript
import { useToast } from '@/components/hooks/use-toast';

function Component() {
  const { toast } = useToast();

  const handleAction = () => {
    toast({
      title: "Success!",
      description: "Action completed successfully.",
      variant: "success",
    });
  };
}
```

---

## Component Best Practices

### 1. Client Component Declaration

```typescript
'use client';

import { useEffect } from 'react';

export default function MyComponent() {
  // Client-side logic
}
```

### 2. Cleanup Pattern

```typescript
useEffect(() => {
  const handler = () => { /* logic */ };

  window.addEventListener('event', handler);

  return () => {
    window.removeEventListener('event', handler);
  };
}, []);
```

### 3. GSAP Cleanup

```typescript
useEffect(() => {
  const tl = gsap.timeline();
  // ... animations

  return () => {
    tl.kill();
    ScrollTrigger.getAll().forEach(st => st.kill());
  };
}, []);
```

### 4. Three.js Cleanup

```typescript
useEffect(() => {
  const scene = new THREE.Scene();
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial();

  return () => {
    geometry.dispose();
    material.dispose();
    renderer.dispose();
  };
}, []);
```

### 5. Ref Usage

```typescript
const elementRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (!elementRef.current) return;

  // Safe to use elementRef.current
}, []);
```

---

## Component Composition Examples

### Example 1: Page Layout

```tsx
// src/app/page.tsx
export default function Home() {
  return (
    <main>
      <LoadingScreen />
      <Header />
      <Waves />
      <Separator />
      <OrizonBanner />
      <OrizonHero />
      <Separator />
      <ScrollStackSection />
      <WorkSectionWithPortal />
      <CtaSection />
      <Footer />
    </main>
  );
}
```

### Example 2: Custom Service Card

```tsx
function CustomServiceSection() {
  const services = [
    { title: 'Service 1', /* ... */ },
    { title: 'Service 2', /* ... */ },
  ];

  return (
    <section>
      {services.map((service, index) => (
        <ScrollStack key={index} service={service} />
      ))}
    </section>
  );
}
```

---

## Styling Components

All components use Tailwind CSS with the `cn()` utility:

```typescript
import { cn } from '@/lib/utils';

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  className  // Allow override
)} />
```

## Performance Tips

1. **Lazy Load Heavy Components**
   ```typescript
   const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
     ssr: false
   });
   ```

2. **Memoize Expensive Calculations**
   ```typescript
   const expensiveValue = useMemo(() => {
     return calculateExpensiveValue(prop);
   }, [prop]);
   ```

3. **Debounce Event Handlers**
   ```typescript
   const debouncedHandler = useMemo(
     () => debounce(handler, 100),
     [handler]
   );
   ```

4. **Use Intersection Observer**
   ```typescript
   const observer = new IntersectionObserver((entries) => {
     if (entries[0].isIntersecting) {
       // Start animation only when visible
     }
   });
   ```

---

This component documentation provides a complete reference for all components in the Orizon Landing Page. For implementation details, refer to the source files linked in each section.
