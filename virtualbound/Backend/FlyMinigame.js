// "./Images/fly_minigame/fly_game_fly_sleep.PNG"

// Constants
const rate = 10; // ms (lower = faster buzzing) - used in FlyController

// Global Variables
let gameActive = true; // Flag to control game state
let result = true; // true = win, false = lose

// Gather all elements needed
const gameArea = document.querySelector('.game-area');
const nextButton = document.getElementById('next');
const prevButton = document.getElementById('prev');
const fly = document.getElementById('fly');
const swatter = document.getElementById('swatter');

// Game Loop
checkGameState();


// Functions
function checkGameState() {
    if (gameActive) {
        nextButton.style.display = 'none';
    } else {
        nextButton.style.display = 'inline';
    }
}

// Initialize fly controller
let flyController;
window.addEventListener('DOMContentLoaded', () => {
    if (!gameArea || !fly) return;
    flyController = new FlyController(fly, gameArea, swatter);
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

// make this into its own file later
export class FlyController {
    constructor(flyElement, gameArea, swatterElem) {
        this.fly = flyElement;
        this.gameArea = gameArea;
        this.swatter = swatterElem;

        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.vx = 0;
        this.vy = 0;
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
        this.animationInterval = rate; 
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
        this.escapeDuration = 180; // ms (tune this for "annoying but fair")
        this.escapeSpeed = 2.8; // multiplier for zip speed
        this.escapeDirX = 0;
        this.escapeDirY = 0;
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

    // ADDED -------------------------------------

    getSwatterHeadRect() {
        const rect = this.swatter.getBoundingClientRect();

        const size = rect.width;

        // shrink hitbox to actual "mesh" of swatter
        const shrink = 0.5; // tune this (0.3–0.5 is good)

        return {
            left: rect.left + size * shrink,
            right: rect.right - size * shrink,
            top: rect.top + size * shrink,
            bottom: rect.top + size * (1 - shrink)
        };
    }

    checkSwatterThreat() {
        if (this.isEscaping) return;

        const flyRect = this.fly.getBoundingClientRect();
        const head = this.getSwatterHeadRect();

        const overlap =
            flyRect.right > head.left &&
            flyRect.left < head.right &&
            flyRect.bottom > head.top &&
            flyRect.top < head.bottom;

        if (overlap) {
            const headCenterX = (head.left + head.right) / 2;
            const headCenterY = (head.top + head.bottom) / 2;

            const flyCenterX = flyRect.left + flyRect.width / 2;
            const flyCenterY = flyRect.top + flyRect.height / 2;

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

    //  -------------------------------------

    update(deltaTime) { // setter
        if (!this.isInitialized) return;

        this.animationTimer += deltaTime;

        if (this.animationTimer >= this.animationInterval) {
            this.animationTimer = 0;
            
            this.currentFrame = (this.currentFrame + 1) % this.flyFrames.length;
            this.fly.src = this.flyFrames[this.currentFrame];
        }

        this.time += deltaTime;
        this.waypointTime += deltaTime;

        // ADDED ------------------------------------- REORGANIZE

        this.checkSwatterThreat();

        const rect = this.gameArea.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        //  -------------------------------------


        
        // Switch waypoint if duration exceeded
        if (this.waypointTime > this.waypointDuration) {
            this.generateNewWaypoint();
        }

        // Smooth movement toward waypoint with easing
        const progress = Math.min(this.waypointTime / this.waypointDuration, 1);
        const easeProgress = this.easeInOutQuad(progress);
        


        // ADDED ------------------------------------- EDITED

        // Calculate start to target movement
        let baseX, baseY;

        if (this.isEscaping) {
            this.escapeTime += deltaTime;

            // Strong directional push
            const push = this.escapeSpeed * 10;

            let nextX = this.x + this.escapeDirX * push;
            let nextY = this.y + this.escapeDirY * push;

            // If pushing into wall → flip direction
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
            baseX = this.x + (this.targetX - this.x) * 0.01;
            baseY = this.y + (this.targetY - this.y) * 0.01;
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
        //  -------------------------------------
        
        const margin = width * 0.05;
        
        this.x = Math.max(margin, Math.min(this.x, width - margin));
        this.y = Math.max(margin, Math.min(this.y, height - margin));

        // detect wall
        const nearLeft = this.x <= this.wallMargin;
        const nearRight = this.x >= width - this.wallMargin;
        const nearTop = this.y <= this.wallMargin;
        const nearBottom = this.y >= height - this.wallMargin;

        // ADDED -------------------------------------
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
        //  -------------------------------------

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