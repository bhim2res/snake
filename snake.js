const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.getElementById('gameOver');
const finalScoreDisplay = document.getElementById('finalScore');
const restartButton = document.getElementById('restart');
const controller = document.getElementById('controller');
const thumb = document.getElementById('thumb');
const bgMusic = document.getElementById('bgMusic');
const muteButton = document.getElementById('muteButton');

const gridSize = 20;
const tileSize = canvas.width / gridSize;

let snake = [{x: 10, y: 10}];
let direction = 'right';
let food = generateFood();
let score = 0;
let gameInterval;
let isMuted = false;

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

document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (key === 'ArrowRight' && direction !== 'left') {
        direction = 'right';
    } else if (key === 'ArrowLeft' && direction !== 'right') {
        direction = 'left';
    } else if (key === 'ArrowUp' && direction !== 'down') {
        direction = 'up';
    } else if (key === 'ArrowDown' && direction !== 'up') {
        direction = 'down';
    }
});

controller.addEventListener('touchstart', (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    const rect = controller.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = touch.clientX - centerX;
    const dy = touch.clientY - centerY;
    thumb.style.left = `${dx}px`;
    thumb.style.top = `${dy}px`;
}, { passive: false });

controller.addEventListener('touchmove', (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    const rect = controller.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = touch.clientX - centerX;
    const dy = touch.clientY - centerY;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    let newDirection;
    if (angle >= 315 || angle < 45) {
        newDirection = 'right';
    } else if (angle >= 45 && angle < 135) {
        newDirection = 'up';
    } else if (angle >= 135 && angle < 225) {
        newDirection = 'left';
    } else {
        newDirection = 'down';
    }
    if (
        (newDirection === 'right' && direction !== 'left') ||
        (newDirection === 'left' && direction !== 'right') ||
        (newDirection === 'up' && direction !== 'down') ||
        (newDirection === 'down' && direction !== 'up')
    ) {
        direction = newDirection;
    }
    thumb.style.left = `${dx}px`;
    thumb.style.top = `${dy}px`;
}, { passive: false });

controller.addEventListener('touchend', () => {
    thumb.style.left = '0';
    thumb.style.top = '0';
});

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
    ctx.fillText('🍎', food.x * tileSize + tileSize / 2, food.y * tileSize + tileSize / 2);
}

function gameOver() {
    clearInterval(gameInterval);
    finalScoreDisplay.textContent = `Score: ${score}`;
    gameOverDisplay.style.display = 'block';
    bgMusic.pause();
}

function init() {
    snake = [{x: 10, y: 10}];
    direction = 'right';
    food = generateFood();
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    gameOverDisplay.style.display = 'none';
    bgMusic.play().catch(() => {
        document.addEventListener('click', () => bgMusic.play(), { once: true });
    });
    gameInterval = setInterval(gameLoop, 100);
}

restartButton.addEventListener('click', () => {
    init();
});

muteButton.addEventListener('click', () => {
    isMuted = !isMuted;
    bgMusic.muted = isMuted;
    muteButton.textContent = isMuted ? '🔇' : '🔊';
});

init();
