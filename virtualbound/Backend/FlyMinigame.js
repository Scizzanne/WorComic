// "./Images/fly_minigame/fly_game_fly_1.PNG"
// "./Images/fly_minigame/fly_game_fly_2.PNG"
// "./Images/fly_minigame/fly_game_fly_sleep.PNG"

let gameActive = true; // Flag to control game state
let result = true; // true = win, false = lose

// Gather all elements needed
const gameArea = document.querySelector('.game-area');
const nextButton = document.getElementById('next');
const prevButton = document.getElementById('prev');
const gameText = document.getElementById('game-text');
const resultText = document.getElementById('result-text');
const fly = document.getElementById('fly');
const swatter = document.getElementById('swatter');

function checkGameState() {
    if (gameActive) {
        nextButton.style.display = 'none';  
    } else {
        nextButton.style.display = 'inline';
    }
}

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

    const updateSwatterPosition = (event) => {
        const swatterWidth = swatter.offsetWidth;
        const xOffset = xOffsetFraction * swatterWidth;
        const yOffset = yOffsetFraction * swatterWidth;

        const currentAreaRect = gameArea.getBoundingClientRect();

        const x = event.clientX - currentAreaRect.left + xOffset;
        const y = event.clientY - currentAreaRect.top + yOffset;

        swatter.style.left = `${x}px`;
        swatter.style.top = `${y}px`;
    };

    window.addEventListener('resize', updateRect);
    document.addEventListener('mousemove', updateSwatterPosition);
});