import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  ReactElement,
  ReactNode,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (idx: number) => void;
  skewAmount?: number;
  easing?: 'linear' | 'elastic';
  scrollTrigger?: boolean;
  lockScroll?: boolean;
  children: ReactNode;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ customClass, ...rest }, ref) => (
  <div
    ref={ref}
    {...rest}
    className={`absolute top-1/2 left-1/2 [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden] transition-transform duration-700 ease-out ${customClass ?? ''} ${rest.className ?? ''}`.trim()}
  />
));
Card.displayName = 'Card';

type CardRef = RefObject<HTMLDivElement>;
interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i
});

const placeNow = (el: HTMLElement, slot: Slot, skew: number) => {
  el.style.transform = `translate3d(calc(-50% + ${slot.x}px), calc(-50% + ${slot.y}px), ${slot.z}px) skewY(${skew}deg)`;
  el.style.zIndex = slot.zIndex.toString();
};

const CardSwap: React.FC<CardSwapProps> = ({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  skewAmount = 6,
  easing = 'elastic',
  scrollTrigger = false,
  lockScroll = false,
  children
}) => {
  const childArr = useMemo(() => Children.toArray(children) as ReactElement<CardProps>[], [children]);
  const refs = useMemo<CardRef[]>(() => childArr.map(() => React.createRef<HTMLDivElement>()), [childArr.length]);

  const [currentOrder, setCurrentOrder] = useState<number[]>(Array.from({ length: childArr.length }, (_, i) => i));
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isScrollLocked, setIsScrollLocked] = useState(false);

  const container = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number>();
  const accumulatedDelta = useRef(0);
  const isInSection = useRef(false);

  // Swap card function
  const swapCard = (direction: 'next' | 'prev' = 'next') => {
    if (isAnimating) return;

    setIsAnimating(true);
    
    if (direction === 'next') {
      const [front, ...rest] = currentOrder;
      const elFront = refs[front].current;
      
      if (!elFront) {
        setIsAnimating(false);
        return;
      }

      // Animate front card down
      elFront.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
      elFront.style.transform = `translate3d(calc(-50% + ${makeSlot(front, cardDistance, verticalDistance, refs.length).x}px), calc(-50% + ${makeSlot(front, cardDistance, verticalDistance, refs.length).y + 500}px), ${makeSlot(front, cardDistance, verticalDistance, refs.length).z}px) skewY(${skewAmount}deg)`;

      // Update other cards positions
      rest.forEach((idx, i) => {
        const el = refs[idx].current;
        if (el) {
          const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
          el.style.transition = 'transform 0.6s ease-out';
          setTimeout(() => {
            placeNow(el, slot, skewAmount);
          }, i * 100);
        }
      });

      // Move front card to back after animation
      setTimeout(() => {
        if (elFront) {
          elFront.style.transition = 'none';
          const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
          elFront.style.transform = `translate3d(calc(-50% + ${backSlot.x}px), calc(-50% + ${backSlot.y}px), ${backSlot.z}px) skewY(${skewAmount}deg)`;
          elFront.style.zIndex = backSlot.zIndex.toString();
        }
        setCurrentOrder([...rest, front]);
        setCurrentCardIndex(prev => Math.min(prev + 1, childArr.length));
        setIsAnimating(false);
      }, 800);
    } else {
      // Previous card logic
      const back = currentOrder[currentOrder.length - 1];
      const rest = currentOrder.slice(0, -1);
      const elBack = refs[back].current;
      
      if (!elBack) {
        setIsAnimating(false);
        return;
      }

      // Move back card to front
      elBack.style.transition = 'none';
      const frontSlot = makeSlot(0, cardDistance, verticalDistance, refs.length);
      elBack.style.transform = `translate3d(calc(-50% + ${frontSlot.x}px), calc(-50% - 500px), ${frontSlot.z}px) skewY(${skewAmount}deg)`;
      
      setTimeout(() => {
        elBack.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
        placeNow(elBack, frontSlot, skewAmount);
        
        // Update other cards
        rest.forEach((idx, i) => {
          const el = refs[idx].current;
          if (el) {
            const slot = makeSlot(i + 1, cardDistance, verticalDistance, refs.length);
            el.style.transition = 'transform 0.6s ease-out';
            placeNow(el, slot, skewAmount);
          }
        });
      }, 50);

      setTimeout(() => {
        setCurrentOrder([back, ...rest]);
        setCurrentCardIndex(prev => Math.max(prev - 1, 0));
        setIsAnimating(false);
      }, 800);
    }
  };

  // Initial positioning
  useEffect(() => {
    refs.forEach((r, i) => {
      if (r.current) {
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        placeNow(r.current, slot, skewAmount);
      }
    });
  }, [cardDistance, verticalDistance, skewAmount, refs]);

   // Scroll lock effect
   useEffect(() => {
     if (!lockScroll || !sectionRef.current) return;

     const handleWheel = (e: WheelEvent) => {
       if (!sectionRef.current) return;

       const rect = sectionRef.current.getBoundingClientRect();
       const viewportHeight = window.innerHeight;
       
       // Check if section is in view (when section is visible)
       const isInView = rect.top <= viewportHeight * 0.5 && rect.bottom >= viewportHeight * 0.5;

       if (isInView) {
         isInSection.current = true;
         setIsScrollLocked(true);
         
         // If all cards have been seen, allow scroll through
         if (currentCardIndex >= childArr.length - 1) {
           if (e.deltaY > 0) {
             // Scrolling down - allow pass through after seeing all cards
             isInSection.current = false;
             setIsScrollLocked(false);
             return;
           }
         }

         // If first card and scrolling up, allow pass through
         if (currentCardIndex === 0 && e.deltaY < 0) {
           isInSection.current = false;
           setIsScrollLocked(false);
           return;
         }

         // Lock scroll and accumulate delta
         e.preventDefault();
         
         accumulatedDelta.current += e.deltaY;
         
         // Threshold for triggering card swap
         const threshold = 100;
         
         if (Math.abs(accumulatedDelta.current) > threshold && !isAnimating) {
           if (accumulatedDelta.current > 0 && currentCardIndex < childArr.length - 1) {
             // Scroll down - next card
             swapCard('next');
           } else if (accumulatedDelta.current < 0 && currentCardIndex > 0) {
             // Scroll up - previous card
             swapCard('prev');
           }
           accumulatedDelta.current = 0;
         }
       } else {
         isInSection.current = false;
         setIsScrollLocked(false);
         accumulatedDelta.current = 0;
       }
     };

     window.addEventListener('wheel', handleWheel, { passive: false });
     
     return () => {
       window.removeEventListener('wheel', handleWheel);
     };
   }, [lockScroll, currentCardIndex, childArr.length, isAnimating, cardDistance, verticalDistance, skewAmount]);

  // Auto-play (disabled when scroll trigger is on)
  useEffect(() => {
    if (scrollTrigger || lockScroll) return;

    const startInterval = () => {
      intervalRef.current = window.setInterval(() => swapCard('next'), delay);
    };

    setTimeout(() => swapCard('next'), 1000);
    startInterval();

    if (pauseOnHover && container.current) {
      const node = container.current;
      const pause = () => {
        setIsPaused(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
      const resume = () => {
        setIsPaused(false);
        startInterval();
      };
      
      node.addEventListener('mouseenter', pause);
      node.addEventListener('mouseleave', resume);
      
      return () => {
        node.removeEventListener('mouseenter', pause);
        node.removeEventListener('mouseleave', resume);
        clearInterval(intervalRef.current);
      };
    }

    return () => clearInterval(intervalRef.current);
  }, [delay, pauseOnHover, scrollTrigger, lockScroll]);

  const rendered = childArr.map((child, i) =>
    isValidElement<CardProps>(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: e => {
            child.props.onClick?.(e as React.MouseEvent<HTMLDivElement>);
            onCardClick?.(i);
          }
        } as CardProps & React.RefAttributes<HTMLDivElement>)
      : child
  );

  return (
    <>
      {/* Progress indicator */}
      {lockScroll && isScrollLocked && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black/80 text-white px-6 py-3 rounded-full backdrop-blur-sm">
          <div className="text-sm font-medium">
            Card {currentCardIndex} of {childArr.length}
          </div>
          <div className="mt-2 w-48 h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${(currentCardIndex / childArr.length) * 100}%` }}
            />
          </div>
        </div>
      )}
      
       <div
         ref={sectionRef}
         className="relative w-full h-full flex items-center justify-center"
       >
         <div
           ref={container}
           className="relative transform origin-center perspective-[1000px] overflow-visible max-[768px]:scale-[0.8] max-[480px]:scale-[0.65]"
           style={{ 
             width: typeof width === 'string' ? width : `${width}px`, 
             height: typeof height === 'string' ? height : `${height}px` 
           }}
         >
           {rendered}
         </div>
       </div>
    </>
  );
};

export default CardSwap;