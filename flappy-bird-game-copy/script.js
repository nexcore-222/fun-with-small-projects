const bird = document.getElementById("bird");
const gameWindow = document.getElementById("game_window");


let birdY = gameWindow.offsetHeight / 2; 
let jump = -25;
let gravity = 2; 
let velocity = 0;
let gameInterval;
let pipes = [];
let pipeWidth = 50;
let pipeGap = 120;
let pipeSpeed = 4;
let pipeInterval = 2000;
let pipeIntervalID;
let score = 0;

function createPipe() {
    let pipeHeight = Math.random() * (gameWindow.offsetHeight - pipeGap - 50) + 50;

    let topPipe = document.createElement("div");
    topPipe.classList.add("pipe", "top");
    topPipe.style.height = pipeHeight + "px";
    topPipe.style.left = gameWindow.offsetWidth + "px";
    gameWindow.appendChild(topPipe);
    pipes.push(topPipe);

    let bottomPipe = document.createElement("div");
    bottomPipe.classList.add("pipe");
    bottomPipe.style.height = (gameWindow.offsetHeight - pipeHeight - pipeGap) + "px";
    bottomPipe.style.left = gameWindow.offsetWidth + "px";
    gameWindow.appendChild(bottomPipe);
    pipes.push(bottomPipe);
}

function updatePipes() {
    for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        let pipeX = parseFloat(pipe.style.left);
        pipeX -= pipeSpeed;

        if (pipeX + pipeWidth < 0) {
            pipe.remove();
            pipes.splice(i, 1);
            i--;
        } else {
            pipe.style.left = pipeX + "px";
        }
    }
}

function startGame() {
    birdY = gameWindow.offsetHeight / 2;
    velocity = 0;

    if (gameInterval) clearInterval(gameInterval);
    if (pipeIntervalID) clearInterval(pipeIntervalID);

    pipes.forEach(pipe => pipe.remove());
    pipes = [];

    score = 0;
    updateScore();

    gameInterval = setInterval(gameLoop, 30);
    pipeIntervalID = setInterval(createPipe, pipeInterval);
}

function updateScore() {
    document.getElementById("score").textContent = score;
}

function checkScore() {
    for (let pipe of pipes) {
        if (!pipe.passed && pipe.classList.contains("top")) {
            let pipeX = parseFloat(pipe.style.left);
            if (pipeX + pipeWidth < bird.offsetLeft) {
                pipe.passed = true;
                score++;
                updateScore();
            }
        }
    }
}

function updateBird() {
    velocity += gravity;  
    birdY += velocity;    
    
    if (birdY > gameWindow.offsetHeight - bird.offsetHeight) {
        birdY = gameWindow.offsetHeight - bird.offsetHeight;
        velocity = 0;
    }

    bird.style.top = birdY + "px";
}

function checkCollision() {
    let birdRect = bird.getBoundingClientRect();
    let gameRect = gameWindow.getBoundingClientRect();

    if (birdRect.top <= gameRect.top || birdRect.bottom >= gameRect.bottom) {
        gameOver();
        return;
    }

    for (let pipe of pipes) {
        let pipeRect = pipe.getBoundingClientRect();
        if (
            birdRect.left < pipeRect.right &&
            birdRect.right > pipeRect.left &&
            birdRect.top < pipeRect.bottom &&
            birdRect.bottom > pipeRect.top
        ) {
            gameOver();
            return;
        }
    }
}

function flyUp(){
    velocity = jump;
}

document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        flyUp();
    }
});

gameWindow.addEventListener("click", flyUp);

function gameOver() {
    clearInterval(gameInterval);
    clearInterval(pipeIntervalID);
    alert("Game Over!");
}

function gameLoop() {
    updatePipes();
    updateBird();
    checkCollision();
    checkScore();
}

