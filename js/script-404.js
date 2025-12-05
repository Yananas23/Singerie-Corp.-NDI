const GRID_SIZE = 15;
const CELL_SIZE = 16;
const INITIAL_SNAKE = [{ x: 7, y: 7 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const GAME_SPEED = 150;

let snake = [...INITIAL_SNAKE];
let direction = { ...INITIAL_DIRECTION };
let food = { x: 10, y: 10 };
let score = 0;
let gameOver = false;
let gameStarted = false;

const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');

const startOverlay = document.getElementById('startOverlay');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const scoreDisplay = document.getElementById('score');

function generateFood() {
    let newFood;
    do {
    newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
    };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
}

function resetGame() {
    snake = [...INITIAL_SNAKE];
    direction = { ...INITIAL_DIRECTION };
    food = { x: 10, y: 10 };
    score = 0;
    gameOver = false;
    gameStarted = false;
    startOverlay.style.display = 'flex';
    gameOverOverlay.style.display = 'none';
    scoreDisplay.textContent = `SCORE: ${score}`;
    draw();
}

function handleKeyPress(e) {
    if (gameOver) {
    if (e.key === ' ' || e.key === 'Enter') {
        resetGame();
    }
    return;
    }

    if (!gameStarted) {
    gameStarted = true;
    startOverlay.style.display = 'none';
    }

    const newDirection = { ...direction };
    switch(e.key) {
    case 'ArrowUp': if (direction.y === 0) { newDirection.x = 0; newDirection.y = -1; } break;
    case 'ArrowDown': if (direction.y === 0) { newDirection.x = 0; newDirection.y = 1; } break;
    case 'ArrowLeft': if (direction.x === 0) { newDirection.x = -1; newDirection.y = 0; } break;
    case 'ArrowRight': if (direction.x === 0) { newDirection.x = 1; newDirection.y = 0; } break;
    default: return;
    }
    e.preventDefault();
    direction = newDirection;
}

window.addEventListener('keydown', handleKeyPress);

function gameLoop() {
    if (!gameStarted || gameOver) return;

    const head = snake[0];
    const newHead = { x: head.x + direction.x, y: head.y + direction.y };

    if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE ||
        snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
    gameOver = true;
    gameOverOverlay.style.display = 'flex';
    return;
    }

    snake.unshift(newHead);

    if (newHead.x === food.x && newHead.y === food.y) {
    score += 10;
    scoreDisplay.textContent = `SCORE: ${score}`;
    food = generateFood();
    } else {
    snake.pop();
    }

    draw();
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#9bb563';
    ctx.fillRect(0,0, canvas.width, canvas.height);

    // Draw border
    ctx.strokeStyle = '#7a934e';
    ctx.lineWidth = 2;
    ctx.strokeRect(0,0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#8ba558';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
    ctx.beginPath();
    ctx.moveTo(i * CELL_SIZE, 0);
    ctx.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * CELL_SIZE);
    ctx.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE);
    ctx.stroke();
    }

    // Draw food
    ctx.fillStyle = '#0f0f0f';
    ctx.fillRect(food.x * CELL_SIZE + 2, food.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);

    // Draw snake
    snake.forEach((segment, index) => {
    ctx.fillStyle = '#0f0f0f';
    const offset = index === 0 ? 1 : 2;
    const size = index === 0 ? CELL_SIZE - 2 : CELL_SIZE - 4;
    ctx.fillRect(segment.x * CELL_SIZE + offset, segment.y * CELL_SIZE + offset, size, size);
    });
}

resetGame();
setInterval(gameLoop, GAME_SPEED);