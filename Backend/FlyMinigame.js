// TODO: make the class separable into another file 
// reorganize this junky code
// make all globals/constants that can be set in the below area 

// Constants
const RATE = 60; // ms (lower = faster buzzing) - used in FlyController
const FLY_SPEED = 0.01;
const PAGE_NUM = 77;

// Global Variables
let gameActive = true; // Flag to control game state
let result = true; // true = win, false = lose
let debug_hitbox = false; // DEBUG MODE
let timeRemaining = 15000; // 15000 = 15 seconds in ms - change for debugging
let timerStarted = false;
let flyController;

// Gather all elements needed
const gameArea = document.querySelector('.game-area');
const gameText = document.getElementById('game-text');
const gameArrows = document.getElementById('game-arrows'); 
const nextButton = document.getElementById('next');
const prevButton = document.getElementById('previous');
const fly = document.getElementById('fly');
const swatter = document.getElementById('swatter');
const debugBox = document.createElement('div');
const flyDebugBox = document.createElement('div');
const resultMedia = document.createElement('video');
const flyMusic = document.getElementById('fly-music');

// initial conditions
nextButton.style.display = 'none';

document.addEventListener("DOMContentLoaded", initFlyMinigame);

// get json (router)
async function initFlyMinigame() {
    await initRouter();

    setCurrPage(77);

    console.log(getCurrentPage());
}

window.addEventListener('DOMContentLoaded', () => {

    const nextButton = document.getElementById('next');
    const prevButton = document.getElementById('previous');

    if (!nextButton || !prevButton) {
        console.log("Buttons not found");
        return;
    }

    // initial state
    nextButton.style.display = 'none';

    prevButton.addEventListener('click', () => {
        console.log("Prev clicked");

        if (gameActive) {
            goToPage(76);
        } else {
            window.location.reload();
        }
    });

    nextButton.addEventListener('click', () => {
        console.log("Next clicked");
        goToPage(80);
    });
});

// Functions
function startMusic() {
    if (!flyMusic) {
        console.log("flyMusic not found");
        return;
    }

    console.log("Trying to play music...");

    flyMusic.currentTime = 0;
    flyMusic.loop = true;

    flyMusic.play().then(() => {
        console.log("Music started");
    }).catch(err => {
        console.log("Play failed:", err);
    });
}
function stopMusic() {
    if (!flyMusic) return;

    flyMusic.pause();
    flyMusic.currentTime = 0;
}
function checkGameState() {
    if (gameActive) {
        nextButton.style.display = 'none';
        gameArea.style.cursor = 'none';
    } else {
        stopMusic();

        // Show cursor again
        gameArea.style.cursor = 'auto';  // or 'default'

        // Hide game elements
        fly.style.display = 'none';
        swatter.style.display = 'none';
        if (gameText) gameText.style.display = 'none';
        if (gameArrows) gameArrows.style.display = 'none';

        const bg = gameArea.querySelector('.game-bg');
        if (bg) bg.style.display = 'none';

        resultMedia.autoplay = true;
        resultMedia.loop = true;
        resultMedia.muted = false;
        resultMedia.playsInline = true;
        resultMedia.style.width = '100%';
        resultMedia.style.height = '100%';
        resultMedia.style.objectFit = 'contain';
        resultMedia.style.display = 'block';

        if (result) loadWin();
        else loadLose();

        gameArea.appendChild(resultMedia);
        gameArea.style.display = 'block';
    }
}
function loadWin() {
    nextButton.style.display = 'inline';
    resultMedia.src = './Images/80.mov';
    
    const resultText = document.getElementById('result-text');
    if (resultText) resultText.textContent = "SWATTED";
}
function loadLose() {
    resultMedia.src = './Images/79.mov';
    
    const resultText = document.getElementById('result-text');
    if (resultText) resultText.textContent = "Don't swat yourself dumbass!";

    prevButton.textContent = "<Retry";
}
function startTimer() {
    if (timerStarted) return;
    if (!flyController) return;

    timerStarted = true;
    const interval = setInterval(() => {
        timeRemaining -= 100;
        if (timeRemaining <= 0) {
            clearInterval(interval);
            stopMusic();
            flyController.enterSleepMode(); 
        }
    }, 100);
}
function checkHitOrMiss() {
    if (!flyController) return;

    const flyRect = flyController.getFlyHitbox();
    const swatterRect = flyController.getSwatterHeadRect();

    const hit = 
        flyRect.right > swatterRect.left &&
        flyRect.left < swatterRect.right &&
        flyRect.bottom > swatterRect.top &&
        flyRect.top < swatterRect.bottom;

    result = hit; // true if hit, false if miss
    console.log(hit ? "Hit" : "Miss");
}

// ACTIVATE MUSIC
window.addEventListener('mousedown', () => {
    if (gameActive) {
        //startMusic();
    }
}, { once: true });

// Initialize fly controller
window.addEventListener('DOMContentLoaded', () => {
    if (!gameArea || !fly) return;
    flyController = new FlyController(fly, gameArea, swatter);

    if (debug_hitbox) { // debug
        debugBox.style.position = 'fixed';
        debugBox.style.border = '2px solid green';
        debugBox.style.pointerEvents = 'none';
        debugBox.style.zIndex = '2';
        document.body.appendChild(debugBox);

        flyDebugBox.style.position = 'fixed';
        flyDebugBox.style.border = '2px solid red';
        flyDebugBox.style.pointerEvents = 'none';
        flyDebugBox.style.zIndex = '2';
        document.body.appendChild(flyDebugBox);
    }
    startTimer();
});
// Swatter movement based on cursor position
window.addEventListener('DOMContentLoaded', () => {
    if (!gameArea || !swatter) return;

    let areaRect = gameArea.getBoundingClientRect();

    const updateRect = () => {
        areaRect = gameArea.getBoundingClientRect();
    };

    // Fraction offsets of swatter's width to keep consistent scaling cursor alignment 
    const xOffsetFraction = 0/160;
    const yOffsetFraction = 240/160;
    const maxTopBoundaryFraction = 235/160; // swatter top boundary

    const updateSwatterPosition = (event) => {
        const swatterWidth = swatter.offsetWidth;
        const xOffset = xOffsetFraction * swatterWidth;
        const yOffset = yOffsetFraction * swatterWidth;
        const maxTopBoundary = maxTopBoundaryFraction * swatterWidth;

        const currentAreaRect = gameArea.getBoundingClientRect();

        const x = event.clientX - currentAreaRect.left + xOffset;
        let y = event.clientY - currentAreaRect.top + yOffset;

        y = Math.max(y, maxTopBoundary);

        swatter.style.left = `${x}px`;
        swatter.style.top = `${y}px`;
    };

    window.addEventListener('resize', updateRect);
    document.addEventListener('mousemove', updateSwatterPosition);
});

// listens for clicks
if (gameArea) {
    gameArea.addEventListener('mousedown', () => {
        if (!gameActive) return;

        checkHitOrMiss();        
        gameActive = false; 
        
        stopMusic();

        checkGameState(); 
    });
}

// make this into its own file later
class FlyController {
    constructor(flyElement, gameArea, swatterElem) {
        this.fly = flyElement;
        this.gameArea = gameArea;
        this.swatter = swatterElem;

        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.time = 0;
        this.waypointTime = 0;
        this.waypointDuration = Math.random() * 3000 + 1000; // 1-4 seconds per waypoint
        this.noisePhaseX = Math.random() * Math.PI * 2;
        this.noisePhaseY = Math.random() * Math.PI * 2;
        this.isInitialized = false;

        // animation
        this.flyFrames = [
            "./Images/fly_minigame/fly_game_fly_1.PNG",
            "./Images/fly_minigame/fly_game_fly_2.PNG"
        ];
        this.currentFrame = 0;
        this.animationInterval = RATE; 
        this.animationTimer = 0;
        
        this.initialize();
        this.generateNewWaypoint();
        this.startAnimation();

        // wall avoidance
        this.wallTime = 0;
        this.wallThreshold = 250; // ms 
        this.wallMargin = 20; // px dist from wall

        // swatter escape 
        this.isEscaping = false;
        this.escapeTime = 0;
        this.escapeDuration = 200; // ms 
        this.escapeSpeed = 5; // multiplier for zip speed
        this.escapeDirX = 0;
        this.escapeDirY = 0;

        // sleeping functionality
        this.isSleeping = false;
        this.sleepTargetX = 0;
        this.sleepTargetY = 0;
        this.sleepSettled = false;
        this.sleepImage = "./Images/fly_minigame/fly_game_fly_sleep.PNG";

        window.addEventListener('resize', () => {
            if (!this.isSleeping) return;

            const rect = this.gameArea.getBoundingClientRect();

            this.sleepTargetX = rect.width * 0.1;
            this.sleepTargetY = rect.height * 0.925;

            // Instantly snap 
            this.x = this.sleepTargetX;
            this.y = this.sleepTargetY;

            this.fly.style.left = `${this.x}px`;
            this.fly.style.top = `${this.y}px`;

            // Ensure correct image
            this.fly.src = this.sleepImage;

            // Keep it locked
            this.sleepSettled = true;
        });
    }

    initialize() { // helper
        const rect = this.gameArea.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        
        // Start fly in center area
        this.x = width * 0.5;
        this.y = height * 0.4;
        this.targetX = this.x;
        this.targetY = this.y;
        this.isInitialized = true;
    }

    generateNewWaypoint() { // helper
        const rect = this.gameArea.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const padding = Math.min(width, height) * 0.15;
        
        // Generate random waypoint (location) within game area 
        this.targetX = padding + Math.random() * (width - padding * 2);
        this.targetY = padding + Math.random() * (height - padding * 2);
        this.waypointTime = 0;
        this.waypointDuration = Math.random() * 2000 + 3000; // 3-5 seconds
        this.noisePhaseX = Math.random() * Math.PI * 2;
        this.noisePhaseY = Math.random() * Math.PI * 2;
    }

    generateEscapeWaypoint() { // helper
        const rect = this.gameArea.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        // Bias toward center
        const centerX = width * 0.5;
        const centerY = height * 0.5;

        const spread = 0.3; // randomness around center

        this.targetX = centerX + (Math.random() - 0.5) * width * spread;
        this.targetY = centerY + (Math.random() - 0.5) * height * spread;

        this.waypointTime = 0;
        this.waypointDuration = Math.random() * 1500 + 1500; // quicker escape
    }

    getNoiseOffset(phase, time) { // getter
        // Create noise using sine waves at different frequencies
        const amplitude = 8;
        const noise1 = Math.sin(phase + time * 0.003) * amplitude;
        const noise2 = Math.sin(phase * 0.7 + time * 0.002) * amplitude * 0.6;
        return noise1 + noise2;
    }

    getSwatterHeadRect() {
        const rect = this.swatter.getBoundingClientRect();

        const size = rect.width;

        // configure this for swatter hitbox
        const shrink = 0.1; 

        return {
            left: rect.left + size * shrink,
            right: rect.right - size * shrink,
            top: rect.top + size * shrink,
            bottom: rect.top + size * (1 - shrink)
        };
    }
    getFlyHitbox() {
        const rect = this.fly.getBoundingClientRect();

        const shrinkXFraction = 0.42;  // fraction of width to shrink horizontally
        const shrinkYFraction = 0.45;  // fraction of height to shrink vertically

        const offsetXFraction = 0.021;  // fraction of width to shift right
        const offsetYFraction = -0.07; // fraction of height to shift up

        const width = rect.width;
        const height = rect.height;

        const offsetX = width * offsetXFraction;
        const offsetY = height * offsetYFraction;

        return {
            left: rect.left + width * shrinkXFraction + offsetX,
            right: rect.right - width * shrinkXFraction + offsetX,
            top: rect.top + height * shrinkYFraction + offsetY,
            bottom: rect.bottom - height * shrinkYFraction + offsetY
        };
    }

    enterSleepMode() {
        const rect = this.gameArea.getBoundingClientRect();

        this.isSleeping = true;
        this.sleepSettled = false; // allow animation ONCE

        this.sleepTargetX = rect.width * 0.1;
        this.sleepTargetY = rect.height * 0.925;

        this.isEscaping = false;
    }   

    checkSwatterThreat() {
        if (this.isEscaping) return;

        const flyRect = this.getFlyHitbox();
        const head = this.getSwatterHeadRect();

        const overlap =
            flyRect.right > head.left &&
            flyRect.left < head.right &&
            flyRect.bottom > head.top &&
            flyRect.top < head.bottom;

        if (overlap) {
            const headCenterX = (head.left + head.right) / 2;
            const headCenterY = (head.top + head.bottom) / 2;

            const flyCenterX = (flyRect.left + flyRect.right) / 2;
            const flyCenterY = (flyRect.top + flyRect.bottom) / 2;

            let dx = flyCenterX - headCenterX;
            let dy = flyCenterY - headCenterY;

            const mag = Math.hypot(dx, dy) || 1;

            this.escapeDirX = dx / mag;
            this.escapeDirY = dy / mag;

            this.isEscaping = true;
            this.escapeTime = 0;

            this.generateEscapeWaypoint();
        }
    }

    update(deltaTime) { // setter
        if (!this.isInitialized) return;

        this.updateDebugBox();
        this.updateFlyDebugBox();

        // ONLY animate if NOT fully settled in sleep mode
        if (!(this.isSleeping && this.sleepSettled)) {
            this.animationTimer += deltaTime;

            if (this.animationTimer >= this.animationInterval) {
                this.animationTimer = 0;
                this.currentFrame = (this.currentFrame + 1) % this.flyFrames.length;
                this.fly.src = this.flyFrames[this.currentFrame];
            }
        }

        if (this.isSleeping) {
            if (this.sleepSettled) {
                return;
            }

            const dx = this.sleepTargetX - this.x;
            const dy = this.sleepTargetY - this.y;

            const dist = Math.hypot(dx, dy);

            const settleSpeed = 0.2; // SET THE SETTLING SPEED

            if (dist > 2) {
                const dirX = dx / dist;
                const dirY = dy / dist;

                this.x += dirX * settleSpeed * deltaTime;
                this.y += dirY * settleSpeed * deltaTime;
            } else {
                // Snap exactly once
                this.x = this.sleepTargetX;
                this.y = this.sleepTargetY;

                this.fly.src = this.sleepImage;

                this.fly.style.left = `${this.x}px`;
                this.fly.style.top = `${this.y}px`;

                this.sleepSettled = true;
            }

            this.fly.style.left = `${this.x}px`;
            this.fly.style.top = `${this.y}px`;

            return;
        }

        this.time += deltaTime;
        this.waypointTime += deltaTime;

        this.checkSwatterThreat();

        const rect = this.gameArea.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        
        // Switch waypoint if duration exceeded
        if (this.waypointTime > this.waypointDuration) {
            this.generateNewWaypoint();
        }

        // Smooth movement toward waypoint with easing
        const progress = Math.min(this.waypointTime / this.waypointDuration, 1);
        const easeProgress = this.easeInOutQuad(progress);

        // Calculate start to target movement
        let baseX, baseY;

        if (this.isEscaping) {
            this.escapeTime += deltaTime;

            // Strong directional push
            const push = this.escapeSpeed * 10;

            let nextX = this.x + this.escapeDirX * push;
            let nextY = this.y + this.escapeDirY * push;

            // If pushing into wall, flip direction
            if (nextX <= this.wallMargin || nextX >= width - this.wallMargin) {
                this.escapeDirX *= -1;
            }
            if (nextY <= this.wallMargin || nextY >= height - this.wallMargin) {
                this.escapeDirY *= -1;
            }

            baseX = this.x + this.escapeDirX * push;
            baseY = this.y + this.escapeDirY * push;

            // Add slight randomness so it’s not robotic
            baseX += (Math.random() - 0.5) * 4;
            baseY += (Math.random() - 0.5) * 4;

            if (this.escapeTime > this.escapeDuration) {
                this.isEscaping = false;
            }
        } else {
            const speed = deltaTime * FLY_SPEED;
            baseX = this.x + (this.targetX - this.x) * speed;
            baseY = this.y + (this.targetY - this.y) * speed;
        }

        
        // Add "noise" to the movement
        const noiseX = this.getNoiseOffset(this.noisePhaseX, this.time);
        const noiseY = this.getNoiseOffset(this.noisePhaseY, this.time);
        
        if (this.isEscaping) {
            this.x = baseX;
            this.y = baseY;
        } else {
            this.x = baseX + noiseX;
            this.y = baseY + noiseY;
        }
        
        const margin = width * 0.05;
        
        this.x = Math.max(margin, Math.min(this.x, width - margin));
        this.y = Math.max(margin, Math.min(this.y, height - margin));

        // detect wall
        const nearLeft = this.x <= this.wallMargin;
        const nearRight = this.x >= width - this.wallMargin;
        const nearTop = this.y <= this.wallMargin;
        const nearBottom = this.y >= height - this.wallMargin;

        const nearCorner =
            (nearLeft && nearTop) ||
            (nearLeft && nearBottom) ||
            (nearRight && nearTop) ||
            (nearRight && nearBottom);

        if (nearCorner && this.isEscaping) {
            // Force diagonal opposite direction
            this.escapeDirX *= -1;
            this.escapeDirY *= -1;

            this.generateEscapeWaypoint();
        }

        const isNearWall = nearLeft || nearRight || nearTop || nearBottom;

        if (isNearWall) {
            this.wallTime += deltaTime;
        } else {
            this.wallTime = 0;
        }

        if (this.wallTime > this.wallThreshold) {
            this.generateEscapeWaypoint();
            this.wallTime = 0;
        }
        
        // Update position
        this.fly.style.left = `${this.x}px`;
        this.fly.style.top = `${this.y}px`;
    }

    updateDebugBox() {
        if (!this.swatter || !debug_hitbox) return;

        const head = this.getSwatterHeadRect();

        debugBox.style.left = `${head.left}px`;
        debugBox.style.top = `${head.top}px`;
        debugBox.style.width = `${head.right - head.left}px`;
        debugBox.style.height = `${head.bottom - head.top}px`;
    }
    updateFlyDebugBox() {
        if (!this.fly || !debug_hitbox) return;

        const box = this.getFlyHitbox();

        flyDebugBox.style.left = `${box.left}px`;
        flyDebugBox.style.top = `${box.top}px`;
        flyDebugBox.style.width = `${box.right - box.left}px`;
        flyDebugBox.style.height = `${box.bottom - box.top}px`;
    }

    easeInOutQuad(t) { // helper
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    startAnimation() { // helper
        let lastTime = Date.now();
        
        const animate = () => {
            const currentTime = Date.now();
            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;
            
            this.update(deltaTime);
            requestAnimationFrame(animate);
        };
        
        requestAnimationFrame(animate);
    }
}