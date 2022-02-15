document.addEventListener("DOMContentLoaded", () => {
    const squares = document.querySelectorAll(".grid div");
    const scoreDisplay = document.querySelector("span");
    const startBtn = document.querySelector(".start");

    const width = 10;
    let appleIndex = 0;
    let currentSnake = [2, 1, 0];
    let direction = 1;
    let currentDirection = 1;
    let score = 0;
    let speed = 0.9;
    let intervalTime = 0;
    let interval = 0;

    function startGame() {
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

    function control(e) {
        if (e.keyCode === 39) {
            if (currentDirection === -1) {
                return;
            }
            direction = 1;
        } else if (e.keyCode === 38) {
            if (currentDirection === width) {
                return;
            }
            direction = -width;
        } else if (e.keyCode === 37) {
            if (currentDirection === 1) {
                return;
            }
            direction = -1;
        } else if (e.keyCode === 40) {
            if (currentDirection === -width) {
                return;
            }
            direction = width;
        }
    }

    document.addEventListener("keyup", control);
    startBtn.addEventListener("click", startGame);
});
