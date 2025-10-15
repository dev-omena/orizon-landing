import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WorkSectionWithPortal = () => {
  // Use videos from public folder with random sizes (maintaining 2:1 ratio)
  const cards = [
    { video: '/1.mp4', title: 'Eclipse Horizon', number: '739284', sizeMultiplier: 1.2 },
    { video: '/2.mp4', title: 'Vision Link', number: '385912', sizeMultiplier: 0.8 },
    { video: '/3.mp4', title: 'Iron Bond', number: '621478', sizeMultiplier: 1.4 },
    { video: '/4.mp4', title: 'Golden Case', number: '839251', sizeMultiplier: 0.9 },
    { video: '/5.mp4', title: 'Virtual Space', number: '456732', sizeMultiplier: 1.1 },
    { video: '/6.mp4', title: 'Smart Vision', number: '974315', sizeMultiplier: 1.3 },
    { video: '/7.mp4', title: 'Desert Tunnel', number: '682943', sizeMultiplier: 1.0 },
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
    const moveDistance = initialSectionRect.width * 8; // Increased from 5 to 8 for more spread

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
      
      const sectionWidth = actualWidth * 6;
      gridCanvas.width = sectionWidth * dpr;
      gridCanvas.height = actualHeight * dpr;
      gridCanvas.style.width = `${sectionWidth}px`;
      gridCanvas.style.height = `${actualHeight}px`;
      gridCtx.scale(dpr, dpr);
    };
    resizeGridCanvas();

    const drawGrid = (scrollProgress = 0) => {
      gridCtx.fillStyle = '#f8e800';
      gridCtx.fillRect(0, 0, gridCanvas.width, gridCanvas.height);
      gridCtx.fillStyle = '#272860';
      
      const sectionRect = section.getBoundingClientRect();
      const actualWidth = sectionRect.width;
      const actualHeight = sectionRect.height;
      
      const baseSpacing = 30;
      const scaleFactor = Math.min(actualWidth / 1920, actualHeight / 1080, 1);
      const spacing = baseSpacing * scaleFactor;
      const dotSize = Math.max(0.5, 1 * scaleFactor);
      
      const sectionWidth = actualWidth * 6;
      const [rows, cols] = [
        Math.ceil(actualHeight / spacing),
        Math.ceil(sectionWidth / spacing),
      ];
      const offset = (scrollProgress * spacing * 10) % spacing;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const xPos = x * spacing - offset;
          gridCtx.beginPath();
          gridCtx.arc(xPos, y * spacing, dotSize, 0, Math.PI * 2);
          gridCtx.fill();
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
    lettersRenderer.setClearColor(0x000000, 0);
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
        new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 1, transparent: true, opacity: 0 })
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
    
    // Calculate dynamic letter count based on screen width
    const sectionRect = section.getBoundingClientRect();
    const screenWidth = sectionRect.width;
    const baseLetterCount = Math.floor(screenWidth / 120); // Approx 1 letter per 120px
    const dynamicLetterCount = Math.max(6, Math.min(baseLetterCount, 20)); // Min 6, max 20
    
    path.forEach((line: any, i) => {
        // W has slightly fewer letters to avoid crowding
        const letterCount = i === 0 ? Math.max(6, dynamicLetterCount - 2) : dynamicLetterCount;
        line.letterElements = Array.from({ length: letterCount }, (_, idx) => {
          const el = document.createElement('div');
          el.className = 'letter';
          el.textContent = ['W', 'O', 'R', 'K'][i];
          el.style.marginRight = '1rem'; // Add gap between letters
          el.style.marginBottom = '1rem'; // Add bottom gap to prevent vertical connection
          if (idx === 0) el.style.marginLeft = '1rem'; // Add left gap for first letter
          textContainer.appendChild(el);
          letterPositions.set(el, {
            current: { x: 0, y: 0   },
            target: { x: 0, y: 0 },
          });
          return el;
        });
    });

    const lineSpeedMultipliers = [0.08, 1, 0.07, 0.09]; // W=0.08 (10x slower), O=1 (normal), R=0.07 (10x slower), K=0.09 (10x slower)
    const updateTargetPositions = (scrollProgress = 0) => {
      path.forEach((line: any, lineIndex) => {
        line.letterElements.forEach((element: any, i: number) => {
          const point = line.curve.getPoint(
              (i / (line.letterElements.length - 1) + scrollProgress * lineSpeedMultipliers[lineIndex]) % 1
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
            0.04
          );
          positions.current.y = lerp(
            positions.current.y,
            positions.target.y,
            0.04
          );
        }
        element.style.transform = `translate(-50%, -50%) translate3d(${positions.current.x}px, ${positions.current.y}px, 0px)`;
      });
    };

    let currentScrollTrigger: any = null;

    const updateCardsPosition = () => {
      const targetX = -moveDistance * (currentScrollTrigger?.progress || 0);
      currentXPositionRef.current = lerp(currentXPositionRef.current, targetX, 0.03);

      gsap.set(cardsContainer, {
        x: currentXPositionRef.current,
      });

      // Bottle distortion effect
      const cardElements = cardElementsRef.current;
      const sectionRect = sectionRef.current?.getBoundingClientRect();
      if (!sectionRect) return;
      const viewportCenter = sectionRect.width / 2;

      cardElements.forEach((card) => {
        if (!card) return;
        const cardRect = card.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const offset = cardCenterX - viewportCenter;
        const maxDist = sectionRect.width / 2;
        // -1 (far left), 0 (center), 1 (far right)
        const sideFactor = Math.max(-1, Math.min(offset / maxDist, 1));
        let rotation = 0;
        if (sideFactor > 0.05) {
          // Coming from right: rotate a bit counterclockwise
          rotation = -1.5 * sideFactor; // up to -1.5deg
        } else if (sideFactor < -0.05) {
          // Leaving left: rotate a bit clockwise
          rotation = 1.5 * Math.abs(sideFactor); // up to 1.5deg
        }
        card.style.transformOrigin = 'center center';
        card.style.transform = `rotate(${rotation}deg)`;
        card.style.filter = '';
      });
    };

    const animate = () => {
      updateLetterPositions();
      updateCardsPosition();
      lettersRenderer.render(lettersScene, lettersCamera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Main ScrollTrigger - handles both portal and work section
    currentScrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=1200%', // Increased for slower, more controlled scroll
      pin: true,
      pinSpacing: true,
      scrub: 3, // Much slower, more controlled scrubbing
      onUpdate: (self) => {
        const progress = self.progress;
        
        // Opening: 0-10% - Portal opens (faster)
        // Middle: 10-90% - Work section active (80% of scroll)
        // Closing: 90-100% - Portal closes back to oval (faster)
        
        if (progress < 0.1) {
          // OPENING - Show oval and grid fully visible, then expand
          const openProgress = progress / 0.1; // 0 to 1
          const ovalScale = 1 + (openProgress * 30);
          gsap.set(section, {
            backgroundColor: '#f8e800',
            transition: 'background-color 0.6s ease-out'
          });
          gsap.set(backgroundRef.current, {
            opacity: 1,
            display: 'block'
          });
          gsap.set(oval, {
            scale: ovalScale,
            opacity: 1,
            display: 'block'
          });
          gsap.set(workText, {
            opacity: 1
          });
          gsap.set(textContainer, {
            opacity: openProgress * 2,
            scale: 0.5 + (openProgress * 0.5)
          });
          gsap.set(cardsContainer, {
            opacity: openProgress > 0.3 ? (openProgress - 0.3) * 1.4 : 0,
            visibility: openProgress > 0.3 ? 'visible' : 'hidden',
            display: 'flex',
            zIndex: 10
          });
          gsap.set(lettersCanvasRef.current, {
            opacity: openProgress * 2
          });
          
        } else if (progress >= 0.1 && progress <= 0.9) {
          // MIDDLE - Work section fully visible, pure black background
          const workProgress = (progress - 0.1) / 0.8;
          
          gsap.set(section, {
            backgroundColor: '#f8e800',
            transition: 'background-color 0.6s ease-out'
          });
          gsap.set(backgroundRef.current, {
            opacity: 0,
            display: 'none'
          });
          gsap.set(oval, {
            scale: 1,
            opacity: 0,
            display: 'none'
          });
          gsap.set(workText, {
            opacity: 0
          });
          gsap.set(textContainer, {
            opacity: 1,
            scale: 1,
            visibility: 'visible'
          });
          gsap.set(cardsContainer, {
            opacity: 1,
            visibility: 'visible',
            display: 'flex',
            zIndex: 10
          });
          gsap.set(lettersCanvasRef.current, {
            opacity: 1,
            visibility: 'visible'
          });
          
          updateTargetPositions(workProgress);
          textContainer.classList.add('expanded');
          
        } else {
          // CLOSING - Shrink back to oval (faster closing)
          const closeProgress = (progress - 0.9) / 0.1; // 0 to 1
          const ovalScale = 30 - (closeProgress * 29); // 30 to 1
          
          gsap.set(section, {
            backgroundColor: closeProgress > 0.4 ? '#f8e800' : '#f8e800',
            transition: 'background-color 0.6s ease-in-out'
          });
          // CLOSING - Fade in oval and grid, zoom out
          gsap.set(backgroundRef.current, {
            opacity: 1,
            display: 'block'
          });
          gsap.set(oval, {
            scale: ovalScale,
            opacity: 1,
            display: 'block'
          });
          gsap.set(workText, {
            opacity: 1
          });
          gsap.set(textContainer, {
            opacity: 1 - (closeProgress * 2.5),
            scale: 1 - (closeProgress * 0.5)
          });
          gsap.set(cardsContainer, {
            opacity: closeProgress < 0.4 ? 1 - (closeProgress * 2.5) : 0
          });
          gsap.set(lettersCanvasRef.current, {
            opacity: 1 - (closeProgress * 2.5)
          });
        }
      },
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
          background-color: #f8e800; 
          overflow: hidden; 
          position: relative; 
          width:100vw; 
          height:100vh;
          z-index: 1;
          opacity: 1;
          visibility: visible;
        }
        .work-portal canvas { position: absolute; top:0; left:0; }
        #grid-canvas{ z-index:-1 }
        #letters-canvas{ z-index:1 }
        .text-container{ width:100%; height:100%; position:absolute; top:0; left:0; z-index:2; pointer-events:none; perspective:2500px; perspective-origin:center; opacity: 0; }
        .letter{ 
          position:absolute; 
          font-family: 'Bigger', sans-serif; 
          font-size: clamp(8rem, 12vw, 18rem); 
          font-weight:bold; 
          color:#272860; 
          z-index:3; 
          transform-origin:center; 
          transform-style:preserve-3d; 
          will-change:transform;
          line-height: 1.2;
        }
        .cards{
          position:relative;
          width:1200vw;
          height:100vh;
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
          gap:8px;
          position:absolute;
          transform-style: preserve-3d;
          will-change: transform;
          transition: transform 0.3s ease-out;
          aspect-ratio: 3 / 2; /* enforce 3:2 width:height (taller cards) */
          box-sizing: border-box;
        }
        .card-img{ flex:1; overflow:hidden }
        .card-img video{ width:100%; height:100%; object-fit:cover }
        .card-copy{ height:12px; display:flex; justify-content:space-between; align-items:center; padding:0 4px; text-transform:uppercase; font-family:'Akkurat Mono'; font-size:12px; color:#f8e800 }
        .card:nth-child(1){ top:5%; left:120vw }
        .card:nth-child(2){ top:50%; left:200vw }
        .card:nth-child(3){ top:5%; left:280vw }
        .card:nth-child(4){ top:50%; left:360vw }
        .card:nth-child(5){ top:5%; left:440vw }
        .card:nth-child(6){ top:50%; left:520vw }
        .card:nth-child(7){ top:5%; left:600vw }
        .oval-container{ position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); z-index:1000; }
        .oval{ 
          width:min(200px, 18vw); 
          height:calc(100vh - 240px); 
          max-height:calc(100vh - 240px);
          min-height:400px;
          background-color:#f8e800; 
          border-radius:calc(min(200px, 18vw) / 2); 
          display:flex; 
          align-items:center; 
          justify-content:center; 
          box-shadow:0 0 0 10px #272860, 0 0 0 16px #f8e800; 
          border:none; 
          transform-origin:center center; 
          background-image: radial-gradient(circle at center, #272860 2px, transparent 2px); 
          background-size: 20px 20px; 
          position: relative;
        }
        .work-text{ 
          display:flex; 
          flex-direction:column; 
          align-items:center; 
          justify-content:center;
          gap:0px; 
          height:100%;
          width:100%;
        }
        .work-letter{ 
          font-size:80px; 
          line-height:0.8; 
          color:#272860; 
          font-weight:900; 
          font-family:'Bigger', sans-serif; 
          text-align:center;
        }
      `}</style>

      {/* Initial Dark Blue Background with Square Grid */}
      <div 
        ref={backgroundRef}
        className="initial-background"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#272860',
          backgroundImage: `
            linear-gradient(to right, rgba(248, 232, 0, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(248, 232, 0, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '120px 120px',
          backgroundPosition: 'center center',
          zIndex: 0,
          opacity: 1
        }}
      />
      
      <canvas id="grid-canvas" ref={gridCanvasRef}></canvas>
      <canvas id="letters-canvas" ref={lettersCanvasRef}></canvas>
      
      {/* Portal Oval */}
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
          // Calculate size based on multiplier (width only). Height will be set by CSS aspect-ratio.
          const baseWidth = 36; // vw (increased base width to make cards bigger)
          const width = baseWidth * card.sizeMultiplier;

          return (
            <div
              className="card"
              key={index}
              ref={(el) => {
                if (el) cardElementsRef.current[index] = el;
              }}
              style={{
                width: `${width}vw`
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
