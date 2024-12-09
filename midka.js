const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d"); 

const phone = new Image();
phone.src = "phone.png";

const foodPNG = new Image();
foodPNG.src = "food.png";

let box = 32; // Размер одного квадратика
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let dir;

// Начальные позиции змейки
let snake = [];
snake[0] = {
    x: 9 * box,
    y: 10 * box,
};

let food = spawnFood();

function spawnFood(){
    return {
        x: Math.floor((Math.random() * 17 + 1)) * box,
        y: Math.floor((Math.random() * 15 + 3)) * box
    };
}

// Отслеживаем нажатия клавиш
document.addEventListener("keydown", direction);

function direction(e){
    if (e.keyCode == 37 && dir != "right") 
        dir = "left";
    else if (e.keyCode == 38 && dir != "down")
         dir = "up";
    else if (e.keyCode == 39 && dir != "left") 
        dir = "right";
    else if (e.keyCode == 40 && dir != "up")
         dir = "down";
}

function draw(){
    
    ctx.drawImage(phone, 0, 0); // фон

    ctx.drawImage(foodPNG, food.x, food.y); // еда

    // Рисуем змею
    for (let i = 0; i < snake.length; i++){ 
        ctx.fillStyle = i == 0 ? "black" : "green";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "cyan";
    ctx.font = "46px Comfortaa";
    ctx.fillText(score, box * 2.5, box * 1.7);

    ctx.fillStyle = "white";
    ctx.font = "24px Comfortaa";
    ctx.fillText(`High Score: ${highScore}`, box * 12, box * 1.7);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (snakeX == food.x && snakeY == food.y){
        score++;
        food = spawnFood();
        updateHighScore();
    } else {
        snake.pop();
    }

    // Столкновение со стеной
    if (snakeX < box || snakeX > box * 17 || snakeY < 3 * box || snakeY > box * 17){
        gameOver();
    }

    if (dir == "left") snakeX -= box;
    if (dir == "right") snakeX += box;
    if (dir == "up") snakeY -= box;
    if (dir == "down") snakeY += box;

    let newHead = {
        x: snakeX,
        y: snakeY
    };

    eatTail(newHead, snake);

    snake.unshift(newHead); // Новая голова
}

// Столкновение с самим собой
function eatTail(head, arr) {
    for(let i = 0; i < arr.length; i++) {
        if(head.x == arr[i].x && head.y == arr[i].y){
            gameOver();
        }
    }
}

function gameOver(){
    alert(`Game over! Score: ${score}`);
    clearInterval(game);
    localStorage.setItem("highScore", highScore);
    location.reload();
}

function updateHighScore(){
    if (score > highScore){
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }
}

let game = setInterval(draw, 100);
