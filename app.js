// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(registration => {
      console.log('Service Worker Registered:', registration);
    })
    .catch(err => {
      console.log('Service Worker registration failed:', err);
    });
}

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const cellSize = 20;
const rows = canvas.height / cellSize;
const cols = canvas.width / cellSize;

// Initialize snake: start at the center
let snake = [{ x: Math.floor(cols / 2), y: Math.floor(rows / 2) }];
let direction = { x: 0, y: 0 };
let food = spawnFood();
let speed = 100; // milliseconds per frame
let gameInterval;

// Load Bluey image for the snake head
const blueyImage = new Image();
blueyImage.src = 'bluey.png';

// Function to spawn food at a random position not occupied by the snake
function spawnFood() {
  let foodPosition;
  while (true) {
    foodPosition = {
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows)
    };
    // Ensure the food does not spawn on the snake
    if (!snake.some(segment => segment.x === foodPosition.x && segment.y === foodPosition.y)) {
      return foodPosition;
    }
  }
}

function gameLoop() {
  update();
  draw();
}

function update() {
  // If the snake hasn't started moving yet, do nothing
  if (direction.x === 0 && direction.y === 0) {
    return;
  }

  // Calculate new head position based on current direction
  let head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Wrap around if hitting the edge
  if (head.x < 0) {
    head.x = cols - 1;
  } else if (head.x >= cols) {
    head.x = 0;
  }
  if (head.y < 0) {
    head.y = rows - 1;
  } else if (head.y >= rows) {
    head.y = 0;
  }

  // Check collision with itself
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    return gameOver();
  }

  // Add the new head to the snake
  snake.unshift(head);

  // Check if food is eaten
  if (head.x === food.x && head.y === food.y) {
    food = spawnFood();
  } else {
    // Remove tail if no food eaten
    snake.pop();
  }
}

function draw() {
  // Clear the canvas
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize, cellSize);

  // Draw the snake
  for (let i = 0; i < snake.length; i++) {
    if (i === 0) {
      // Draw the head as Bluey image if loaded, else fallback to a color
      if (blueyImage.complete) {
        ctx.drawImage(blueyImage, snake[i].x * cellSize, snake[i].y * cellSize, cellSize, cellSize);
      } else {
        ctx.fillStyle = "blue";
        ctx.fillRect(snake[i].x * cellSize, snake[i].y * cellSize, cellSize, cellSize);
      }
    } else {
      ctx.fillStyle = "green";
      ctx.fillRect(snake[i].x * cellSize, snake[i].y * cellSize, cellSize, cellSize);
    }
  }
}

function gameOver() {
  clearInterval(gameInterval);
  alert("Game Over!");
  // Restart the game
  snake = [{ x: Math.floor(cols / 2), y: Math.floor(rows / 2) }];
  direction = { x: 0, y: 0 };
  food = spawnFood();
  gameInterval = setInterval(gameLoop, speed);
}

// Listen for keyboard input to change the snake's direction
document.addEventListener("keydown", e => {
  // Up (ArrowUp or 'w')
  if ((e.key === "ArrowUp" || e.key === "w") && direction.y !== 1) {
    direction = { x: 0, y: -1 };
  }
  // Down (ArrowDown or 's')
  else if ((e.key === "ArrowDown" || e.key === "s") && direction.y !== -1) {
    direction = { x: 0, y: 1 };
  }
  // Left (ArrowLeft or 'a')
  else if ((e.key === "ArrowLeft" || e.key === "a") && direction.x !== 1) {
    direction = { x: -1, y: 0 };
  }
  // Right (ArrowRight or 'd')
  else if ((e.key === "ArrowRight" || e.key === "d") && direction.x !== -1) {
    direction = { x: 1, y: 0 };
  }
});

// Start the game loop
gameInterval = setInterval(gameLoop, speed);
