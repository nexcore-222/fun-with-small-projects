const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

//Game settings
const PADDLE_WIDTH = 12, PADDLE_HEIGHT = 100;
const BALL_SIZE = 16;
const PADDLE_SPEED = 7;
const AI_SPEED = 5;

//Paddle positions
let leftPaddleY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let rightPaddleY = canvas.height / 2 - PADDLE_HEIGHT / 2;

//Ball position and velocity
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);

//Movement for left paddle
canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  let mouseY = e.clientY - rect.top;
  leftPaddleY = mouseY - PADDLE_HEIGHT / 2;
  if (leftPaddleY < 0) leftPaddleY = 0;
  if (leftPaddleY > canvas.height - PADDLE_HEIGHT) leftPaddleY = canvas.height - PADDLE_HEIGHT;
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //Draw paddles
  ctx.fillStyle = "#fff";
  ctx.fillRect(20, leftPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT);
  ctx.fillRect(canvas.width - 20 - PADDLE_WIDTH, rightPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT);

  //Draw ball
  ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);

  //Draw center line just for aesthetics
  ctx.strokeStyle = "#666";
  ctx.beginPath();
  ctx.setLineDash([8, 15]);
  ctx.moveTo(canvas.width/2, 0);
  ctx.lineTo(canvas.width/2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);
}

//Ball movement and collision
function update() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  //Top/bottom wall collision
  if (ballY <= 0 || ballY + BALL_SIZE >= canvas.height) {
    ballSpeedY *= -1;
  }

  //Left paddle collision
  if (
    ballX <= 20 + PADDLE_WIDTH &&
    ballY + BALL_SIZE > leftPaddleY &&
    ballY < leftPaddleY + PADDLE_HEIGHT
  ) {
    ballSpeedX *= -1;
    let hitPos = (ballY + BALL_SIZE/2) - (leftPaddleY + PADDLE_HEIGHT/2);
    ballSpeedY = hitPos * 0.18;
    ballX = 20 + PADDLE_WIDTH; //Sticking defense
  }

  //Right paddle collision
  if (
    ballX + BALL_SIZE >= canvas.width - 20 - PADDLE_WIDTH &&
    ballY + BALL_SIZE > rightPaddleY &&
    ballY < rightPaddleY + PADDLE_HEIGHT
  ) {
    ballSpeedX *= -1;
    let hitPos = (ballY + BALL_SIZE/2) - (rightPaddleY + PADDLE_HEIGHT/2);
    ballSpeedY = hitPos * 0.18;
    ballX = canvas.width - 20 - PADDLE_WIDTH - BALL_SIZE;
  }

  if (ballX < 0 || ballX > canvas.width) {
    ballX = canvas.width / 2 - BALL_SIZE / 2;
    ballY = canvas.height / 2 - BALL_SIZE / 2;
    ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
  }

  //Paddle follows the ball
  let aiCenter = rightPaddleY + PADDLE_HEIGHT / 2;
  if (aiCenter < ballY + BALL_SIZE / 2 - 10) rightPaddleY += AI_SPEED;
  else if (aiCenter > ballY + BALL_SIZE / 2 + 10) rightPaddleY -= AI_SPEED;
  if (rightPaddleY < 0) rightPaddleY = 0;
  if (rightPaddleY > canvas.height - PADDLE_HEIGHT) rightPaddleY = canvas.height - PADDLE_HEIGHT;
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();