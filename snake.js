// Get HTML elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.getElementById('gameOver');
const restartButton = document.getElementById('restart');
const finalScoreDisplay = document.getElementById('finalScore');

// Game constants
const gridSize = 20; // 20x20 grid
const tileSize = canvas.width / gridSize; // 20px per tile

// Game variables
let snake = [{x: 10, y: 10}]; // Snake starts in the middle
let direction = 'right'; // Initial direction
let food = generateFood(); // Initial food position
let score = 0; // Starting score
let gameInterval; // To control the game loop

// Generate random food position not on the snake
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

// Handle arrow key presses
function handleKeyPress(event) {
    const key = event.key;
    // Prevent arrow keys from scrolling the page
    if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(key)) {
        event.preventDefault();
    }
    // Change direction, but prevent reversing into itself
    if (key === 'ArrowRight' && direction !== 'left') {
        direction = 'right';
    } else if (key === 'ArrowLeft' && direction !== 'right') {
        direction = 'left';
    } else if (key === 'ArrowUp' && direction !== 'down') {
        direction = 'up';
    } else if (key === 'ArrowDown' && direction !== 'up') {
        direction = 'down';
    }
}

// Main game loop
function gameLoop() {
    // Calculate new head position
    let head = { ...snake[0] };
    if (direction === 'right') head.x += 1;
    else if (direction === 'left') head.x -= 1;
    else if (direction === 'up') head.y -= 1;
    else if (direction === 'down') head.y += 1;

    // Check if snake hits the wall
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
        gameOver();
        return;
    }

    // Check if snake hits itself
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    // Check if snake eats food
    if (head.x === food.x && head.y === food.y) {
        snake.unshift(head); // Grow by adding new head
        food = generateFood(); // New food
        score += 1; // Increase score
        scoreDisplay.textContent = `Score: ${score}`;
    } else {
        snake.unshift(head); // Add new head
        snake.pop(); // Remove tail (normal movement)
    }

    // Draw the updated game state
    drawGame();
}

// Draw snake and food on the canvas
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    // Draw snake (green squares)
    snake.forEach(segment => {
        ctx.fillStyle = 'green';
        ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
    });
    // Draw food (red square)
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);
}

// Handle game over
function gameOver() {
    clearInterval(gameInterval); // Stop the game loop
    finalScoreDisplay.textContent = `Score: ${score}`;
    gameOverDisplay.style.display = 'block'; // Show game over message
}

// Initialize or reset the game
function init() {
    snake = [{x: 10, y: 10}];
    direction = 'right';
    food = generateFood();
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    gameOverDisplay.style.display = 'none';
}

// Restart the game
function restartGame() {
    init();
    gameInterval = setInterval(gameLoop, 100); // Restart game loop
}

// Set up event listeners
document.addEventListener('keydown', handleKeyPress);
restartButton.addEventListener('click', restartGame);

// Start the game
init();
gameInterval = setInterval(gameLoop, 100); // Run every 100ms
