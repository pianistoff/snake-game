const squares = document.querySelectorAll(".grid div");
const grid = document.querySelector(".grid");
const gridStyles = window.getComputedStyle(grid);

function responsivePortrait() {
    grid.style.width = "100%";
    const gridWidth = gridStyles.getPropertyValue("width");
    grid.style.height = gridWidth;
    const widthPixelless = gridWidth
        .split("")
        .reverse()
        .slice(2)
        .reverse()
        .join("");

    squares.forEach((square) => {
        square.style.width = (widthPixelless - 2) / 20 + "px";
        square.style.height = (widthPixelless - 2) / 20 + "px";
    });
}

function responsiveLandscape() {
    grid.style.height = "100%";
    const gridHeight = gridStyles.getPropertyValue("height");
    grid.style.width = gridHeight;
    const heightPixelless = gridHeight
        .split("")
        .reverse()
        .slice(2)
        .reverse()
        .join("");

    squares.forEach((square) => {
        square.style.width = (heightPixelless - 2) / 20 + "px";
        square.style.height = (heightPixelless - 2) / 20 + "px";
    });
}

function responsive() {
    if (window.innerHeight > window.innerWidth) {
        responsivePortrait();
    } else if (window.innerHeight < window.innerWidth) {
        responsiveLandscape();
    }
}

responsive();
window.onresize = responsive;

document.addEventListener("DOMContentLoaded", () => {
    const scoreDisplay = document.querySelector("span");
    const finalScore = document.querySelector("#final_score");
    const startBtn = document.querySelector(".start");
    const volumeBtn = document.querySelector(".checkbox-volume");
    const layoutBtn = document.querySelector(".layout");
    const closeBtn = document.querySelector(".close");
    const upKey = document.querySelector(".up");
    const rightKey = document.querySelector(".right");
    const downKey = document.querySelector(".down");
    const leftKey = document.querySelector(".left");
    const modal = document.querySelector(".modal");
    const sounds = {
        beep: new Howl({
            src: [
                "./sounds/beep.wav",
                "./sounds/beep.webm",
                "./sounds/beep.mp3",
            ],
        }),
        gameOver: new Howl({
            src: [
                "./sounds/game-over.wav",
                "./sounds/game-over.webm",
                "./sounds/game-over.mp3",
            ],
        }),
    };

    const width = 20;
    let appleIndex = 0;
    let currentSnake = [2, 1, 0];
    let direction = 1;
    let currentDirection = 1;
    let score = 0;
    let speed = 0.95;
    let intervalTime = 0;
    let interval = 0;

    function startGame() {
        modal.classList.remove("show");
        currentSnake.forEach((index) =>
            squares[index].classList.remove("snake")
        );
        squares[appleIndex].classList.remove("apple");
        clearInterval(interval);
        score = 0;
        direction = 1;
        currentDirection = 1;
        scoreDisplay.innerHTML = score;
        intervalTime = 1000;
        currentSnake = [2, 1, 0];
        currentSnake.forEach((index) => squares[index].classList.add("snake"));
        randomApple();
        interval = setInterval(moveOutcomes, intervalTime);
    }

    function moveOutcomes() {
        if (
            (currentSnake[0] + width >= width * width && direction === width) ||
            (currentSnake[0] % width === width - 1 && direction === 1) ||
            (currentSnake[0] % width === 0 && direction === -1) ||
            (currentSnake[0] - width < 0 && direction === -width) ||
            squares[currentSnake[0] + direction].classList.contains("snake")
        ) {
            modal.classList.add("show");
            finalScore.innerHTML = score;
            sounds.gameOver.play();
            return clearInterval(interval);
        }

        const tail = currentSnake.pop();
        squares[tail].classList.remove("snake");
        currentSnake.unshift(currentSnake[0] + direction);

        if (
            currentSnake[0] === appleIndex ||
            squares[currentSnake[0]].classList.contains("apple")
        ) {
            squares[currentSnake[0]].classList.remove("apple");
            sounds.beep.play();
            squares[tail].classList.add("snake");
            currentSnake.push(tail);
            randomApple();
            score++;
            scoreDisplay.textContent = score;
            clearInterval(interval);
            intervalTime = intervalTime * speed;
            interval = setInterval(moveOutcomes, intervalTime);
        }
        squares[currentSnake[0]].classList.add("snake");
        currentDirection = direction;
    }

    function randomApple() {
        do {
            appleIndex = Math.floor(Math.random() * squares.length);
        } while (
            currentSnake.includes(appleIndex) ||
            squares[appleIndex].classList.contains("snake")
        );
        squares[appleIndex].classList.add("apple");
    }

    function up() {
        if (currentDirection === width) {
            return;
        }
        direction = -width;
    }

    function right() {
        if (currentDirection === -1) {
            return;
        }
        direction = 1;
    }

    function down() {
        if (currentDirection === -width) {
            return;
        }
        direction = width;
    }

    function left() {
        if (currentDirection === 1) {
            return;
        }
        direction = -1;
    }

    function control(e) {
        if (
            e.code === "ArrowRight" ||
            e.code === "KeyD" ||
            e.keyCode === 39 ||
            e.keyCode === 68
        ) {
            right();
        } else if (
            e.code === "ArrowUp" ||
            e.code === "KeyW" ||
            e.keyCode === 38 ||
            e.keyCode === 87
        ) {
            up();
        } else if (
            e.code === "ArrowLeft" ||
            e.code === "KeyA" ||
            e.keyCode === 37 ||
            e.keyCode === 65
        ) {
            left();
        } else if (
            e.code === "ArrowDown" ||
            e.code === "KeyS" ||
            e.keyCode === 40 ||
            e.keyCode === 83
        ) {
            down();
        }
    }

    upKey.addEventListener("click", up);
    rightKey.addEventListener("click", right);
    downKey.addEventListener("click", down);
    leftKey.addEventListener("click", left);
    document.addEventListener("keyup", control);
    startBtn.addEventListener("click", startGame);
    volumeBtn.addEventListener("change", function () {
        if (this.checked) {
            Howler.mute(true);
            this.parentElement
                .querySelector("path")
                .setAttribute(
                    "d",
                    "M320 64v383.1c0 12.59-7.337 24.01-18.84 29.16C296.1 479.1 292.4 480 288 480c-7.688 0-15.28-2.781-21.27-8.094l-134.9-119.9H48c-26.51 0-48-21.49-48-47.1V208c0-26.51 21.49-47.1 48-47.1h83.84l134.9-119.9c9.422-8.375 22.93-10.45 34.43-5.259C312.7 39.1 320 51.41 320 64z"
                );
        } else {
            Howler.mute(false);
            this.parentElement
                .querySelector("path")
                .setAttribute(
                    "d",
                    "M412.6 182c-10.28-8.334-25.41-6.867-33.75 3.402c-8.406 10.24-6.906 25.35 3.375 33.74C393.5 228.4 400 241.8 400 255.1c0 14.17-6.5 27.59-17.81 36.83c-10.28 8.396-11.78 23.5-3.375 33.74c4.719 5.806 11.62 8.802 18.56 8.802c5.344 0 10.75-1.779 15.19-5.399C435.1 311.5 448 284.6 448 255.1S435.1 200.4 412.6 182zM473.1 108.2c-10.22-8.334-25.34-6.898-33.78 3.34c-8.406 10.24-6.906 25.35 3.344 33.74C476.6 172.1 496 213.3 496 255.1s-19.44 82.1-53.31 110.7c-10.25 8.396-11.75 23.5-3.344 33.74c4.75 5.775 11.62 8.771 18.56 8.771c5.375 0 10.75-1.779 15.22-5.431C518.2 366.9 544 313 544 255.1S518.2 145 473.1 108.2zM534.4 33.4c-10.22-8.334-25.34-6.867-33.78 3.34c-8.406 10.24-6.906 25.35 3.344 33.74C559.9 116.3 592 183.9 592 255.1s-32.09 139.7-88.06 185.5c-10.25 8.396-11.75 23.5-3.344 33.74C505.3 481 512.2 484 519.2 484c5.375 0 10.75-1.779 15.22-5.431C601.5 423.6 640 342.5 640 255.1S601.5 88.34 534.4 33.4zM301.2 34.98c-11.5-5.181-25.01-3.076-34.43 5.29L131.8 160.1H48c-26.51 0-48 21.48-48 47.96v95.92c0 26.48 21.49 47.96 48 47.96h83.84l134.9 119.8C272.7 477 280.3 479.8 288 479.8c4.438 0 8.959-.9314 13.16-2.835C312.7 471.8 320 460.4 320 447.9V64.12C320 51.55 312.7 40.13 301.2 34.98z"
                );
        }
    });
    closeBtn.addEventListener("click", () => {
        modal.classList.remove("show");
    });
});
