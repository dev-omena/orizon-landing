import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WorkSectionWithPortal = () => {
  // Use videos from public folder - all cards same size
  const cards = [
    { video: '/1.mp4', title: 'Eclipse Horizon', number: '739284' },
    { video: '/2.mp4', title: 'Vision Link', number: '385912' },
    { video: '/3.mp4', title: 'Iron Bond', number: '621478' },
    { video: '/4.mp4', title: 'Golden Case', number: '839251' },
    { video: '/5.mp4', title: 'Virtual Space', number: '456732' },
    { video: '/6.mp4', title: 'Smart Vision', number: '974315' },
    { video: '/7.mp4', title: 'Desert Tunnel', number: '682943' },
  ];

  const sectionRef = useRef<HTMLElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardElementsRef = useRef<HTMLDivElement[]>([]);
  const gridCanvasRef = useRef<HTMLCanvasElement>(null);
  const lettersCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const letterPositionsRef = useRef(new Map());
  const currentXPositionRef = useRef(0);
  const ovalRef = useRef<HTMLDivElement>(null);
  const workTextRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const cardsContainer = cardsContainerRef.current;
    const textContainer = textContainerRef.current;
    const oval = ovalRef.current;
    const workText = workTextRef.current;

    if (!section || !cardsContainer || !textContainer || !oval || !workText) return;

    const initialSectionRect = section.getBoundingClientRect();
    const moveDistance = initialSectionRect.width * 8;

    const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

    // Grid Canvas Setup
    const gridCanvas = gridCanvasRef.current;
    if (!gridCanvas) return;
    const gridCtx = gridCanvas.getContext('2d');
    if (!gridCtx) return;

    const resizeGridCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const sectionRect = section.getBoundingClientRect();
      const actualWidth = sectionRect.width;
      const actualHeight = sectionRect.height;
      const sectionWidth = actualWidth * 6; // canvas CSS width

      // Reset transform before resizing to avoid compounded scales
      gridCtx.setTransform(1, 0, 0, 1, 0, 0);
      gridCanvas.width = Math.max(1, Math.floor(sectionWidth * dpr));
      gridCanvas.height = Math.max(1, Math.floor(actualHeight * dpr));
      gridCanvas.style.width = `${sectionWidth}px`;
      gridCanvas.style.height = `${actualHeight}px`;
      // Scale to device pixels; from now on draw in CSS pixels
      gridCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resizeGridCanvas();

    const drawGrid = (scrollProgress = 0) => {
      // Draw using CSS pixel dimensions (because context is scaled)
      const sectionRect = section.getBoundingClientRect();
      const actualWidth = sectionRect.width;
      const actualHeight = sectionRect.height;
      const sectionWidth = actualWidth * 6;

      // Clear and paint background (dark blue)
      gridCtx.clearRect(0, 0, sectionWidth, actualHeight);
      gridCtx.fillStyle = '#272860';
      gridCtx.fillRect(0, 0, sectionWidth, actualHeight);
      // Yellow grid squares
      gridCtx.fillStyle = '#f8e800';
      
      const baseSpacing = 30;
      const scaleFactor = Math.min(actualWidth / 1920, actualHeight / 1080, 1);
      const spacing = baseSpacing * scaleFactor;
      const squareSize = Math.max(1, 2 * scaleFactor); // Make squares instead of dots

      const [rows, cols] = [
        Math.ceil(actualHeight / spacing),
        Math.ceil(sectionWidth / spacing),
      ];
      const offset = (scrollProgress * spacing * 10) % spacing;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const xPos = x * spacing - offset;
          // Draw squares instead of circles
          gridCtx.fillRect(xPos - squareSize/2, y * spacing - squareSize/2, squareSize, squareSize);
        }
      }
    };

    // Three.js Setup
    const cameraSectionRect = section.getBoundingClientRect();
    const lettersCamera = new THREE.PerspectiveCamera(
      50,
      cameraSectionRect.width / cameraSectionRect.height,
      0.1,
      1000
    );
    lettersCamera.position.z = 20;

    const lettersRenderer = new THREE.WebGLRenderer({
      canvas: lettersCanvasRef.current as HTMLCanvasElement,
      antialias: true,
      alpha: true,
    });
    const rendererSectionRect = section.getBoundingClientRect();
    lettersRenderer.setSize(rendererSectionRect.width, rendererSectionRect.height);
    lettersRenderer.setClearColor(0x272860, 1); // Dark blue background
    lettersRenderer.setPixelRatio(window.devicePixelRatio);

    const lettersScene = new THREE.Scene();

    const createTextAnimationPath = (yPos: number, amplitude: number, startY: number): any => {
      const points = [];
      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        const xProgress = Math.max(0, (t - 0.1) / 0.9);
        points.push(
          new THREE.Vector3(
            -25 + 50 * xProgress,
            t < 0.1 ? startY : yPos + Math.sin(xProgress * Math.PI) * -amplitude,
            (1 - Math.pow(Math.abs(xProgress - 0.5) * 2, 2)) * -5
          )
        );
      }
      const curve = new THREE.CatmullRomCurve3(points);
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(curve.getPoints(100)),
        new THREE.LineBasicMaterial({ color: 0x272860, linewidth: 1 }) // Dark blue lines
      ) as any;
      line.curve = curve;
      return line;
    };

    const path = [
      createTextAnimationPath(10, 2, 12),
      createTextAnimationPath(3.5, 1, 4),
      createTextAnimationPath(-3.5, -1, -4),
      createTextAnimationPath(-10, -2, -12),
    ];
    path.forEach((line) => lettersScene.add(line));

    const letterPositions = letterPositionsRef.current;
    path.forEach((line: any, i) => {
      line.letterElements = Array.from({ length: 8 }, () => {
        const el = document.createElement('div');
        el.className = 'letter';
        el.textContent = ['W', 'O', 'R', 'K'][i];
        textContainer.appendChild(el);
        letterPositions.set(el, {
          current: { x: 0, y: 0 },
          target: { x: 0, y: 0 },
        });
        return el;
      });
    });

    const lineSpeedMultipliers = [0.8, 1, 0.7, 0.9];
    const updateTargetPositions = (scrollProgress = 0) => {
      path.forEach((line: any, lineIndex) => {
        line.letterElements.forEach((element: any, i: number) => {
          const point = line.curve.getPoint(
            (i / 7 + scrollProgress * lineSpeedMultipliers[lineIndex]) % 1
          );
          const vector = point.clone().project(lettersCamera);
          const positions = letterPositions.get(element);
          const sectionRect = section.getBoundingClientRect();
          positions.target = {
            x: (-vector.x * 0.5 + 0.5) * sectionRect.width,
            y: (-vector.y * 0.5 + 0.5) * sectionRect.height,
          };
        });
      });
    };

    const updateLetterPositions = () => {
      letterPositions.forEach((positions: any, element: any) => {
        const sectionRect = section.getBoundingClientRect();
        const distX = positions.target.x - positions.current.x;
        if (Math.abs(distX) > sectionRect.width * 0.7) {
          positions.current.x = positions.target.x;
          positions.current.y = positions.target.y;
        } else {
          positions.current.x = lerp(
            positions.current.x,
            positions.target.x,
            0.07
          );
          positions.current.y = lerp(
            positions.current.y,
            positions.target.y,
            0.07
          );
        }
        element.style.transform = `translate(-50%, -50%) translate3d(${positions.current.x}px, ${positions.current.y}px, 0px)`;
      });
    };

    let currentScrollTrigger: any = null;

    const updateCardsPosition = () => {
      const targetX = -moveDistance * (currentScrollTrigger?.progress || 0);
      currentXPositionRef.current = lerp(currentXPositionRef.current, targetX, 0.07);

      gsap.set(cardsContainer, {
        x: currentXPositionRef.current,
      });

      // Apply cylindrical angle effect to individual cards
      const cardElements = cardElementsRef.current;
      const sectionRect = section.getBoundingClientRect();
      const viewportCenter = sectionRect.width / 2;

      cardElements.forEach((card, index) => {
        if (!card) return;

        const cardRect = card.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;

        // Calculate distance from viewport center
        const distanceFromCenter = cardCenterX - viewportCenter;
        
        // Normalize distance (-1 to 1, where 0 is center)
        const normalizedDistance = distanceFromCenter / (sectionRect.width / 2);

        // Reverse cylindrical rotation - cards angle inward
        // Cards on right angle towards left, cards on left angle towards right
        const maxAngle = 15; // Reduced rotation - subtle angle only
        const angleY = -normalizedDistance * maxAngle; // Reversed with negative

        // Inward cylindrical depth effect - center cards come forward
        // Cards at edges are pushed back, center cards pop forward
        const maxDepth = 200;
        const zTranslate = (1 - Math.abs(normalizedDistance)) * maxDepth - maxDepth;

        // Scale effect - cards closer to center are slightly larger
        const scaleEffect = 1 - (Math.abs(normalizedDistance) * 0.15);
        const finalScale = Math.max(0.85, Math.min(1, scaleEffect));

        // Apply 3D transforms with cylindrical effect
        gsap.set(card, {
          rotationY: angleY,
          z: zTranslate,
          scale: finalScale,
          transformOrigin: 'center center'
        });
      });
    };

    const animate = () => {
      updateLetterPositions();
      updateCardsPosition();
      lettersRenderer.render(lettersScene, lettersCamera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Main ScrollTrigger - handles both portal and work section
    const startAnimation = () => {
      if (!animationFrameRef.current) {
        animate();
      }
    };
    const stopAnimation = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };

    currentScrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=800%',
  pin: true,
  // Use fixed pinning so the section truly overlays the viewport and hides siblings
  pinType: 'fixed',
      pinSpacing: true,
      scrub: 1.5,
      onUpdate: (self) => {
        const progress = self.progress;
        if (progress < 0.1) {
          const openProgress = progress / 0.1;
          const ovalScale = 1 + (openProgress * 30);
            // Keep section dark blue background throughout
            gsap.set(section, { backgroundColor: '#272860', transition: 'background-color 0.3s ease-out' });
            gsap.set(backgroundRef.current, { opacity: 1, display: 'block' });
            gsap.set(oval, { scale: ovalScale, opacity: 1 });
          gsap.set(workText, { opacity: 1 - (openProgress * 3) });
          gsap.set(textContainer, { opacity: openProgress * 2, scale: 0.5 + (openProgress * 0.5) });
          gsap.set(cardsContainer, { opacity: openProgress > 0.6 ? (openProgress - 0.6) * 2.5 : 0, visibility: openProgress > 0.6 ? 'visible' : 'hidden', display: 'flex', zIndex: 10 });
          gsap.set(lettersCanvasRef.current, { opacity: openProgress * 2 });
          // Reveal and animate the dot grid
          gsap.set(gridCanvasRef.current, { opacity: openProgress * 2, display: 'block', visibility: 'visible' });
          drawGrid(openProgress);
        } else if (progress >= 0.1 && progress <= 0.9) {
          const workProgress = (progress - 0.1) / 0.8;
            gsap.set(section, { backgroundColor: '#272860', transition: 'background-color 0.6s ease-out' });
            gsap.set(backgroundRef.current, { opacity: 1, display: 'block' });
          gsap.set(oval, { scale: 1, opacity: 0, display: 'none' });
          gsap.set(workText, { opacity: 0 });
          gsap.set(textContainer, { opacity: 1, scale: 1, visibility: 'visible' });
          gsap.set(cardsContainer, { opacity: 1, visibility: 'visible', display: 'flex', zIndex: 10 });
          gsap.set(lettersCanvasRef.current, { opacity: 1, visibility: 'visible' });
          gsap.set(gridCanvasRef.current, { opacity: 1, visibility: 'visible', display: 'block' });
          updateTargetPositions(workProgress);
          textContainer.classList.add('expanded');
          drawGrid(workProgress);
        } else {
          const closeProgress = (progress - 0.9) / 0.1;
          const ovalScale = 30 - (closeProgress * 29);
            gsap.set(section, { backgroundColor: '#272860', transition: 'background-color 0.6s ease-in-out' });
            gsap.set(backgroundRef.current, { opacity: 1, display: 'block' });
          gsap.set(oval, { scale: ovalScale, opacity: closeProgress * 2, display: 'block' });
          gsap.set(workText, { opacity: closeProgress * 2.5 });
          gsap.set(textContainer, { opacity: 1 - (closeProgress * 2.5), scale: 1 - (closeProgress * 0.5) });
          gsap.set(cardsContainer, { opacity: closeProgress < 0.4 ? 1 - (closeProgress * 2.5) : 0 });
          gsap.set(lettersCanvasRef.current, { opacity: 1 - (closeProgress * 2.5) });
          gsap.set(gridCanvasRef.current, { opacity: 1 - (closeProgress * 2.5) });
          drawGrid(1 - closeProgress);
        }
      },
      onEnter: () => {
        // Ensure dark blue background is set immediately when section pins
        gsap.set(backgroundRef.current, { opacity: 1, display: 'block' });
        gsap.set(gridCanvasRef.current, { display: 'block', visibility: 'visible', opacity: 1 });
        gsap.set(sectionRef.current, { backgroundColor: '#272860' });
        startAnimation();
      },
      onLeave: () => {
        stopAnimation();
      },
      onEnterBack: () => {
        startAnimation();
      },
      onLeaveBack: () => {
        stopAnimation();
        currentXPositionRef.current = 0;
        gsap.set(cardsContainer, { x: 0 });
      }
    });

    // Initialize
    textContainer.classList.add('expanded');
    drawGrid(0);
    animate();
    updateTargetPositions(0);

    const handleResize = () => {
      resizeGridCanvas();
      drawGrid(currentScrollTrigger?.progress || 0);
      const sectionRect = section.getBoundingClientRect();
      lettersCamera.aspect = sectionRect.width / sectionRect.height;
      lettersCamera.updateProjectionMatrix();
      lettersRenderer.setSize(sectionRect.width, sectionRect.height);
      updateTargetPositions(currentScrollTrigger?.progress || 0);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (currentScrollTrigger) {
        currentScrollTrigger.kill();
      }

      letterPositions.forEach((_, element) => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
      letterPositions.clear();

      path.forEach((line: any) => {
        line.geometry.dispose();
        line.material.dispose();
        lettersScene.remove(line);
      });
      lettersRenderer.dispose();
    };
  }, []);

  return (
    <section className="work-portal" ref={sectionRef}>
      <style>{`
        .work-portal { 
         background-color: #272860; 
          overflow: hidden; 
          position: relative; 
          width:100vw; 
          height:100dvh; /* ensure full dynamic viewport height */
          min-height:100svh; /* iOS/mobile safe */
          z-index: 10;
          opacity: 1;
          visibility: visible;
        }
color:#f8e800; 
  #grid-canvas{ z-index:0; display: block; }
        #letters-canvas{ z-index:1 }
        .text-container{ width:100%; height:100%; position:absolute; top:0; left:0; z-index:2; pointer-events:none; perspective:2500px; perspective-origin:center; opacity: 0; }
        .letter{ position:absolute; font-family: 'Bigger', sans-serif; font-size:15rem; font-weight:bold; color:#272860; z-index:3; transform-origin:center; transform-style:preserve-3d; will-change:transform }
        .cards{
          position:relative;
          width:1200vw;
          height:100%;
          padding-left:120vw;
          overflow:visible;
          display:flex;
          justify-content:space-around;
          align-items:flex-start;
          flex-wrap:wrap;
          align-content:space-around;
          z-index:10;
          opacity: 0;
          will-change: opacity, transform;
          perspective: 2000px;
          perspective-origin: center center;
        }
        .card{
          padding:8px;
          background-color:#272860;
          border: 3px solid #272860;
          display:flex;
          flex-direction:column;
          gap:4px;
          position:absolute;
          transform-style: preserve-3d;
          will-change: transform;
          transition: transform 0.3s ease-out;
          box-sizing: border-box;
        }
        .card-img{ 
          overflow:hidden;
          width: 100%;
          aspect-ratio: 16 / 9 !important;
        }
        .card-img video{ width:100%; height:100%; object-fit:cover }
        .card-copy{ 
          height:28px; 
          min-height:28px;
          max-height:28px;
          display:flex; 
          justify-content:space-between; 
          align-items:center; 
          padding:0 4px; 
          text-transform:uppercase; 
          font-family:'Akkurat Mono'; 
          font-size:12px; 
          color:#f8e800;
          flex-shrink: 0;
        }
        .card:nth-child(1){ top:5%; left:120vw }
        .card:nth-child(2){ top:50%; left:200vw }
        .card:nth-child(3){ top:5%; left:280vw }
        .card:nth-child(4){ top:50%; left:360vw }
        .card:nth-child(5){ top:5%; left:440vw }
        .card:nth-child(6){ top:50%; left:520vw }
        .card:nth-child(7){ top:5%; left:600vw }
        .oval-container{ position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); z-index:1000; }
        .oval{ width:300px; height:500px; background-color:#f8e800; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 0 0 3px rgba(39, 40, 96, 0.6); border:2px solid rgba(39, 40, 96, 0.3); border-bottom: 1px solid #f8e800; transform-origin:center center; }
        .work-text{ display:flex; flex-direction:column; align-items:center; gap:8px; }
        .work-letter{ font-size:100px; line-height:0.9; color:#272860; font-weight:900; font-family:'Bigger', sans-serif; }
      `}</style>

      <div 
        ref={backgroundRef}
        className="initial-background"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#272860',
          backgroundImage: `
              linear-gradient(to right, rgba(248, 232, 0, 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(248, 232, 0, 0.3) 1px, transparent 1px)
          `,
            backgroundSize: '30px 30px',
          zIndex: 0,
          opacity: 1
        }}
      />
      
      <canvas id="grid-canvas" ref={gridCanvasRef}></canvas>
      <canvas id="letters-canvas" ref={lettersCanvasRef}></canvas>
      
      <div className="oval-container" ref={ovalRef}>
        <div className="oval">
          <div className="work-text" ref={workTextRef}>
            <span className="work-letter">W</span>
            <span className="work-letter">O</span>
            <span className="work-letter">R</span>
            <span className="work-letter">K</span>
          </div>
        </div>
      </div>
      
      <div className="text-container" ref={textContainerRef}></div>
      <div className="cards" ref={cardsContainerRef}>
        {cards.map((card, index) => {
          return (
            <div
              className="card"
              key={index}
              ref={(el) => {
                if (el) cardElementsRef.current[index] = el;
              }}
              style={{
                width: '35vw',
                height: 'auto'
              }}
            >
              <div className="card-img">
                <video
                  src={card.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
              <div className="card-copy">
                <p>{card.title}</p>
                <p>{card.number}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WorkSectionWithPortal;