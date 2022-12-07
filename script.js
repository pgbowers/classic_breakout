// Nov 25,2022: from the MDN game tutorial at 
// https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript

var canvas = document.getElementById('canvas1');
var ctx = canvas.getContext('2d');

// This sets the canvas size to the entire window size...bad!
//canvas.width = window.innerWidth;
//canvas.height = window.innerHeight;

var x = canvas.width/2;
var y = canvas.height/2;
//var dx = Math.floor(Math.random() * (3 - 7
//var dx = Math.floor(Math.random() * (10 - (-10))) + (-10);
var dx = 3;
var dy = -3.5;
//var dy = Math.floor(Math.random() * (10 - (-10))) + (-10);
//var dy = Math.floor(Math.random() * (3 - 7));
var ballRadius = 12;
var paddleHeight = 24;
var paddleWidth = 104;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var paddleSpeed = 7;
var score = 0;
var lives = 3;

//console.log("Canvas width: " + canvas.width);
//console.log("Canvas height: " + canvas.height);
//console.log("Window inner width: " + window.innerWidth);
//console.log("Window inner height: " + window.innerHeight);

// Defining the bricks
var brickRowCount = 9;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 40;
var brickOffsetLeft = 35;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
canvas.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(event) {
    // offsetLeft: number of pixels that canvas is offset to the left from the parent.
    var relativeX = event.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

console.log(canvas.offsetLeft);

var bricks = [];
for ( var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x:0, y: 0, status: 1 };
    }
}

function drawLives(){
    ctx.font = "24px Arial";
    ctx.fillStyle = "red";
    ctx.fillText('Lives: ' + lives, canvas.width - (canvas.width -700), canvas.height - 570);
}

function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            // Don't draw a brick if the ball is in collision
            if (bricks[c][r].status == 1) {
            // Calculate position to draw each new block
            var brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
            //var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            var brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;

            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;

            // Draw a brick
            var brick = new Image();
            brick.src = "assets/PURPLEBRICK.png";
            ctx.drawImage(brick, brickX, brickY);
            //ctx.beginPath();
            //ctx.rect(brickX, brickY, brickWidth, brickHeight);
            //ctx.fillStyle = "#0095dd";
            //ctx.fill();
            //ctx.closePath();
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
    //var ball = new Image();
    //ball.src = "assets/PURPLEBALL.png";
    //ctx.drawImage(ball, x, y);
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.closePath(); 
}

function drawPaddle(){
    //ctx.beginPath();
    //ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    //ctx.fillStyle = 'green';
    //ctx.fill();
    //ctx.closePath();
    var paddle = new Image();
    paddle.src = "assets/REDPADDLEM.png";
    ctx.drawImage(paddle, paddleX, canvas.height - paddleHeight);
    //document.div.appendChild(img);
}

function drawScore() {
    ctx.font = "24px Arial";
    ctx.fillStyle = "red";
    ctx.fillText('Score: ' + score, canvas.width - 780, canvas.height - 570);
}

function collisionDetection(){
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            // Calculations
            if (b.status == 1) {
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
console.log(canvas.height);
console.log(paddleHeight);
function draw() {
    // Drawing code
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle(); 
    drawScore();
    collisionDetection(); 
    drawLives();   

    // Bounce off both sides
    if( x + dx > canvas.width - ballRadius || x + dx < ballRadius){    
        dx = -dx; 
    }
    // Bounce off the top
    if (y + dy < 0){
        dy = -dy;     
    }    
    // If the ball gets near the bottom of the canvas
    else if (y + dy > canvas.height - paddleHeight){ 
        // and the ball is over the paddle   
        if( x > paddleX && x < paddleX + paddleWidth){
            // bounce off the top of the paddle
            if(y + dy > (canvas.height - paddleHeight * 2)){
            dy = -dy;           
        }    }
        // If the ball missed the paddle
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
                    y = canvas.height / 2;
                    dx = 3;
                    dy = -3.5;
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