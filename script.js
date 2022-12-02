// Nov 25,2022: from the MDN game tutorial at 
// https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

let x = canvas.width/2;
let y = canvas.height-30;
let dx = 3;
let dy = 3.5;
const ballRadius = 10;
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
let paddleSpeed = 7;
let score = 0;
let lives = 3;

// Defining the bricks
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(event) {
    const relativeX = event.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

const bricks = [];
for ( let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x:0, y: 0, status: 1 };
    }
}

function drawLives(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText('Lives: ' + lives, 420, 20);
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            // Don't draw a brick if the ball is in collision
            if (bricks[c][r].status === 1) {
            // Calculate position to draw each new block
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;

            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;

            // Draw a brick
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = "#0095dd";
            ctx.fill();
            ctx.closePath();
            }
        }
    }
}

function keyDownHandler(event) {
    if (event.key === 'Right' || event.key === "ArrowRight"){
        rightPressed = true;
    } else if ( event.key === "Left" || event.key === "ArrowLeft"){
        leftPressed = true;
    }
}

function keyUpHandler(event) {
    if (event.key === 'Right' || event.key === "ArrowRight"){
        rightPressed = false;
    } else if ( event.key === "Left" || event.key === "ArrowLeft"){
        leftPressed = false;
    }
}

function drawBall(){
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.closePath(); 
}

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText('Score: ' + score, 8, 20);
}

function collisionDetection(){
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            // Calculations
            if (b.status === 1) {
                if (x > b.x && 
                    x < b.x + brickWidth && 
                    y > b.y && 
                    y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score == brickRowCount * brickColumnCount){
                        alert("WINNER!!!");
                        document.location.reload();                        
                    }
                }
            }
        }
    }
}

function draw() {
    // Drawing code
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle(); 
    drawScore();
    collisionDetection(); 
    drawLives();
   // drawScore();  

    // Bounce off three walls
    if( x + dx < ballRadius || x + dx > canvas.width-ballRadius){
        dx = -dx; 
    }
    if (y + dy < ballRadius){
        dy = -dy;     
    }
    else if (y + dy > canvas.height - ballRadius){
        if( x > paddleX && x < paddleX + paddleWidth){
            dy = -dy;
        }
        else {            
                //ctx.fillStyle = 'red';
                //ctx.font = "30px serif";
                //ctx.fillText( 'GAME OVER!', 150, canvas.height/2);
                //ctx.fillStyle = 'red';
                //ctx.font = "20px serif";
                //ctx.fillText( 'Click to play again.', 150, 300);		
                //return;
                lives--;
                if(!lives) {
                    alert("You Lose!!");
                document.location.reload();                
                } else{
                    x = canvas.width / 2;
                    y = canvas.height - 30;
                    dx = 3;
                    dy = 3.5;
                    paddleX = (canvas.width - paddleWidth) / 2;
                }
                	            
        }
    
    }    
    // Move the ball every frame
    if (rightPressed) {
        paddleX = Math.min(paddleX + paddleSpeed, canvas.width - paddleWidth);
    } else if (leftPressed) {
        paddleX = Math.max(paddleX - paddleSpeed, 0);
    } 
    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}  
draw();