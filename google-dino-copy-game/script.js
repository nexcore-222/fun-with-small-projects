const dino = document.getElementById('dino');
const cactus = document.getElementById('cactus');
const scoreDisplay = document.getElementById('score');

let isJumping = false;
let score = 0;
let gameInterval;
let cactusSpeed = 5;

function jump() {
    if (isJumping) return;

    isJumping = true;
    let jumpHeight = 0;

    let upInterval = setInterval(() => {
        if (jumpHeight >= 80) {
            clearInterval(upInterval);

            let downInterval = setInterval(() => {
                if (jumpHeight <= 0) {
                    clearInterval(downInterval);
                    isJumping = false;
                    dino.style.bottom = '0px';
                }
                jumpHeight -= 5;
                dino.style.bottom = jumpHeight + 'px';
            }, 20);
        }
        jumpHeight += 5;
        dino.style.bottom = jumpHeight + 'px';
    }, 20);
}

function moveCactus() {
    let cactusPosition = 800;

    gameInterval = setInterval(() => {
        cactusPosition -= cactusSpeed;
        cactus.style.left = cactusPosition + 'px';

        if (cactusPosition <= -20) {
            cactusPosition = 800;
            score++;
            scoreDisplay.textContent = score;

            if (score % 5 === 0) cactusSpeed += 1;
        }

        if (
            cactusPosition > 40 &&
            cactusPosition < 80 &&
            !isJumping
        ) {
            clearInterval(gameInterval);
            //alert('Game Over! Your score: ' + score);
        }
    }, 20);
}

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') jump();
});

function startGame() {
    score = 0;
    cactusSpeed = 5;
    scoreDisplay.textContent = score;
    clearInterval(gameInterval);
    moveCactus();
}

function resetGame() {
    location.reload();
}
