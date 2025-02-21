// Get HTML elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.getElementById('gameOver');
const restartButton = document.getElementById('restart');
const finalScoreDisplay = document.getElementById('finalScore');
const upButton = document.getElementById('up');
const downButton = document.getElementById('down');
const leftButton = document.getElementById('left');
const rightButton = document.getElementById('right');

// Set canvas size dynamically
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// Game constants
const gridSize = 20; // 20x20 grid
const tileSize = canvas.width / gridSize; // Dynamic tile size

// Game variables
let snake = [{x: 10, y: 10}];
let direction = 'right';
let food = generateFood();
let score = 0;
let gameInterval;

// Touch variables
let touchStartX = 0;
let touchStartY = 0;

// Generate random food position
function generateFood() {
    let food;
    do {
        food = {
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize)
        };
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
    return food;
}

// Unified direction change
function changeDirection(newDirection) {
    if (newDirection === 'right' && direction !== 'left') {
        direction = 'right';
    } else if (newDirection === 'left' && direction !== 'right') {
        direction = 'left';
    } else if (newDirection === 'up' && direction !== 'down') {
        direction = 'up';
    } else if (newDirection === 'down' && direction !== 'up') {
        direction = 'down';
    }
}

// Handle keyboard input
function handleKeyPress(event) {
    const key = event.key;
    if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(key)) {
        event.preventDefault();
    }
    if (key === 'ArrowRight') changeDirection('right');
    else if (key === 'ArrowLeft') changeDirection('left');
    else if (key === 'ArrowUp') changeDirection('up');
    else if (key === 'ArrowDown') changeDirection('down');
}

// Handle touch start
function handleTouchStart(event) {
    event.preventDefault();
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}

// Handle touch end
function handleTouchEnd(event) {
    event.preventDefault();
    const touch = event.changedTouches[0];
    const touchEndX = touch.clientX;
    const touchEndY = touch.clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 20) changeDirection('right');
        else if (deltaX < -20) changeDirection('left');
    } else {
        if (deltaY > 20) changeDirection('down');
        else if (deltaY < -20) changeDirection('up');
    }
}

// Main game loop
function gameLoop() {
    let head = { ...snake[0] };
    if (direction === 'right') head.x += 1;
    else if (direction === 'left') head.x -= 1;
    else if (direction === 'up') head.y -= 1;
    else if (direction === 'down') head.y += 1;

    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
        gameOver();
        return;
    }

    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    if (head.x === food.x && head.y === food.y) {
        snake.unshift(head);
        food = generateFood();
        score += 1;
        scoreDisplay.textContent = `Score: ${score}`;
    } else {
        snake.unshift(head);
        snake.pop();
    }

    drawGame();
}

// Draw game with emojis
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake.forEach((segment, index) => {
        ctx.font = `${tileSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const x = segment.x * tileSize + tileSize / 2;
        const y = segment.y * tileSize + tileSize / 2;
        ctx.fillText(index === 0 ? '🐍' : '🟢', x, y);
    });
    ctx.font = `${tileSize}px Arial`;
    ctx.fillText('🍎', food.x * tileSize + tileSize / 2, food.y * tileSize + tileSize / 2);
}

// Handle game over
function gameOver() {
    clearInterval(gameInterval);
    finalScoreDisplay.textContent = `Score: ${score}`;
    gameOverDisplay.style.display = 'block';
}

// Initialize or reset game
function init() {
    snake = [{x: 10, y: 10}];
    direction = 'right';
    food = generateFood();
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    gameOverDisplay.style.display = 'none';
}

// Restart game
function restartGame() {
    init();
    gameInterval = setInterval(gameLoop, 100); // 100ms for consistent speed
}

// Set up event listeners
document.addEventListener('keydown', handleKeyPress);
canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
canvas.addEventListener('touchmove', () => {}, { passive: false });
canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
upButton.addEventListener('click', () => changeDirection('up'));
downButton.addEventListener('click', () => changeDirection('down'));
leftButton.addEventListener('click', () => changeDirection('left'));
rightButton.addEventListener('click', () => changeDirection('right'));
restartButton.addEventListener('click', restartGame);

// Start the game
init();
gameInterval = setInterval(gameLoop, 100);
