import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WorkSection = () => {
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

  const workSectionRef = useRef(null);
  const textContainerRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const gridCanvasRef = useRef(null);
  const lettersCanvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const letterPositionsRef = useRef(new Map());
  const currentXPositionRef = useRef(0);

  useEffect(() => {
    const workSection = workSectionRef.current;
    const cardsContainer = cardsContainerRef.current;
    const textContainer = textContainerRef.current;

    const initialSectionRect = workSection.getBoundingClientRect();
    const moveDistance = initialSectionRect.width * 5;

    const lerp = (start, end, t) => start + (end - start) * t;

    // Grid Canvas Setup
    const gridCanvas = gridCanvasRef.current;
    const gridCtx = gridCanvas.getContext('2d');

    const resizeGridCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      // Get actual rendered dimensions of the work section
      const workSection = workSectionRef.current;
      const sectionRect = workSection.getBoundingClientRect();
      const actualWidth = sectionRect.width;
      const actualHeight = sectionRect.height;
      
      // Make canvas cover the entire work section width plus extra for scrolling
      const sectionWidth = actualWidth * 6; // 600vw equivalent
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
      
      // Get actual rendered dimensions
      const workSection = workSectionRef.current;
      const sectionRect = workSection.getBoundingClientRect();
      const actualWidth = sectionRect.width;
      const actualHeight = sectionRect.height;
      
      // Scale dot size and spacing based on actual dimensions
      const baseSpacing = 30;
      const scaleFactor = Math.min(actualWidth / 1920, actualHeight / 1080, 1); // Scale based on a reference resolution
      const spacing = baseSpacing * scaleFactor;
      const dotSize = Math.max(0.5, 1 * scaleFactor);
      
      const sectionWidth = actualWidth * 6; // 600vw equivalent
      const [rows, cols] = [
        Math.ceil(actualHeight / spacing),
        Math.ceil(sectionWidth / spacing),
      ];
      const offset = (scrollProgress * spacing * 10) % spacing;

      // Draw dots across the entire canvas width
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
    const lettersScene = new THREE.Scene();
    const cameraSectionRect = workSection.getBoundingClientRect();
    const lettersCamera = new THREE.PerspectiveCamera(
      50,
      cameraSectionRect.width / cameraSectionRect.height,
      0.1,
      1000
    );
    lettersCamera.position.z = 20;

    const lettersRenderer = new THREE.WebGLRenderer({
      canvas: lettersCanvasRef.current,
      antialias: true,
      alpha: true,
    });
    const rendererSectionRect = workSection.getBoundingClientRect();
    lettersRenderer.setSize(rendererSectionRect.width, rendererSectionRect.height);
    lettersRenderer.setClearColor(0x000000, 0);
    lettersRenderer.setPixelRatio(window.devicePixelRatio);

    const createTextAnimationPath = (yPos, amplitude, startY) => {
      const points = [];
      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        // Start all letters at center (x=0), then spread horizontally
        const xProgress = Math.max(0, (t - 0.1) / 0.9); // Start spreading after 10% progress
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
      );
      line.curve = curve;
      return line;
    };

    const path = [
      createTextAnimationPath(10, 2, 12),    // W
      createTextAnimationPath(3.5, 1, 4),    // O
      createTextAnimationPath(-3.5, -1, -4), // R
      createTextAnimationPath(-10, -2, -12), // K
    ];
    path.forEach((line) => lettersScene.add(line));

    const letterPositions = letterPositionsRef.current;
    path.forEach((line, i) => {
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
      path.forEach((line, lineIndex) => {
        line.letterElements.forEach((element, i) => {
          const point = line.curve.getPoint(
            (i / 7 + scrollProgress * lineSpeedMultipliers[lineIndex]) % 1
          );
          const vector = point.clone().project(lettersCamera);
          const positions = letterPositions.get(element);
          const sectionRect = workSection.getBoundingClientRect();
          positions.target = {
            x: (-vector.x * 0.5 + 0.5) * sectionRect.width,
            y: (-vector.y * 0.5 + 0.5) * sectionRect.height,
          };
        });
      });
    };

    const updateLetterPositions = () => {
      letterPositions.forEach((positions, element) => {
        const sectionRect = workSection.getBoundingClientRect();
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

    const scrollTrigger = ScrollTrigger.create({
      trigger: workSection,
      start: 'top top',
      end: '+=700%',
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        // Expand text container when scroll progress > 0.05
        if (self.progress > 0.05) {
          textContainer.classList.add('expanded');
        } else {
          textContainer.classList.remove('expanded');
        }
        updateTargetPositions(self.progress);
      },
    });

    drawGrid(0);
    animate();
    updateTargetPositions(0);

    const handleResize = () => {
      resizeGridCanvas();
      drawGrid(ScrollTrigger.getAll()[0]?.progress || 0);
      const sectionRect = workSection.getBoundingClientRect();
      lettersCamera.aspect = sectionRect.width / sectionRect.height;
      lettersCamera.updateProjectionMatrix();
      lettersRenderer.setSize(sectionRect.width, sectionRect.height);
      updateTargetPositions(ScrollTrigger.getAll()[0]?.progress || 0);
    };

    window.addEventListener('resize', handleResize);
    // Also listen for zoom changes
    window.addEventListener('orientationchange', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      scrollTrigger.kill();

      // Clean up letter elements
      letterPositions.forEach((_, element) => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
      letterPositions.clear();

      // Clean up Three.js
      path.forEach((line) => {
        line.geometry.dispose();
        line.material.dispose();
        lettersScene.remove(line);
      });
      lettersRenderer.dispose();
    };
  }, []);

  return (
    <section className="work" ref={workSectionRef}>
      {/* Scoped styles so this component is standalone */}
      <style>{`
        .work { background-color: #000; overflow: hidden; position: relative; width:100vw; height:100vh; }
        .work canvas { position: absolute; top:0; left:0; }
        #grid-canvas{ z-index:-1 }
        #letters-canvas{ z-index:1 }
        .text-container{ width:100%; height:100%; position:absolute; top:0; left:0; z-index:2; pointer-events:none; perspective:2500px; perspective-origin:center }
        .letter{ position:absolute; font-family: 'Bigger', sans-serif; font-size:9.36rem; font-weight:bold; color:#f8e800; z-index:3; transform-origin:center; transform-style:preserve-3d; will-change:transform }
        .cards{ position:relative; width:500vw; height:100vh; padding-left:100vw; overflow:hidden; display:flex; justify-content:space-around; align-items:flex-start; flex-wrap:wrap; align-content:space-around; z-index:10 }
        .card{ width:28vw; height:40vh; padding:8px; background-color:#f8e800; display:flex; flex-direction:column; gap:8px; position:absolute }
        .card-img{ flex:1; overflow:hidden }
        .card-img video{ width:100%; height:100%; object-fit:cover }
        .card-copy{ height:12px; display:flex; justify-content:space-between; align-items:center; padding:0 4px; text-transform:uppercase; font-family:'Akkurat Mono'; font-size:12px; color:#272860 }
        /* Positioning for 7 cards */
        .card:nth-child(1){ top:5%; left:105vw }
        .card:nth-child(2){ top:50%; left:145vw }
        .card:nth-child(3){ top:5%; left:185vw }
        .card:nth-child(4){ top:50%; left:225vw }
        .card:nth-child(5){ top:5%; left:265vw }
        .card:nth-child(6){ top:50%; left:305vw }
        .card:nth-child(7){ top:5%; left:345vw }
      `}</style>

      <canvas id="grid-canvas" ref={gridCanvasRef}></canvas>
      <canvas id="letters-canvas" ref={lettersCanvasRef}></canvas>
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

export default WorkSection;
