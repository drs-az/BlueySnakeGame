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
let speed; // will be set based on user selection
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
  if (direction.x === 0 && direction.y === 0) return;

  // Calculate new head position based on current direction
  let head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Wrap around when hitting the edge
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

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = spawnFood();
  } else {
    snake.pop();
  }
}

function draw() {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize, cellSize);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    if (i === 0) {
      // Draw the head as Bluey image if loaded, else fallback
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

// Keyboard input for directional control
document.addEventListener("keydown", e => {
  if ((e.key === "ArrowUp" || e.key === "w") && direction.y !== 1) {
    direction = { x: 0, y: -1 };
  } else if ((e.key === "ArrowDown" || e.key === "s") && direction.y !== -1) {
    direction = { x: 0, y: 1 };
  } else if ((e.key === "ArrowLeft" || e.key === "a") && direction.x !== 1) {
    direction = { x: -1, y: 0 };
  } else if ((e.key === "ArrowRight" || e.key === "d") && direction.x !== -1) {
    direction = { x: 1, y: 0 };
  }
});

// Virtual directional keys event listeners (for mobile/tablet)
const btnUp = document.getElementById("btn-up");
const btnDown = document.getElementById("btn-down");
const btnLeft = document.getElementById("btn-left");
const btnRight = document.getElementById("btn-right");

if (btnUp && btnDown && btnLeft && btnRight) {
  btnUp.addEventListener("click", () => {
    if (direction.y !== 1) direction = { x: 0, y: -1 };
  });
  btnDown.addEventListener("click", () => {
    if (direction.y !== -1) direction = { x: 0, y: 1 };
  });
  btnLeft.addEventListener("click", () => {
    if (direction.x !== 1) direction = { x: -1, y: 0 };
  });
  btnRight.addEventListener("click", () => {
    if (direction.x !== -1) direction = { x: 1, y: 0 };
  });
}

// --- Speed Selection Modal Logic ---
const speedModal = document.getElementById("speedModal");
const speedButtons = document.querySelectorAll(".speed-option");

// Wait for a speed selection before starting the game
speedButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    speed = parseInt(btn.dataset.speed);
    // Hide the modal
    speedModal.style.display = "none";
    // Start the game loop at the selected speed
    gameInterval = setInterval(gameLoop, speed);
  });
});