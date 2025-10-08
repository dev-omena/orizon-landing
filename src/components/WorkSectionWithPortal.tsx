import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WorkSectionWithPortal = () => {
  // Use videos from public folder
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
      gridCtx.fillStyle = '#000';
      gridCtx.fillRect(0, 0, gridCanvas.width, gridCanvas.height);
      gridCtx.fillStyle = '#f8e800';
      
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
        new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 1 })
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

    const updateCardsPosition = () => {
      const targetX = -moveDistance * (ScrollTrigger.getAll()[0]?.progress || 0);
      currentXPositionRef.current = lerp(currentXPositionRef.current, targetX, 0.07);
      gsap.set(cardsContainer, {
        x: currentXPositionRef.current,
      });
    };

    const animate = () => {
      updateLetterPositions();
      updateCardsPosition();
      lettersRenderer.render(lettersScene, lettersCamera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Main ScrollTrigger - handles both portal and work section
    const scrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=800%', // Increased for more scroll time in work section
      pin: true,
      pinSpacing: true,
      scrub: 1.5, // Smoother scrubbing
      onUpdate: (self) => {
        const progress = self.progress;
        
        // Opening: 0-10% - Portal opens (faster)
        // Middle: 10-90% - Work section active (80% of scroll)
        // Closing: 90-100% - Portal closes back to oval (faster)
        
        if (progress < 0.1) {
          // OPENING - Show oval, then expand (faster opening)
          const openProgress = progress / 0.1; // 0 to 1
          const ovalScale = 1 + (openProgress * 30);
          
          gsap.set(section, {
            backgroundColor: '#272860',
            transition: 'background-color 0.6s ease-out'
          });
          gsap.set(backgroundRef.current, {
            opacity: 1 - (openProgress * 2.5) // Fade out faster
          });
          gsap.set(oval, {
            scale: ovalScale,
            opacity: 1 - (openProgress * 2.5) // Fade out faster
          });
          gsap.set(workText, {
            opacity: 1 - (openProgress * 3) // Fade out faster
          });
          gsap.set(textContainer, {
            opacity: openProgress * 2,
            scale: 0.5 + (openProgress * 0.5)
          });
          gsap.set(cardsContainer, {
            opacity: openProgress > 0.6 ? (openProgress - 0.6) * 2.5 : 0 // Start later, fade faster
          });
          gsap.set(lettersCanvasRef.current, {
            opacity: openProgress * 2
          });
          
        } else if (progress >= 0.1 && progress <= 0.9) {
          // MIDDLE - Work section fully visible, pure black background
          const workProgress = (progress - 0.1) / 0.8;
          
          gsap.set(section, {
            backgroundColor: '#000',
            transition: 'background-color 0.6s ease-out'
          });
          gsap.set(backgroundRef.current, {
            opacity: 0,
            display: 'none' // Completely hide to prevent any transparency
          });
          gsap.set(oval, {
            scale: 1,
            opacity: 0,
            display: 'none' // Completely hide
          });
          gsap.set(workText, {
            opacity: 0
          });
          gsap.set(textContainer, {
            opacity: 1,
            scale: 1
          });
          gsap.set(cardsContainer, {
            opacity: 1
          });
          gsap.set(lettersCanvasRef.current, {
            opacity: 1
          });
          
          updateTargetPositions(workProgress);
          textContainer.classList.add('expanded');
          
        } else {
          // CLOSING - Shrink back to oval (faster closing)
          const closeProgress = (progress - 0.9) / 0.1; // 0 to 1
          const ovalScale = 30 - (closeProgress * 29); // 30 to 1
          
          gsap.set(section, {
            backgroundColor: closeProgress > 0.4 ? '#272860' : '#000',
            transition: 'background-color 0.6s ease-in-out'
          });
          gsap.set(backgroundRef.current, {
            opacity: closeProgress * 2,
            display: 'block' // Show again
          });
          gsap.set(oval, {
            scale: ovalScale,
            opacity: closeProgress * 2,
            display: 'block' // Show again
          });
          gsap.set(workText, {
            opacity: closeProgress * 2.5
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
      drawGrid(ScrollTrigger.getAll()[0]?.progress || 0);
      const sectionRect = section.getBoundingClientRect();
      lettersCamera.aspect = sectionRect.width / sectionRect.height;
      lettersCamera.updateProjectionMatrix();
      lettersRenderer.setSize(sectionRect.width, sectionRect.height);
      updateTargetPositions(ScrollTrigger.getAll()[0]?.progress || 0);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      scrollTrigger.kill();

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
          background-color: #000; 
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
        .letter{ position:absolute; font-family: 'Bigger', sans-serif; font-size:15rem; font-weight:bold; color:#f8e800; z-index:3; transform-origin:center; transform-style:preserve-3d; will-change:transform }
        .cards{ position:relative; width:800vw; height:100vh; padding-left:100vw; overflow:hidden; display:flex; justify-content:space-around; align-items:flex-start; flex-wrap:wrap; align-content:space-around; z-index:10; opacity: 0; }
        .card{ width:28vw; height:40vh; padding:8px; background-color:#f8e800; display:flex; flex-direction:column; gap:8px; position:absolute }
        .card-img{ flex:1; overflow:hidden }
        .card-img video{ width:100%; height:100%; object-fit:cover }
        .card-copy{ height:12px; display:flex; justify-content:space-between; align-items:center; padding:0 4px; text-transform:uppercase; font-family:'Akkurat Mono'; font-size:12px; color:#272860 }
        .card:nth-child(1){ top:5%; left:120vw }
        .card:nth-child(2){ top:50%; left:200vw }
        .card:nth-child(3){ top:5%; left:280vw }
        .card:nth-child(4){ top:50%; left:360vw }
        .card:nth-child(5){ top:5%; left:440vw }
        .card:nth-child(6){ top:50%; left:520vw }
        .card:nth-child(7){ top:5%; left:600vw }
        .oval-container{ position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); z-index:1000; }
        .oval{ width:300px; height:500px; background-color:#000; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 0 0 3px rgba(248, 232, 0, 0.6); border:2px solid rgba(248, 232, 0, 0.3); transform-origin:center center; }
        .work-text{ display:flex; flex-direction:column; align-items:center; gap:8px; }
        .work-letter{ font-size:100px; line-height:0.9; color:#f8e800; font-weight:900; font-family:'Bigger', sans-serif; }
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
        {cards.map((card, index) => (
          <div className="card" key={index}>
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
        ))}
      </div>
    </section>
  );
};

export default WorkSectionWithPortal;
