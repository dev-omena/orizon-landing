document.addEventListener("DOMContentLoaded", () => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    
    // Use requestAnimationFrame instead of gsap.ticker for Lenis
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  
    const workSection = document.querySelector(".work");
    const cardsContainer = document.querySelector(".cards");
    const cards = document.querySelectorAll(".card");
    const moveDistance = (cards.length * window.innerWidth * 1.4);
    let currentXPosition = 0;

  const lerp = (start, end, t) => start + (end - start) * t;
  const gridCanvas = document.createElement("canvas");
  gridCanvas.id = "grid-canvas";
  workSection.appendChild(gridCanvas);
  const gridCtx = gridCanvas.getContext("2d");
  
  const resizeGridCanvas = () => {
    const dpr = window.devicePixelRatio || 1;
    [gridCanvas.width, gridCanvas.height] = [window.innerWidth * dpr, window.innerHeight * dpr];
    [gridCanvas.style.width, gridCanvas.style.height] = [`${window.innerWidth}px`, `${window.innerHeight}px`];
    gridCtx.scale(dpr, dpr);
  };
  resizeGridCanvas();

  const drawGrid = (scrollProgress = 0) => {
    gridCtx.fillStyle="#000000";
    gridCtx.fillRect(0, 0, gridCanvas.width, gridCanvas.height);
    gridCtx.fillStyle="#333333";
    const [dotSize, spacing] = [1, 30];
    const [rows, cols] = [Math.floor(gridCanvas.height / spacing), Math.floor(gridCanvas.width / spacing)+15,];
    const offsetX = (scrollProgress * spacing *10) % spacing;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            gridCtx.beginPath();
            gridCtx.arc(x * spacing - offsetX, y * spacing, dotSize, 0, Math.PI * 2);
            gridCtx.fill();
        }
    }
  };

 const textContainer = document.querySelector(".text-container");
 const letterPositions = new Map();
 const letters = ["W","O","R","K"];
 const letterElements = [];

 // Create letter grid
 const lettersPerRow = 20;
 const rowHeight = window.innerHeight / 4;

 letters.forEach((letter, rowIndex) => {
    for (let i = 0; i < lettersPerRow; i++) {
        const el = document.createElement("div");
        el.className = "letter";
        el.textContent = letter;
        textContainer.appendChild(el);

        const baseY = rowHeight * rowIndex + rowHeight / 2;
        const baseX = (window.innerWidth / (lettersPerRow - 1)) * i;

        letterPositions.set(el, {
            current: { x: baseX, y: baseY },
            target: { x: baseX, y: baseY },
            baseX: baseX,
            baseY: baseY,
            row: rowIndex,
            index: i
        });
        letterElements.push(el);
    }
 });

 const lineSpeedMultipliers = [1, 0.9, 1.1, 0.95];
 const updateTargetPositions = (scrollProgress = 0) => {
    letterPositions.forEach((positions, element) => {
        const speed = lineSpeedMultipliers[positions.row];
        const offset = scrollProgress * speed * window.innerWidth * 3;

        let newX = positions.baseX - offset;

        // Wrap around when letters go off screen
        const letterWidth = window.innerWidth / (lettersPerRow - 1);
        const totalWidth = letterWidth * lettersPerRow;

        while (newX < -letterWidth) {
            newX += totalWidth;
        }
        while (newX > window.innerWidth + letterWidth) {
            newX -= totalWidth;
        }

        positions.target.x = newX;
        positions.target.y = positions.baseY;
    });
 };


 const updateLetterPositions = () => {
    letterPositions.forEach((positions, element) => {
        const distx = positions.target.x - positions.current.x;
        if (Math.abs(distx) > window.innerWidth *0.7) {
            [positions.current.x, positions.target.y] = [
                positions.target.x, 
                positions.current.y
            ];
    }else{
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
    element.style.transform = `translate(-50%, -50%) translate3d(${positions.current.x}px,
     ${positions.current.y}px , 0px)`;
});
 };

 const updateCardsPositions = () => {
    const targetX = -moveDistance * (ScrollTrigger.getAll()[0]?.progress || 0 );
    currentXPosition = lerp(currentXPosition, targetX, 0.07);
    gsap.set(cardsContainer, {x: currentXPosition});

 }

 const animate = () => {
    updateLetterPositions();
    updateCardsPositions();
    requestAnimationFrame(animate);
 }

ScrollTrigger.create({
    trigger: ".work",
    start: "top top",
    end: "+=700%",
    pin: true,
    pinSpacing: true,
    scrub: 1,
    onUpdate: (self) => {
        updateTargetPositions(self.progress);
        drawGrid(self.progress);
    }
});

drawGrid(0)
animate();
updateTargetPositions(0);

window.addEventListener("resize" , () => {
    resizeGridCanvas();
    drawGrid(ScrollTrigger.getAll()[0]?.progress || 0);

    // Recalculate letter base positions
    const lettersPerRow = 20;
    const rowHeight = window.innerHeight / 4;
    letterPositions.forEach((positions) => {
        positions.baseY = rowHeight * positions.row + rowHeight / 2;
        positions.baseX = (window.innerWidth / (lettersPerRow - 1)) * positions.index;
    });

    updateTargetPositions(ScrollTrigger.getAll()[0]?.progress || 0);
});
});
